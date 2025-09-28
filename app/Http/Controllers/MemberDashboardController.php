<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

class MemberDashboardController extends Controller
{
    /**
     * Display the free member dashboard
     */
    public function freeMemberDashboard()
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access the dashboard.');
        }
        
        // Check if user is a free member
        if ($user->user_type !== 'member' || $user->member_type !== 'free') {
            return redirect()->route('login')->with('error', 'Access denied. This dashboard is for free members only.');
        }
        
        return Inertia::render('Members/FreeMember/FreeMemberDashboard', [
            'auth' => ['user' => $user],
            'stats' => [],
            'referrals' => $user->referrals,
            'walletBalance' => $user->getCurrentWalletBalance()
        ]);
    }

    /**
     * Display the paid member dashboard
     */
    public function paidMemberDashboard()
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access the dashboard.');
        }
        
        // Check if user is a paid member
        if ($user->user_type !== 'member' || $user->member_type !== 'paid') {
            return redirect()->route('login')->with('error', 'Access denied. This dashboard is for paid members only.');
        }
        
        return Inertia::render('Members/PaidMember/PaidMemberDashboard', [
            'auth' => ['user' => $user],
            'stats' => [],
            'wallet' => $user->wallet,
            'walletBalance' => $user->getCurrentWalletBalance(),
            'referrals' => $user->referrals
        ]);
    }
}
