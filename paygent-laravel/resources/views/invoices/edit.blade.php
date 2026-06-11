<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-slate-800 dark:text-slate-100">Edit Invoice</h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-2xl mx-auto px-4 sm:px-6">
            @include('invoices._form', ['invoice' => $invoice, 'action' => route('invoices.update', $invoice), 'method' => 'PUT'])
        </div>
    </div>
</x-app-layout>
