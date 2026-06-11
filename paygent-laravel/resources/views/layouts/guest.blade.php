<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
    <head>
        <script>
            (function () {
                const theme = localStorage.getItem('paygent-theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                }
            })();
        </script>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'PayGent') }} - Authentication</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700|figtree:400,500,600,700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.webmanifest">
        <meta name="theme-color" content="#2563eb">

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="font-sans antialiased bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 min-h-screen relative flex flex-col justify-center items-center py-12 px-4 sm:px-6">
        
        <!-- Decorative Background -->
        <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div class="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[100px] animate-float"></div>
            <div class="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-violet-500/20 dark:bg-violet-600/10 rounded-full blur-[100px] animate-float-slow"></div>
        </div>

        <!-- Top Right Theme Toggle -->
        <div class="absolute top-6 right-6 z-50">
            <x-theme-toggle />
        </div>

        <!-- Logo -->
        <a href="/" class="relative z-10 mb-8 flex flex-col items-center gap-3 group">
            <div class="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg shadow-blue-500/25">
                <span class="text-white text-lg font-bold">PG</span>
            </div>
            <span class="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">PayGent</span>
        </a>

        <!-- Card -->
        <div class="relative z-10 w-full max-w-md bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 shadow-2xl rounded-3xl p-8 overflow-hidden">
            {{ $slot }}
        </div>

    </body>
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch((err) => {
                    console.error('ServiceWorker registration failed: ', err);
                });
            });
        }
    </script>
</html>
