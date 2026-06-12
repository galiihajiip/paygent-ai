<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>PayGent - AI Auto-Biller</title>
    
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800|figtree:400,500,600,700&display=swap" rel="stylesheet" />
    <link rel="manifest" href="/manifest.webmanifest">
    <meta name="theme-color" content="#2563eb">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/icons/paygent.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
    
    <script>
        (function () {
            const theme = localStorage.getItem('paygent-theme');
            if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            }
        })();
    </script>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="font-sans antialiased text-slate-900 dark:text-slate-100 bg-white dark:bg-[#0B1120]">
    
    <!-- Navbar -->
    <header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0F172A]/80 transition-colors duration-300">
        <div class="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
            <a href="/" class="flex items-center gap-2.5 group">
                <x-application-logo class="h-9 w-9 rounded-xl shadow-sm shadow-blue-500/20 transition-transform group-hover:scale-105" />
                <span class="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white hidden sm:block">PayGent</span>
            </a>
            
            <nav class="flex items-center gap-2 sm:gap-4">
                <a href="#how-it-works" class="hidden sm:inline-block text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Cara Kerja</a>
                
                <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1"></div>

                <x-theme-toggle />

                @auth
                    <a href="{{ route('dashboard') }}" class="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                        Dashboard
                    </a>
                @else
                    <a href="{{ route('login') }}" class="text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-2 transition-colors">
                        Log in
                    </a>
                    <a href="{{ route('register') }}" class="inline-flex items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 text-sm font-semibold transition-transform hover:scale-105 hover:shadow-md">
                        Get Started
                    </a>
                @endauth
            </nav>
        </div>
    </header>

    <div class="relative overflow-hidden bg-white dark:bg-[#0B1120]">
        <!-- Decorative Background Elements -->
        <div class="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
            <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px] animate-float"></div>
            <div class="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-[100px] animate-float-slow"></div>
        </div>

        <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-32 sm:pb-24 text-center">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 mb-8 animate-fade-in-up">
                <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span class="text-xs font-semibold text-blue-700 dark:text-blue-400 tracking-wide">
                    Powered by Laravel 13 & LLaMA-3.3
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0F172A] dark:text-white tracking-tight mb-6 animate-fade-in-up" style="animation-delay: 0.1s;">
                Cukup satu kalimat,<br />
                <span class="gradient-text">tagihan klien langsung beres.</span>
            </h1>

            <p class="mt-4 text-base sm:text-lg text-[#64748B] dark:text-[#94A3B8] max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style="animation-delay: 0.2s;">
                Bebaskan dirimu dari form manual yang merepotkan. PayGent menyulap pesan teks atau suaramu menjadi payment link Doku profesional dalam hitungan detik. Cepat, elegan, dan siap bayar.
            </p>

            <div class="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up" style="animation-delay: 0.3s;">
                <a href="{{ auth()->check() ? route('chat.index') : route('login') }}" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
                    Coba Sekarang
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
                <a href="#how-it-works" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 hover:bg-[#F8FAFC] dark:hover:bg-[#334155]">
                    Tonton Demo
                </a>
            </div>

            <!-- Stats Bar -->
            <div class="mt-16 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 border-y border-[#E2E8F0] dark:border-[#1E293B] py-8 animate-fade-in-up" style="animation-delay: 0.4s;">
                <div class="text-center">
                    <p class="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white mb-1">Eksekusi &lt; 3 Detik</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white mb-1">Doku</p>
                    <p class="text-xs sm:text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">Payment Gateway</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white mb-1">PWA</p>
                    <p class="text-xs sm:text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">Offline Support</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white mb-1">100%</p>
                    <p class="text-xs sm:text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">Open Source</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Features -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div class="text-center mb-12">
            <p class="text-xs sm:text-sm font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">
                Fitur Andalan
            </p>
            <h2 class="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                Solusi lengkap untuk penagihan tanpa drama
            </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 stagger-children">
            <!-- Feature 1 -->
            <div class="group relative bg-gradient-to-br from-blue-50/50 to-white dark:from-[#1E293B] dark:to-[#0F172A] bg-white dark:bg-[#1E293B]/60 border border-[#E2E8F0] dark:border-[#334155]/60 rounded-2xl p-6 hover-lift">
                <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 dark:text-blue-400"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h3 class="text-[#0F172A] dark:text-white font-bold text-base mb-2">Natural Language Billing</h3>
                <p class="text-[#64748B] dark:text-[#94A3B8] text-sm leading-relaxed">Cukup ngobrol santai dengan AI. PayGent otomatis mengenali nama klien, deskripsi project, dan total tagihan tanpa perlu input manual.</p>
            </div>
            <!-- Feature 2 -->
            <div class="group relative bg-gradient-to-br from-violet-50/50 to-white dark:from-[#1E293B] dark:to-[#0F172A] bg-white dark:bg-[#1E293B]/60 border border-[#E2E8F0] dark:border-[#334155]/60 rounded-2xl p-6 hover-lift">
                <div class="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-600 dark:text-violet-400"><path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4"/><path d="m9 11 1 9"/><path d="M4.5 15.5h15"/><path d="m15 11-1 9"/></svg>
                </div>
                <h3 class="text-[#0F172A] dark:text-white font-bold text-base mb-2">Seamless Doku Integration</h3>
                <p class="text-[#64748B] dark:text-[#94A3B8] text-sm leading-relaxed">Payment link Doku ter-generate seketika dan siap dibagikan. Klien bisa langsung bertransaksi menggunakan metode pembayaran favorit mereka.</p>
            </div>
            <!-- Feature 3 -->
            <div class="group relative bg-gradient-to-br from-emerald-50/50 to-white dark:from-[#1E293B] dark:to-[#0F172A] bg-white dark:bg-[#1E293B]/60 border border-[#E2E8F0] dark:border-[#334155]/60 rounded-2xl p-6 hover-lift">
                <div class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600 dark:text-emerald-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                </div>
                <h3 class="text-[#0F172A] dark:text-white font-bold text-base mb-2">Proactive Smart Reminders</h3>
                <p class="text-[#64748B] dark:text-[#94A3B8] text-sm leading-relaxed">Tidak perlu mengecek dashboard tiap hari. AI kami mendeteksi invoice yang menunggak dan memberikan rekomendasi follow-up yang tepat sasaran.</p>
            </div>
        </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="bg-white dark:bg-[#0F172A]/60 border-y border-[#E2E8F0] dark:border-[#1E293B]">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div class="text-center mb-12">
                <p class="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
                    Cara Kerja
                </p>
                <h2 class="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                    Tiga langkah instan menuju lunas
                </h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
                <!-- Step 1 -->
                <div class="relative text-center sm:text-left">
                    <div class="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                    </div>
                    <p class="text-xs font-bold tracking-widest mb-2 text-blue-600 dark:text-blue-400">STEP 01</p>
                    <h4 class="text-[#0F172A] dark:text-white font-bold text-lg mb-2">Ketik atau Bicara</h4>
                    <p class="text-[#64748B] dark:text-[#94A3B8] text-sm leading-relaxed">Sebutkan siapa kliennya, apa jasanya, dan berapa nominalnya langsung di kolom chat.</p>
                </div>
                <!-- Step 2 -->
                <div class="relative text-center sm:text-left">
                    <div class="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    </div>
                    <p class="text-xs font-bold tracking-widest mb-2 text-violet-600 dark:text-violet-400">STEP 02</p>
                    <h4 class="text-[#0F172A] dark:text-white font-bold text-lg mb-2">AI Bekerja di Belakang Layar</h4>
                    <p class="text-[#64748B] dark:text-[#94A3B8] text-sm leading-relaxed">PayGent mengekstrak instruksimu dan memanggil API Doku secara otonom, aman, dan akurat.</p>
                </div>
                <!-- Step 3 -->
                <div class="relative text-center sm:text-left">
                    <div class="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                    <p class="text-xs font-bold tracking-widest mb-2 text-emerald-600 dark:text-emerald-400">STEP 03</p>
                    <h4 class="text-[#0F172A] dark:text-white font-bold text-lg mb-2">Kirim & Terima Bayaran</h4>
                    <p class="text-[#64748B] dark:text-[#94A3B8] text-sm leading-relaxed">Payment link langsung terbit dan siap di-share. Invoice profesional juga tersedia untuk diunduh.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Bottom -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div class="relative rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 dark:from-blue-800 dark:via-blue-900 dark:to-violet-900 p-8 sm:p-12 overflow-hidden">
            <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div class="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>
                <div class="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-violet-400/20 blur-2xl"></div>
            </div>
            <div class="relative z-10">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">Siap ucapkan selamat tinggal pada tagihan macet?</h2>
                <p class="text-blue-100 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">Jadikan penagihan semudah mengirim chat. Tinggalkan cara lama, mulai percakapan pertamamu dengan PayGent hari ini.</p>
                <a href="{{ auth()->check() ? route('chat.index') : route('login') }}" class="group inline-flex items-center justify-center gap-2.5 bg-white hover:bg-blue-50 text-blue-700 text-sm font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:-translate-y-0.5">
                    Mulai Chat dengan PayGent Sekarang
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-200 group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
            </div>
        </div>
    </section>
    <!-- Footer -->
    <footer class="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1120] pt-16 pb-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div class="md:col-span-2">
                    <div class="flex items-center gap-2 mb-4">
                        <x-application-logo class="h-8 w-8 rounded-xl shadow-sm shadow-blue-500/20" />
                        <span class="font-bold text-xl text-slate-900 dark:text-white">PayGent</span>
                    </div>
                    <p class="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed mb-6">
                        AI CFO pribadi untuk freelancer. Sulap obrolan santai menjadi invoice dan payment link Doku secara instan.
                    </p>
                    <div class="flex gap-4">
                        <a href="#" class="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                        </a>
                        <a href="#" class="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                        </a>
                    </div>
                </div>
                
                <div>
                    <h4 class="font-bold text-slate-900 dark:text-white mb-4">Produk</h4>
                    <ul class="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                        <li><a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Billing Chat</a></li>
                        <li><a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">CFO Dashboard</a></li>
                        <li><a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Doku Integration</a></li>
                        <li><a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Voice to Invoice</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-bold text-slate-900 dark:text-white mb-4">Perusahaan</h4>
                    <ul class="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                        <li><a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tentang Kami</a></li>
                        <li><a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privasi & Keamanan</a></li>
                        <li><a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Syarat Ketentuan</a></li>
                        <li><a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Hubungi Kami</a></li>
                    </ul>
                </div>
            </div>

            <div class="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                <p>&copy; {{ date('Y') }} PayGent Inc. All rights reserved.</p>
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Systems Operational</span>
                    <span class="mx-2">&middot;</span>
                    <span>Built with Laravel 13, Tailwind 3 & LLaMA-3.3</span>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>
