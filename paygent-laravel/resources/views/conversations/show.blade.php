<x-app-layout>
    <x-slot name="header">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="font-semibold text-xl text-slate-800 dark:text-slate-100">{{ $conversation->title }}</h2>
            <a href="{{ route('chat.index', ['conversation' => $conversation->id]) }}" class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Lanjutkan di Chat</a>
        </div>
    </x-slot>

    <div class="py-8">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
            @foreach ($messages as $message)
                <div class="flex {{ $message->role === 'user' ? 'justify-end' : 'justify-start' }}">
                    <div class="max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap {{ $message->role === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800' }}">
                        {{ $message->content }}
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</x-app-layout>
