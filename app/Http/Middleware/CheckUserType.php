<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserType
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$userTypes): Response
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access this page.');
        }

        // Check if user's type is in the allowed types
        if (!in_array($user->user_type, $userTypes)) {
            // Redirect to appropriate dashboard based on user type
            if ($user->user_type === 'member') {
                if ($user->member_type === 'free') {
                    return redirect()->route('member.f.dashboard')->with('error', 'Access denied. This section is not available for your user type.');
                } elseif ($user->member_type === 'paid') {
                    return redirect()->route('member.p.dashboard')->with('error', 'Access denied. This section is not available for your user type.');
                }
            }
            
            // For other user types, redirect to login
            return redirect()->route('login')->with('error', 'Access denied. This section is not available for your user type.');
        }

        return $next($request);
    }
}
