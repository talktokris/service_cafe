<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        // Simple approach - just render the login page
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'error' => session('error'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // Log the login attempt for debugging
        \Log::info('Login attempt', [
            'email' => $request->email,
            'session_id_before' => session()->getId(),
            'csrf_token' => $request->input('_token'),
            'user_agent' => $request->userAgent()
        ]);

        $request->authenticate();

        $request->session()->regenerate();

        // Log successful authentication
        \Log::info('Login successful', [
            'user_id' => Auth::id(),
            'session_id_after' => session()->getId()
        ]);

        // Get the authenticated user
        $user = Auth::user();

        // Always redirect to appropriate dashboard based on user type (no intended() to prevent loops)
        if ($user->user_type === 'member') {
            if ($user->member_type === 'free') {
                return redirect()->route('member.f.dashboard');
            } elseif ($user->member_type === 'paid') {
                return redirect()->route('member.p.dashboard');
            }
        }

        // For admin users, redirect to admin dashboard
        if ($user->user_type === 'headoffice') {
            $primaryRole = $user->primary_role;
            if ($primaryRole) {
                switch ($primaryRole->name) {
                    case 'super_user':
                    case 'admin_user':
                    case 'account_user':
                    case 'billing_user':
                    default:
                        return redirect()->route('dashboard');
                }
            }
        }

        // For branch office users, redirect to dashboard
        if ($user->user_type === 'branchoffice') {
            return redirect()->route('dashboard');
        }

        // Fallback to login for unknown user types
        return redirect()->route('login')->with('error', 'Invalid user type. Please contact administrator.');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
