<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="192x192" href="/assets/android-chrome-192x192.png">
        <link rel="icon" type="image/png" sizes="512x512" href="/assets/android-chrome-512x512.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
