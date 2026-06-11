<x-guest-layout>
    <div class="text-center mb-8">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Please enter your details to sign in.</p>
    </div>

    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <form method="POST" action="{{ route('login') }}" class="space-y-5">
        @csrf

        <!-- Email Address -->
        <div>
            <label for="email" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{{ __('Email') }}</label>
            <input id="email" class="block w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors" type="email" name="email" :value="old('email')" required autofocus autocomplete="username" placeholder="name@company.com" />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <!-- Password -->
        <div>
            <label for="password" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{{ __('Password') }}</label>
            <input id="password" class="block w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                            type="password"
                            name="password"
                            required autocomplete="current-password" placeholder="••••••••" />
            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
            <label for="remember_me" class="inline-flex items-center group cursor-pointer">
                <input id="remember_me" type="checkbox" class="rounded border-slate-300 dark:border-slate-700 text-blue-600 shadow-sm focus:ring-blue-500 dark:bg-[#0F172A] transition-colors" name="remember">
                <span class="ms-2 text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{{ __('Remember me') }}</span>
            </label>

            @if (Route::has('password.request'))
                <a class="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors" href="{{ route('password.request') }}">
                    {{ __('Forgot password?') }}
                </a>
            @endif
        </div>

        <button type="submit" class="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 mt-2">
            {{ __('Log in') }}
        </button>

        <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Don't have an account? 
            <a href="{{ route('register') }}" class="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">Sign up</a>
        </p>
    </form>
</x-guest-layout>
