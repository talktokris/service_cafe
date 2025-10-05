<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\CashWalletTransaction;
use App\Models\Transaction;
use Carbon\Carbon;

class CashWalletController extends Controller
{
    /**
     * Display cash wallet page for paid members
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if ($user->member_type !== 'paid') {
            return redirect()->route('member.p.dashboard')->with('error', 'Access denied. Paid members only.');
        }

        // Get search parameters
        $fromDate = $request->get('from_date');
        $toDate = $request->get('to_date');
        $type = $request->get('type');

        // Default to current month if no dates provided
        if (!$fromDate) {
            $fromDate = Carbon::now()->startOfMonth()->format('Y-m-d');
        }
        if (!$toDate) {
            $toDate = Carbon::now()->endOfMonth()->format('Y-m-d');
        }

        // Build query
        $query = CashWalletTransaction::where('user_id', $user->id)
            ->whereBetween('transaction_date', [$fromDate . ' 00:00:00', $toDate . ' 23:59:59'])
            ->orderBy('transaction_date', 'desc');

        // Filter by type if specified
        if ($type) {
            $query->where('transaction_type', $type);
        }

        $transactions = $query->get();

        // Calculate summary data
        $summary = $this->calculateCashWalletSummary($user->id);

        return inertia('Members/PaidMember/CashWallet', [
            'transactions' => $transactions,
            'summary' => $summary,
            'auth' => ['user' => $user],
            'walletBalance' => $summary['total_balance'],
            'filters' => [
                'from_date' => $fromDate,
                'to_date' => $toDate,
                'type' => $type,
            ],
        ]);
    }

    /**
     * Create cash out request
     */
    public function createCashOut(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
        ]);

        $user = Auth::user();
        $amount = $request->amount;

        // Get current cash wallet balance
        $summary = $this->calculateCashWalletSummary($user->id);
        $currentBalance = $summary['total_balance'];

        // Validate cash out amount
        if ($amount > $currentBalance) {
            return back()->withErrors([
                'message' => 'Cash out amount cannot exceed your current cash wallet balance.'
            ]);
        }

        try {
            DB::beginTransaction();

            $today = now();

            // Insert into cash_wallets_transactions table
            CashWalletTransaction::create([
                'user_id' => $user->id,
                'trigger_id' => $user->id,
                'create_user_id' => $user->id,
                'name' => 'Amount Cash Out',
                'type' => 'Cash Out',
                'transaction_type' => 3, // 3 - withdrawal
                'debit_credit' => 1, // Debit
                'amount' => $amount,
                'transaction_date' => $today,
                'cash_out_status' => 0,
                'tax_status' => 0,
                'status' => 1,
                'deleteStatus' => 0,
            ]);

            DB::commit();

            Log::info('Cash out request processed successfully', [
                'user_id' => $user->id,
                'amount' => $amount,
            ]);

            return back()->with('success', 'Your cash out request is successfully submitted. Please visit our branch to collect the cash.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Cash out request failed', [
                'user_id' => $user->id,
                'amount' => $amount,
                'error' => $e->getMessage()
            ]);

            return back()->withErrors([
                'message' => 'Failed to process cash out request. Please try again.'
            ]);
        }
    }

    /**
     * Transfer to purchase balance
     */
    public function transferToPurchaseBalance(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
        ]);

        $user = Auth::user();
        $amount = $request->amount;

        // Get current cash wallet balance
        $summary = $this->calculateCashWalletSummary($user->id);
        $currentBalance = $summary['total_balance'];

        // Validate transfer amount
        if ($amount > $currentBalance) {
            return back()->withErrors([
                'message' => 'Transfer amount cannot exceed your current cash wallet balance.'
            ]);
        }

        try {
            DB::beginTransaction();

            $today = now();

            // Insert into cash_wallets_transactions table
            CashWalletTransaction::create([
                'user_id' => $user->id,
                'trigger_id' => $user->id,
                'create_user_id' => $user->id,
                'name' => 'Amount Transfer to Purchase Account',
                'type' => 'Cash Transfer',
                'transaction_type' => 4, // 4 - transferCredit
                'debit_credit' => 1, // Debit
                'amount' => $amount,
                'transaction_date' => $today,
                'cash_out_status' => 0,
                'tax_status' => 0,
                'status' => 1,
                'deleteStatus' => 0,
            ]);

            // Insert into transactions table
            Transaction::create([
                'transaction_nature' => 'Tax Amount Debited',
                'transaction_type' => 'Repurchase Credited',
                'debit_credit' => 2, // Credit
                'matching_date' => $today->toDateString(),
                'transaction_from_id' => $user->id,
                'transaction_to_id' => $user->id,
                'trigger_id' => $user->id,
                'order_id' => null,
                'created_user_id' => $user->id,
                'amount' => $amount,
                'transaction_date' => $today,
                'status' => 1,
                'tax_status' => 0, // Not tax amount
                'countStatus' => 0,
            ]);

            DB::commit();

            Log::info('Transfer to purchase balance processed successfully', [
                'user_id' => $user->id,
                'amount' => $amount,
            ]);

            return back()->with('success', 'You have successfully transferred amount to purchase wallet.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Transfer to purchase balance failed', [
                'user_id' => $user->id,
                'amount' => $amount,
                'error' => $e->getMessage()
            ]);

            return back()->withErrors([
                'message' => 'Failed to process transfer. Please try again.'
            ]);
        }
    }

    /**
     * Calculate cash wallet summary for a user
     */
    private function calculateCashWalletSummary($userId)
    {
        // Total cash in (credit transactions)
        $totalCashIn = CashWalletTransaction::where('user_id', $userId)
            ->where('debit_credit', 2) // Credit
            ->sum('amount');

        // Total cash out (withdrawal transactions only - transaction_type = 3)
        $totalCashOut = CashWalletTransaction::where('user_id', $userId)
            ->where('transaction_type', 3) // 3 - withdrawal
            ->sum('amount');

        // Total transfer (transferCredit transactions)
        $totalTransfer = CashWalletTransaction::where('user_id', $userId)
            ->where('transaction_type', 4) // transferCredit
            ->sum('amount');

        // Calculate total balance (cash in - (cash out + transfer))
        $totalBalance = $totalCashIn - ($totalCashOut + $totalTransfer);

        return [
            'total_cash_in' => $totalCashIn,
            'total_cash_out' => $totalCashOut,
            'total_transfer' => $totalTransfer,
            'total_balance' => $totalBalance,
        ];
    }

    /**
     * Get cash wallet data via API (for AJAX requests)
     */
    public function getCashWalletData(Request $request)
    {
        $user = Auth::user();
        
        if ($user->member_type !== 'paid') {
            return response()->json(['error' => 'Access denied'], 403);
        }

        // Get search parameters
        $fromDate = $request->get('from_date');
        $toDate = $request->get('to_date');
        $type = $request->get('type');

        // Default to current month if no dates provided
        if (!$fromDate) {
            $fromDate = Carbon::now()->startOfMonth()->format('Y-m-d');
        }
        if (!$toDate) {
            $toDate = Carbon::now()->endOfMonth()->format('Y-m-d');
        }

        // Build query
        $query = CashWalletTransaction::where('user_id', $user->id)
            ->whereBetween('transaction_date', [$fromDate . ' 00:00:00', $toDate . ' 23:59:59'])
            ->orderBy('transaction_date', 'desc');

        // Filter by type if specified
        if ($type) {
            $query->where('transaction_type', $type);
        }

        $transactions = $query->get();
        $summary = $this->calculateCashWalletSummary($user->id);

        return response()->json([
            'transactions' => $transactions,
            'summary' => $summary,
        ]);
    }
}
