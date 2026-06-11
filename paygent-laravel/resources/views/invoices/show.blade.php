<x-app-layout>
    <x-slot name="header">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="font-semibold text-xl text-slate-800 dark:text-slate-100">{{ $invoice->invoice_number }}</h2>
            <div class="flex gap-2">
                <a href="{{ route('invoices.edit', $invoice) }}" class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Edit</a>
                <form method="POST" action="{{ route('invoices.destroy', $invoice) }}" onsubmit="return confirm('Hapus invoice ini?')">
                    @csrf @method('DELETE')
                    <button class="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Hapus</button>
                </form>
            </div>
        </div>
    </x-slot>

    <div class="py-8">
        <div class="max-w-2xl mx-auto px-4 sm:px-6">
            @include('components.invoice-card', ['invoice' => $invoice])
        </div>
    </div>
</x-app-layout>
