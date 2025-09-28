<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SupportController extends Controller
{
    /**
     * Display the support page for members
     */
    public function index()
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access support.');
        }
        
        // Check if user is a member (free or paid)
        if ($user->user_type !== 'member') {
            return redirect()->route('login')->with('error', 'Access denied. This page is for members only.');
        }
        
        return Inertia::render('Members/Support', [
            'auth' => ['user' => $user],
            'memberType' => $user->member_type,
            'supportEmail' => env('SUPPORT_EMAIL', 'info@servicecafe.com'),
            'supportPhone' => env('SUPPORT_PHONE', '+977 9766389515'),
            'supportAddress' => env('SUPPORT_ADDRESS', 'Lalitpur 14 khumaltar, Kathmandu, Nepal')
        ]);
    }
}
