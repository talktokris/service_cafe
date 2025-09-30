<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use App\Models\MemberUplineRank;

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

    /**
     * Display member badges page
     */
    public function memberBadges()
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access badges.');
        }
        
        // Check if user is a paid member
        if ($user->user_type !== 'member' || $user->member_type !== 'paid') {
            return redirect()->route('member-p-dashboard')->with('error', 'Access denied. Badges are for paid members only.');
        }
        
        // Get member upline rank data
        $memberRank = MemberUplineRank::with([
            'referralUser:id,first_name,last_name,name',
            'threeStarUser:id,first_name,last_name,name',
            'fiveStarUser:id,first_name,last_name,name',
            'sevenStarUser:id,first_name,last_name,name',
            'megaStarUser:id,first_name,last_name,name',
            'gigaStarUser:id,first_name,last_name,name'
        ])->where('user_id', $user->id)->first();
        
        // Get user's own badges
        $userBadges = [
            'annapurna' => ($user->member_type === 'paid' && $user->activeStatus == 1),
            'manaslu' => \App\Models\BadgeThreeStars::where('user_id', $user->id)->exists(),
            'dhaulagiri' => \App\Models\BadgeFiveStars::where('user_id', $user->id)->exists(),
            'cho_oyu' => \App\Models\BadgeSevenStars::where('user_id', $user->id)->exists(),
            'makalu' => \App\Models\BadgeMegaStars::where('user_id', $user->id)->exists(),
            'kanchenjunga' => \App\Models\BadgeGigaStars::where('user_id', $user->id)->exists(),
        ];
        
        return Inertia::render('Members/PaidMember/MemberBadges', [
            'auth' => ['user' => $user],
            'memberType' => $user->member_type,
            'memberRank' => $memberRank,
            'userBadges' => $userBadges
        ]);
    }
}
