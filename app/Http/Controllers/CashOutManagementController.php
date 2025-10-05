<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\CashWalletTransaction;
use App\Models\User;
use Carbon\Carbon;

class CashOutManagementController extends Controller
{
    /**
     * Display cash out management page
     */
    public function index(Request $request)
    {
        // Get search parameters
        $transactionId = $request->get('transaction_id');
        $userId = $request->get('user_id');
        $fromDate = $request->get('from_date');
        $toDate = $request->get('to_date');
        $status = $request->get('status', 'all'); // all, pending, paid

        // Build query for cash out transactions (transaction_type = 3)
        $query = CashWalletTransaction::with(['user', 'cashOutUser'])
            ->where('transaction_type', 3)
            ->orderBy('transaction_date', 'desc')
            ->limit(1000);

        // Apply status filter
        if ($status === 'pending') {
            $query->where('cash_out_status', 0);
        } elseif ($status === 'paid') {
            $query->where('cash_out_status', 1);
        }
        // 'all' shows both pending and paid (no additional filter needed)

        // Apply search filters
        if ($transactionId) {
            $query->where('id', $transactionId);
        }

        if ($userId) {
            $query->where('user_id', $userId);
        }

        if ($fromDate) {
            $query->whereDate('transaction_date', '>=', $fromDate);
        }

        if ($toDate) {
            $query->whereDate('transaction_date', '<=', $toDate);
        }

        $transactions = $query->get();

        // Calculate summary statistics
        $summary = [
            'total' => CashWalletTransaction::where('transaction_type', 3)->count(),
            'pending' => CashWalletTransaction::where('transaction_type', 3)->where('cash_out_status', 0)->count(),
            'paid' => CashWalletTransaction::where('transaction_type', 3)->where('cash_out_status', 1)->count(),
            'total_amount' => CashWalletTransaction::where('transaction_type', 3)->sum('amount'),
            'pending_amount' => CashWalletTransaction::where('transaction_type', 3)->where('cash_out_status', 0)->sum('amount'),
            'paid_amount' => CashWalletTransaction::where('transaction_type', 3)->where('cash_out_status', 1)->sum('amount'),
        ];

        return inertia('HeadOffice/CashOutManagement', [
            'transactions' => $transactions,
            'summary' => $summary,
            'filters' => [
                'transaction_id' => $transactionId,
                'user_id' => $userId,
                'from_date' => $fromDate,
                'to_date' => $toDate,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Process payout for a cash out transaction
     */
    public function processPayout(Request $request)
    {
        $request->validate([
            'transaction_id' => 'required|exists:cash_wallets_transactions,id',
            'cash_out_reference_no' => 'required|string|max:255',
            'cash_out_description' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        $transactionId = $request->transaction_id;

        try {
            DB::beginTransaction();

            // Update the transaction
            $transaction = CashWalletTransaction::where('id', $transactionId)
                ->where('transaction_type', 3)
                ->where('cash_out_status', 0) // Only process pending transactions
                ->first();

            if (!$transaction) {
                return back()->withErrors([
                    'message' => 'Transaction not found or already processed.'
                ]);
            }

            $transaction->update([
                'cash_out_status' => 1, // Mark as paid
                'cash_out_reference_no' => $request->cash_out_reference_no,
                'cash_out_description' => $request->cash_out_description,
                'cash_out_user_id' => $user->id,
                'cash_out_date' => now(),
            ]);

            DB::commit();

            Log::info('Cash out payout processed successfully', [
                'transaction_id' => $transactionId,
                'processed_by' => $user->id,
                'reference_no' => $request->cash_out_reference_no,
                'amount' => $transaction->amount,
            ]);

            return back()->with('success', 'Payment processed successfully! Reference: ' . $request->cash_out_reference_no);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Cash out payout processing failed', [
                'transaction_id' => $transactionId,
                'processed_by' => $user->id,
                'error' => $e->getMessage()
            ]);

            return back()->withErrors([
                'message' => 'Failed to process payment. Please try again.'
            ]);
        }
    }

    /**
     * Get transaction details for modal
     */
    public function getTransactionDetails($id)
    {
        $transaction = CashWalletTransaction::with(['user', 'cashOutUser'])
            ->where('id', $id)
            ->where('transaction_type', 3)
            ->first();

        if (!$transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        return response()->json($transaction);
    }
}