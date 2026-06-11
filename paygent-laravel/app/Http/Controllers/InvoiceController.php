<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $invoices = Invoice::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(12);

        return view('invoices.index', compact('invoices'));
    }

    public function create()
    {
        return view('invoices.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => ['required', 'string', 'max:255'],
            'item_description' => ['required', 'string', 'max:500'],
            'amount' => ['required', 'integer', 'min:1000'],
            'status' => ['nullable', 'in:PENDING,PAID,FAILED,EXPIRED'],
            'payment_url' => ['nullable', 'url'],
        ]);

        $invoiceNumber = 'INV-'.strtoupper(substr(uniqid(), -8));

        Invoice::query()->create([
            ...$validated,
            'user_id' => $request->user()->id,
            'invoice_number' => $invoiceNumber,
            'status' => $validated['status'] ?? 'PENDING',
        ]);

        return redirect()->route('invoices.index')->with('status', 'Invoice berhasil dibuat.');
    }

    public function show(Request $request, Invoice $invoice)
    {
        $this->authorizeInvoice($request, $invoice);

        return view('invoices.show', compact('invoice'));
    }

    public function edit(Request $request, Invoice $invoice)
    {
        $this->authorizeInvoice($request, $invoice);

        return view('invoices.edit', compact('invoice'));
    }

    public function update(Request $request, Invoice $invoice)
    {
        $this->authorizeInvoice($request, $invoice);

        $validated = $request->validate([
            'client_name' => ['required', 'string', 'max:255'],
            'item_description' => ['required', 'string', 'max:500'],
            'amount' => ['required', 'integer', 'min:1000'],
            'status' => ['required', 'in:PENDING,PAID,FAILED,EXPIRED'],
            'payment_url' => ['nullable', 'url'],
        ]);

        $invoice->update($validated);

        return redirect()->route('invoices.show', $invoice)->with('status', 'Invoice diperbarui.');
    }

    public function destroy(Request $request, Invoice $invoice)
    {
        $this->authorizeInvoice($request, $invoice);

        $invoice->delete();

        return redirect()->route('invoices.index')->with('status', 'Invoice dihapus.');
    }

    protected function authorizeInvoice(Request $request, Invoice $invoice): void
    {
        abort_unless($invoice->user_id === $request->user()->id, 403);
    }
}
