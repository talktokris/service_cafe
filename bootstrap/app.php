<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \App\Http\Middleware\PreventPageCache::class,
            // Temporarily disabled to fix session issues
            // \App\Http\Middleware\RefreshCsrfToken::class,
            // \App\Http\Middleware\Handle419Error::class,
        ]);

        // Exempt login, logout, and password-reset from CSRF so expired/stale sessions don't block sign-in or sign-out.
        $middleware->validateCsrfTokens(except: [
            'test-login',
            'login',
            'logout',
            'forgot-password',
            'reset-password',
        ]);

        // Register custom middleware
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
            'user.type' => \App\Http\Middleware\CheckUserType::class,
            'paid.member' => \App\Http\Middleware\CheckPaidMember::class,
            'free.member' => \App\Http\Middleware\CheckFreeMember::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
