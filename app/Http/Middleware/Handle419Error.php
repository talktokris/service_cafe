<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class Handle419Error
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // If we get a 419 error, regenerate session and redirect back
        if ($response->getStatusCode() === 419) {
            // Regenerate session and CSRF token
            Session::regenerate();
            Session::regenerateToken();
            
            // For AJAX requests, return JSON with redirect info
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'error' => 'Session expired',
                    'message' => 'Your session has expired. Please try again.',
                    'redirect' => true,
                    'url' => $request->fullUrl(),
                    'csrf_token' => csrf_token()
                ], 419);
            }
            
            // For regular requests, redirect back with a flash message
            return redirect()->back()->with('error', 'Your session has expired. Please try again.');
        }

        return $response;
    }
}
