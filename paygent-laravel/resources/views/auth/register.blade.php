<x-guest-layout>
    <div class="text-center mb-8">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Create an account</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Join PayGent to automate your billing.</p>
    </div>

    <form method="POST" action="{{ route('register') }}" class="space-y-4">
        @csrf

        <!-- Name -->
        <div>
            <label for="name" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{{ __('Name') }}</label>
            <input id="name" class="block w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors" type="text" name="name" :value="old('name')" required autofocus autocomplete="name" placeholder="John Doe" />
            <x-input-error :messages="$errors->get('name')" class="mt-2" />
        </div>

        <!-- Email Address -->
        <div>
            <label for="email" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{{ __('Email') }}</label>
            <input id="email" class="block w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors" type="email" name="email" :value="old('email')" required autocomplete="username" placeholder="name@company.com" />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <!-- Password -->
        <div>
            <label for="password" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{{ __('Password') }}</label>
            <input id="password" class="block w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                            type="password"
                            name="password"
                            required autocomplete="new-password" placeholder="••••••••" />
            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <!-- Confirm Password -->
        <div>
            <label for="password_confirmation" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{{ __('Confirm Password') }}</label>
            <input id="password_confirmation" class="block w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                            type="password"
                            name="password_confirmation" required autocomplete="new-password" placeholder="••••••••" />
            <x-input-error :messages="$errors->get('password_confirmation')" class="mt-2" />
        </div>

        <button type="submit" class="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 mt-4">
            {{ __('Sign up') }}
        </button>

        <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account? 
            <a href="{{ route('login') }}" class="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">Log in</a>
        </p>
    </form>
</x-guest-layout>
