<x-app-layout>
    <x-slot name="header">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="font-semibold text-xl text-slate-800 dark:text-slate-100">Invoice CRUD</h2>
            <a href="{{ route('invoices.create') }}" class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Tambah Invoice</a>
        </div>
    </x-slot>

    <div class="py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            @if (session('status'))
                <div class="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{{ session('status') }}</div>
            @endif

            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                @forelse ($invoices as $invoice)
                    <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ $invoice->invoice_number }}</p>
                                <h3 class="mt-1 font-semibold text-slate-900 dark:text-white">{{ $invoice->client_name }}</h3>
                                <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{{ $invoice->item_description }}</p>
                            </div>
                            <span class="rounded-full px-2 py-1 text-xs font-semibold {{ $invoice->status === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' }}">{{ $invoice->status }}</span>
                        </div>
                        <p class="mt-4 text-lg font-bold text-blue-600 dark:text-blue-400">{{ $invoice->formattedAmount() }}</p>
                        <div class="mt-4 flex flex-wrap gap-2">
                            <a href="{{ route('invoices.show', $invoice) }}" class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Detail</a>
                            <a href="{{ route('invoices.edit', $invoice) }}" class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Edit</a>
                        </div>
                    </div>
                @empty
                    <div class="sm:col-span-2 lg:col-span-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-slate-500">
                        Belum ada invoice. Buat lewat Chat AI atau tombol Tambah Invoice.
                    </div>
                @endforelse
            </div>

            <div class="mt-6">{{ $invoices->links() }}</div>
        </div>
    </div>
</x-app-layout>
