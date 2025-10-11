<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Http\Request;
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
        // Simple CSRF error handling - just redirect instead of showing error page
        $this->renderable(function (TokenMismatchException $e, Request $request) {
            // For AJAX requests, return JSON
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'error' => 'CSRF token mismatch',
                    'message' => 'Your session has expired. Please refresh the page.',
                    'code' => 419
                ], 419);
            }

            // For regular requests, just redirect back with a simple message
            return redirect()->back()->with('error', 'Your session has expired. Please try again.');
        });

        // Disabled custom 419 error handling to prevent duplicate pages
        // $this->renderable(function (HttpException $e, Request $request) {
        //     if ($e->getStatusCode() === 419) {
        //         if ($request->ajax() || $request->wantsJson()) {
        //             return response()->json([
        //                 'error' => 'Page expired',
        //                 'message' => 'Your session has expired. Please refresh the page.',
        //                 'code' => 419,
        //                 'refresh_required' => true
        //             ], 419);
        //         }

        //         return response()->view('errors.419', [], 419);
        //     }
        // });
    }
}
