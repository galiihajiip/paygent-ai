@props(['active'])

@php
$classes = ($active ?? false)
            ? 'inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold bg-blue-600 text-white shadow-sm shadow-blue-500/20 transition-all duration-200'
            : 'inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-all duration-200';
@endphp

<a {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</a>
