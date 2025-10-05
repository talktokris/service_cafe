<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckPaidMember
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access this page.');
        }

        // Check if user is a member
        if ($user->user_type !== 'member') {
            // Redirect to login for all non-member users (dashboard is now admin-only)
            return redirect()->route('login')->with('error', 'Access denied. This section is only available for members.');
        }

        // Check if user is a paid member
        if ($user->member_type !== 'paid') {
            // If user is a free member, redirect to free member dashboard
            if ($user->member_type === 'free') {
                return redirect()->route('member.f.dashboard')->with('error', 'Access denied. This section is only available for paid members.');
            } else {
                // If member_type is null or invalid, redirect to login
                return redirect()->route('login')->with('error', 'Invalid member type. Please contact administrator.');
            }
        }

        return $next($request);
    }
}