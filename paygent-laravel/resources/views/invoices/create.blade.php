<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-slate-800 dark:text-slate-100">Tambah Invoice</h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-2xl mx-auto px-4 sm:px-6">
            @include('invoices._form', ['invoice' => new \App\Models\Invoice(), 'action' => route('invoices.store'), 'method' => 'POST'])
        </div>
    </div>
</x-app-layout>
