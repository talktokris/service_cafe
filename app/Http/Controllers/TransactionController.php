<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

class TransactionController extends Controller
{
    /**
     * Display transactions for paid members
     */
    public function paidMemberTransactions(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access transactions.');
        }
        
        // Check if user is a paid member
        if ($user->user_type !== 'member' || $user->member_type !== 'paid') {
            return redirect()->route('login')->with('error', 'Access denied. This page is for paid members only.');
        }
        
        // Get search filters
        $transactionId = $request->get('transaction_id');
        $fromDate = $request->get('from_date');
        $toDate = $request->get('to_date');
        
        // Build query for transactions where user is the recipient
        $query = \App\Models\Transaction::with('order')
            ->where('transaction_to_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(100);
        
        // Apply filters
        if ($transactionId) {
            $query->where('id', 'like', '%' . $transactionId . '%');
        }
        
        if ($fromDate) {
            $query->whereDate('created_at', '>=', $fromDate);
        }
        
        if ($toDate) {
            $query->whereDate('created_at', '<=', $toDate);
        }
        
        $transactions = $query->get();
        
        // Calculate running balance and summary
        $totalDebits = 0;
        $totalCredits = 0;
        $runningBalance = 0;
        
        $transactionsWithBalance = $transactions->map(function ($transaction) use (&$runningBalance, &$totalDebits, &$totalCredits) {
            if ($transaction->debit_credit == 1) {
                // Debit
                $runningBalance -= $transaction->amount;
                $totalDebits += $transaction->amount;
            } else if ($transaction->debit_credit == 2) {
                // Credit
                $runningBalance += $transaction->amount;
                $totalCredits += $transaction->amount;
            }
            
            $transaction->balance = $runningBalance;
            return $transaction;
        });
        
        $summary = [
            'total_debits' => $totalDebits,
            'total_credits' => $totalCredits,
            'balance' => $runningBalance,
        ];
        
        return Inertia::render('Members/PaidMember/Transactions', [
            'auth' => ['user' => $user],
            'transactions' => $transactionsWithBalance,
            'summary' => $summary,
            'walletBalance' => $user->getCurrentWalletBalance(),
            'filters' => [
                'transaction_id' => $transactionId,
                'from_date' => $fromDate,
                'to_date' => $toDate,
            ]
        ]);
    }

    /**
     * Display transactions for free members
     */
public function freeMemberTransactions(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access transactions.');
        }
        
        // Check if user is a free member
        if ($user->user_type !== 'member' || $user->member_type !== 'free') {
            return redirect()->route('login')->with('error', 'Access denied. This page is for free members only.');
        }
        
        // Get search filters
        $transactionId = $request->get('transaction_id');
        $fromDate = $request->get('from_date');
        $toDate = $request->get('to_date');
        
        // Build query for transactions where user is the recipient
        $query = \App\Models\Transaction::with('order')
            ->where('transaction_to_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(100);
        
        // Apply filters
        if ($transactionId) {
            $query->where('id', 'like', '%' . $transactionId . '%');
        }
        
        if ($fromDate) {
            $query->whereDate('created_at', '>=', $fromDate);
        }
        
        if ($toDate) {
            $query->whereDate('created_at', '<=', $toDate);
        }
        
        $transactions = $query->get();
        
        // Calculate running balance and summary
        $totalDebits = 0;
        $totalCredits = 0;
        $runningBalance = 0;
        
        $transactionsWithBalance = $transactions->map(function ($transaction) use (&$runningBalance, &$totalDebits, &$totalCredits) {
            if ($transaction->debit_credit == 1) {
                // Debit
                $runningBalance -= $transaction->amount;
                $totalDebits += $transaction->amount;
            } else if ($transaction->debit_credit == 2) {
                // Credit
                $runningBalance += $transaction->amount;
                $totalCredits += $transaction->amount;
            }
            
            $transaction->balance = $runningBalance;
            return $transaction;
        });
        
        $summary = [
            'total_debits' => $totalDebits,
            'total_credits' => $totalCredits,
            'balance' => $runningBalance,
        ];
        
        return Inertia::render('Members/FreeMember/Transactions', [
            'auth' => ['user' => $user],
            'transactions' => $transactionsWithBalance,
            'summary' => $summary,
            'walletBalance' => $user->getCurrentWalletBalance(),
            'filters' => [
                'transaction_id' => $transactionId,
                'from_date' => $fromDate,
                'to_date' => $toDate,
            ]
        ]);
    }

    /**
     * Display transactions for a specific member (Super Admin only)
     */
    public function memberTransactions(Request $request, $encodedUserId)
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access member transactions.');
        }
        
        // Check if user is a super admin
        if ($user->user_type !== 'headoffice') {
            return redirect()->route('login')->with('error', 'Access denied. This page is for super admins only.');
        }
        
        // Decode the user ID
        $userId = base64_decode($encodedUserId);
        if (!$userId || !is_numeric($userId)) {
            return redirect()->route('manage-members')->with('error', 'Invalid member ID.');
        }
        
        // Get the member
        $member = User::find($userId);
        if (!$member) {
            return redirect()->route('manage-members')->with('error', 'Member not found.');
        }
        
        // Get search filters
        $transactionId = $request->get('transaction_id');
        $fromDate = $request->get('from_date');
        $toDate = $request->get('to_date');
        
        // Build query for transactions where user is the recipient
        $query = \App\Models\Transaction::with('order')
            ->where('transaction_to_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(100);
        
        // Apply filters
        if ($transactionId) {
            $query->where('id', 'like', '%' . $transactionId . '%');
        }
        
        if ($fromDate) {
            $query->whereDate('created_at', '>=', $fromDate);
        }
        
        if ($toDate) {
            $query->whereDate('created_at', '<=', $toDate);
        }
        
        $transactions = $query->get();
        
        // Calculate running balance and summary
        $totalDebits = 0;
        $totalCredits = 0;
        $runningBalance = 0;
        
        $transactionsWithBalance = $transactions->map(function ($transaction) use (&$runningBalance, &$totalDebits, &$totalCredits) {
            if ($transaction->debit_credit == 1) {
                // Debit
                $runningBalance -= $transaction->amount;
                $totalDebits += $transaction->amount;
            } else if ($transaction->debit_credit == 2) {
                // Credit
                $runningBalance += $transaction->amount;
                $totalCredits += $transaction->amount;
            }
            
            $transaction->balance = $runningBalance;
            return $transaction;
        });
        
        $summary = [
            'total_debits' => $totalDebits,
            'total_credits' => $totalCredits,
            'balance' => $runningBalance,
        ];
        
        return Inertia::render('HeadOffice/Super/MemberTransactions', [
            'auth' => ['user' => $user],
            'transactions' => $transactionsWithBalance,
            'summary' => $summary,
            'member' => $member,
            'encodedUserId' => $encodedUserId,
            'filters' => [
                'transaction_id' => $transactionId,
                'from_date' => $fromDate,
                'to_date' => $toDate,
            ]
        ]);
    }

    /**
     * Process fund topup for a member (Super Admin only)
     */
    public function fundTopup(Request $request, $encodedUserId)
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to perform fund topup.');
        }
        
        // Check if user is a super admin
        if ($user->user_type !== 'headoffice') {
            return redirect()->route('login')->with('error', 'Access denied. This action is for super admins only.');
        }
        
        // Decode the user ID
        $userId = base64_decode($encodedUserId);
        if (!$userId || !is_numeric($userId)) {
            return back()->withErrors(['error' => 'Invalid member ID.']);
        }
        
        // Get the member
        $member = User::find($userId);
        if (!$member) {
            return back()->withErrors(['error' => 'Member not found.']);
        }
        
        // Validate the request
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01|max:999999.99',
        ]);
        
        try {
            // Create the transaction
            $transaction = \App\Models\Transaction::create([
                'transaction_nature' => 'Fund Topup',
                'transaction_type' => 'Admin Fund Topup',
                'debit_credit' => 2, // Credit
                'matching_date' => now()->toDateString(),
                'transaction_from_id' => $user->id,
                'transaction_to_id' => $userId,
                'trigger_id' => $user->id,
                'created_user_id' => $user->id,
                'amount' => $validated['amount'],
                'transaction_date' => now(),
                'status' => 1,
                'countStatus' => 0,
            ]);
            
            \Illuminate\Support\Facades\Log::info('Fund topup successful', [
                'transaction_id' => $transaction->id,
                'admin_user_id' => $user->id,
                'member_user_id' => $userId,
                'amount' => $validated['amount']
            ]);
            
            return back()->with('success', 'Fund topup successful!');
            
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Fund topup failed', [
                'error' => $e->getMessage(),
                'admin_user_id' => $user->id,
                'member_user_id' => $userId,
                'amount' => $validated['amount']
            ]);
            
            return back()->withErrors(['error' => 'Fund topup failed. Please try again.']);
        }
    }
}
