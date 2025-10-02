<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PrivacyPolicyController extends Controller
{
    /**
     * Display the privacy policy page
     */
    public function index()
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access this page.');
        }
        
        // Check if user is a member (free or paid)
        if ($user->user_type !== 'member') {
            return redirect()->route('login')->with('error', 'Access denied. This page is for members only.');
        }
        
        return Inertia::render('Members/PrivacyPolicy', [
            'auth' => ['user' => $user],
            'memberType' => $user->member_type
        ]);
    }
}
