<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        /** @var User|null $user */
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access this page.');
        }

        // Get user's primary role
        $userRole = $user->primary_role;
        
        if (!$userRole) {
            return redirect()->route('dashboard')->with('error', 'No role assigned. Please contact administrator.');
        }

        // Check if user's role is in the allowed roles
        if (!in_array($userRole->name, $roles)) {
            // Redirect based on user type to avoid loops
            if ($user->user_type === 'member') {
                if ($user->member_type === 'paid') {
                    return redirect()->route('member.p.dashboard')->with('error', 'Access denied. Insufficient permissions.');
                } else {
                    return redirect()->route('member.f.dashboard')->with('error', 'Access denied. Insufficient permissions.');
                }
            }
            return redirect()->route('login')->with('error', 'Access denied. Insufficient permissions.');
        }

        return $next($request);
    }
}
