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
        $this->renderable(function (TokenMismatchException $e, Request $request) {
            // Handle CSRF token mismatch (419 error)
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'error' => 'CSRF token mismatch',
                    'message' => 'Your session has expired. Please refresh the page.',
                    'code' => 419,
                    'refresh_required' => true
                ], 419);
            }

            // For regular requests, show a user-friendly error page
            return response()->view('errors.419', [], 419);
        });

        $this->renderable(function (HttpException $e, Request $request) {
            if ($e->getStatusCode() === 419) {
                if ($request->ajax() || $request->wantsJson()) {
                    return response()->json([
                        'error' => 'Page expired',
                        'message' => 'Your session has expired. Please refresh the page.',
                        'code' => 419,
                        'refresh_required' => true
                    ], 419);
                }

                return response()->view('errors.419', [], 419);
            }
        });
    }
}
