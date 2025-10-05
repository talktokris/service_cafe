<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Earning;
use App\Models\Transaction;
use App\Models\CashWalletTransaction;
use Carbon\Carbon;

class EarningsController extends Controller
{
    /**
     * Display earnings page for paid members
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
        $query = Earning::where('user_id', $user->id)
            ->whereBetween('created_at', [$fromDate . ' 00:00:00', $toDate . ' 23:59:59'])
            ->orderBy('created_at', 'desc');

        // Filter by type if specified
        if ($type) {
            $query->where('transation_type', $type);
        }

        $earnings = $query->get();

        // Calculate summary data
        $summary = $this->calculateEarningsSummary($user->id);

        return inertia('Members/PaidMember/Earnings', [
            'earnings' => $earnings,
            'summary' => $summary,
        ]);
    }

    /**
     * Create withdrawal request
     */
    public function createWithdrawal(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
        ]);

        $user = Auth::user();
        $amount = $request->amount;
        $minWithdrawalAmount = env('WITHDRAWAL_MIN_AMOUT', 1000);
        $personalTaxPercentage = env('PERSONAL_TAX_PERCENTAGE', 15);

        // Get current earning balance
        $summary = $this->calculateEarningsSummary($user->id);
        $currentBalance = $summary['earning_balance'];

        // Validate withdrawal amount
        if ($amount < $minWithdrawalAmount) {
            return back()->withErrors([
                'message' => "Minimum withdrawal amount is ₹{$minWithdrawalAmount}."
            ]);
        }

        if ($amount > $currentBalance) {
            return back()->withErrors([
                'message' => 'Withdrawal amount cannot exceed your current earning balance.'
            ]);
        }

        try {
            DB::beginTransaction();

            // Calculate amounts based on new logic
            $cashoutWithdrawalAmount = $amount * 0.80; // 80% of total amount
            $redistributionWithdrawalAmount = $amount * 0.20; // 20% of total amount
            $repurchaseAmount = $amount * 0.20; // 20% of total amount for repurchase
            $cashInAmount = $amount * 0.80; // 80% of total amount for cash in
            $taxAmount = $cashInAmount * ($personalTaxPercentage / 100); // 15% of the 80% amount

            $today = now();

            // 1. Create Cash Out earning record
            $cashoutEarning = Earning::create([
                'user_id' => $user->id,
                'order_id' => null,
                'user_trigger_id' => $user->id,
                'earning_name' => 'Cash Out',
                'earning_type' => 'Withdrawal',
                'earning_description' => 'Cash Out Withdrawal',
                'ammout' => $cashoutWithdrawalAmount,
                'debit_credit' => 1, // Debit
                'transation_type' => 2, // Withdrawal
                'withdrawal_status' => 1, // Done
                'redistribution_status' => 0, // Not distributed
                'status' => 1, // Active
                'deleteStatus' => 0,
                'countStatus' => 1,
            ]);

            // 2. Create Redistribution earning record
            $redistributionEarning = Earning::create([
                'user_id' => $user->id,
                'order_id' => null,
                'user_trigger_id' => $user->id,
                'earning_name' => 'Redistribution Out',
                'earning_type' => 'Redistribution',
                'earning_description' => 'Redistribution Amount',
                'ammout' => $redistributionWithdrawalAmount,
                'debit_credit' => 1, // Debit
                'transation_type' => 3, // Redistribution
                'withdrawal_status' => 0, // Pending
                'redistribution_status' => 1, // Distributed
                'status' => 1, // Active
                'deleteStatus' => 0,
                'countStatus' => 1,
            ]);

            // 3. Save 20% amount in transactions table as Repurchase Credited
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
                'amount' => $repurchaseAmount,
                'transaction_date' => $today,
                'status' => 1,
                'tax_status' => 0, // Not tax amount
                'countStatus' => 0,
            ]);

            // 4. Insert 80% amount into cash_wallets_transactions table - Cash In transaction
            CashWalletTransaction::create([
                'user_id' => $user->id,
                'trigger_id' => $user->id,
                'create_user_id' => $user->id,
                'name' => 'Earning Cash In',
                'type' => 'Cash In',
                'transaction_type' => 1, // 1 - cashIn
                'debit_credit' => 2, // Credit
                'amount' => $cashInAmount,
                'transaction_date' => $today,
                'cash_out_status' => 0,
                'tax_status' => 0,
                'status' => 1,
                'deleteStatus' => 0,
            ]);

            // 5. Insert tax amount (15% of 80%) into cash_wallets_transactions table - Tax Amount Debited
            CashWalletTransaction::create([
                'user_id' => $user->id,
                'trigger_id' => $user->id,
                'create_user_id' => $user->id,
                'name' => 'Tax Amount Debited',
                'type' => 'Tax',
                'transaction_type' => 2, // 2 - tax
                'debit_credit' => 1, // Debit
                'amount' => $taxAmount,
                'transaction_date' => $today,
                'cash_out_status' => 0,
                'tax_status' => 1,
                'status' => 1,
                'deleteStatus' => 0,
            ]);

            DB::commit();

            Log::info('Withdrawal processed successfully with earnings and new logic', [
                'user_id' => $user->id,
                'total_amount' => $amount,
                'cashout_withdrawal_amount' => $cashoutWithdrawalAmount, // 80% of total
                'redistribution_withdrawal_amount' => $redistributionWithdrawalAmount, // 20% of total
                'repurchase_amount' => $repurchaseAmount, // 20% of total
                'cash_in_amount' => $cashInAmount, // 80% of total
                'tax_amount' => $taxAmount, // 15% of 80% amount
                'personal_tax_percentage' => $personalTaxPercentage,
                'cashout_earning_id' => $cashoutEarning->id,
                'redistribution_earning_id' => $redistributionEarning->id,
            ]);

            return back()->with('success', 'Withdrawal processed successfully! Cash out: ₹' . number_format($cashoutWithdrawalAmount, 2) . ', Redistribution: ₹' . number_format($redistributionWithdrawalAmount, 2) . ', Cash in: ₹' . number_format($cashInAmount, 2) . ', Tax: ₹' . number_format($taxAmount, 2));

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Withdrawal processing failed', [
                'user_id' => $user->id,
                'amount' => $amount,
                'error' => $e->getMessage()
            ]);

            return back()->withErrors([
                'message' => 'Failed to process withdrawal. Please try again.'
            ]);
        }
    }

    /**
     * Calculate earnings summary for a user
     */
    private function calculateEarningsSummary($userId)
    {
        $now = Carbon::now();
        $monthStart = $now->copy()->startOfMonth();
        $monthEnd = $now->copy()->endOfMonth();

        // Total earnings (all time)
        $totalEarnings = Earning::where('user_id', $userId)
            ->where('transation_type', 1) // Earning
            ->where('debit_credit', 2) // Credit
            ->sum('ammout');

        // This month earnings
        $monthEarnings = Earning::where('user_id', $userId)
            ->where('transation_type', 1) // Earning
            ->where('debit_credit', 2) // Credit
            ->whereBetween('created_at', [$monthStart, $monthEnd])
            ->sum('ammout');

        // Total withdrawals (all time)
        $totalWithdrawals = Earning::where('user_id', $userId)
            ->where('transation_type', 2) // Withdrawal
            ->where('debit_credit', 1) // Debit
            ->sum('ammout');

        // This month withdrawals
        $monthWithdrawals = Earning::where('user_id', $userId)
            ->where('transation_type', 2) // Withdrawal
            ->where('debit_credit', 1) // Debit
            ->whereBetween('created_at', [$monthStart, $monthEnd])
            ->sum('ammout');

        // Total redistributions (all time)
        $totalRedistributions = Earning::where('user_id', $userId)
            ->where('transation_type', 3) // Redistribution
            ->sum('ammout');

        // This month redistributions
        $monthRedistributions = Earning::where('user_id', $userId)
            ->where('transation_type', 3) // Redistribution
            ->whereBetween('created_at', [$monthStart, $monthEnd])
            ->sum('ammout');

        // Calculate earning balance (total earnings - total withdrawals)
        $earningBalance = $totalEarnings - $totalWithdrawals;

        return [
            'total_earnings' => $totalEarnings,
            'month_earnings' => $monthEarnings,
            'total_withdrawals' => $totalWithdrawals,
            'month_withdrawals' => $monthWithdrawals,
            'total_redistributions' => $totalRedistributions,
            'month_redistributions' => $monthRedistributions,
            'earning_balance' => $earningBalance,
        ];
    }

    /**
     * Get earnings data via API (for AJAX requests)
     */
    public function getEarnings(Request $request)
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
        $query = Earning::where('user_id', $user->id)
            ->whereBetween('created_at', [$fromDate . ' 00:00:00', $toDate . ' 23:59:59'])
            ->orderBy('created_at', 'desc');

        // Filter by type if specified
        if ($type) {
            $query->where('transation_type', $type);
        }

        $earnings = $query->get();
        $summary = $this->calculateEarningsSummary($user->id);

        return response()->json([
            'earnings' => $earnings,
            'summary' => $summary,
        ]);
    }
}