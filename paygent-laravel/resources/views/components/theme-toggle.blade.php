<button 
    type="button" 
    x-data="{ isDark: document.documentElement.classList.contains('dark') }"
    @click="
        isDark = !isDark; 
        if(isDark) { 
            document.documentElement.classList.add('dark'); 
            localStorage.setItem('paygent-theme', 'dark'); 
        } else { 
            document.documentElement.classList.remove('dark'); 
            localStorage.setItem('paygent-theme', 'light'); 
        }
    "
    class="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 hover-lift"
    aria-label="Toggle Dark Mode"
>
    <!-- Sun Icon (shows in dark mode) -->
    <svg x-show="isDark" style="display: none;" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    <!-- Moon Icon (shows in light mode) -->
    <svg x-show="!isDark" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
</button>
