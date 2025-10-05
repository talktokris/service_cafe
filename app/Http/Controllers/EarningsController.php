<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Earning;
use App\Models\Transaction;
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

            // Calculate 80/20 split
            $cashoutWithdrawalAmount = $amount * 0.80; // 80% for cash out
            $redistributionWithdrawalAmount = $amount * 0.20; // 20% for redistribution

            // Calculate personal tax amount (15% of cashout amount)
            $personalTaxAmount = $cashoutWithdrawalAmount * ($personalTaxPercentage / 100);

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

            $today = now();

            // 3. Create Transaction record for Earning Amount Credited
            Transaction::create([
                'transaction_nature' => 'Earning Amount Credited',
                'transaction_type' => 'Earning Amount',
                'debit_credit' => 2, // Credit
                'matching_date' => $today->toDateString(),
                'transaction_from_id' => $user->id,
                'transaction_to_id' => $user->id,
                'trigger_id' => $user->id,
                'order_id' => null,
                'created_user_id' => $user->id,
                'amount' => $cashoutWithdrawalAmount,
                'transaction_date' => $today,
                'status' => 1,
                'tax_status' => 0, // Not tax amount
                'countStatus' => 0,
            ]);

            // 4. Create Transaction record for Tax Amount Debited
            Transaction::create([
                'transaction_nature' => 'Tax Amount Debited',
                'transaction_type' => 'Tax Debited',
                'debit_credit' => 1, // Debit
                'matching_date' => $today->toDateString(),
                'transaction_from_id' => $user->id,
                'transaction_to_id' => $user->id,
                'trigger_id' => $user->id,
                'order_id' => null,
                'created_user_id' => $user->id,
                'amount' => $personalTaxAmount,
                'transaction_date' => $today,
                'status' => 1,
                'tax_status' => 0, // Not tax amount
                'countStatus' => 0,
            ]);

            DB::commit();

            Log::info('Withdrawal processed successfully', [
                'user_id' => $user->id,
                'total_amount' => $amount,
                'cashout_amount' => $cashoutWithdrawalAmount,
                'redistribution_amount' => $redistributionWithdrawalAmount,
                'tax_amount' => $personalTaxAmount,
                'tax_percentage' => $personalTaxPercentage,
                'cashout_earning_id' => $cashoutEarning->id,
                'redistribution_earning_id' => $redistributionEarning->id
            ]);

            return back()->with('success', 'Withdrawal processed successfully! Cash out amount: ₹' . number_format($cashoutWithdrawalAmount, 2) . ', Redistribution amount: ₹' . number_format($redistributionWithdrawalAmount, 2) . ', Tax deducted: ₹' . number_format($personalTaxAmount, 2));

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