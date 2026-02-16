<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        // 419 is rendered after Laravel converts TokenMismatchException to HttpException(419),
        // so we must handle HttpException(419) here for our custom logic to run.
        $this->renderable(function (HttpException $e, Request $request) {
            if ($e->getStatusCode() !== 419) {
                return null;
            }

            // For login (and register/forgot-password): give a fresh session and redirect so user can try again
            if ($request->is('login') || $request->routeIs('login') ||
                $request->is('register') || $request->routeIs('register') ||
                $request->is('forgot-password') || $request->is('password/email')) {
                Session::regenerate();
                Session::regenerateToken();
                return redirect()->route('login')->with('error', 'Your session has expired. Please try again.');
            }

            // For AJAX/Inertia requests, return JSON so client can handle (e.g. retry or show message)
            if ($request->ajax() || $request->wantsJson() || $request->header('X-Inertia')) {
                return response()->json([
                    'error' => 'CSRF token mismatch',
                    'message' => 'Your session has expired. Please refresh the page.',
                    'code' => 419,
                ], 419);
            }

            // For regular requests, redirect back with message
            return redirect()->back()->with('error', 'Your session has expired. Please try again.');
        });

        // Keep TokenMismatchException handler for any path that might run before conversion (e.g. custom flows)
        $this->renderable(function (TokenMismatchException $e, Request $request) {
            if ($request->is('login') || $request->routeIs('login') ||
                $request->is('register') || $request->routeIs('register') ||
                $request->is('forgot-password') || $request->is('password/email')) {
                Session::regenerate();
                Session::regenerateToken();
                return redirect()->route('login')->with('error', 'Your session has expired. Please try again.');
            }
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'error' => 'CSRF token mismatch',
                    'message' => 'Your session has expired. Please refresh the page.',
                    'code' => 419,
                ], 419);
            }
            return redirect()->back()->with('error', 'Your session has expired. Please try again.');
        });
    }
}
