<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShareReferralController extends Controller
{
    /**
     * Display the share referral page for members
     */
    public function index()
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access share referral.');
        }
        
        // Check if user is a member (free or paid)
        if ($user->user_type !== 'member') {
            return redirect()->route('login')->with('error', 'Access denied. This page is for members only.');
        }
        
        // Route to appropriate component based on member type
        if ($user->member_type === 'free') {
            return Inertia::render('Members/FreeMember/ShareReferral', [
                'auth' => ['user' => $user],
                'memberType' => $user->member_type
            ]);
        } else {
            return Inertia::render('Members/PaidMember/ShareReferral', [
                'auth' => ['user' => $user],
                'memberType' => $user->member_type
            ]);
        }
    }
}
