<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $stats = [
            'total' => Invoice::query()->where('user_id', $userId)->count(),
            'paid' => Invoice::query()->where('user_id', $userId)->where('status', 'PAID')->count(),
            'pending' => Invoice::query()->where('user_id', $userId)->where('status', 'PENDING')->count(),
            'revenue' => Invoice::query()->where('user_id', $userId)->where('status', 'PAID')->sum('amount'),
            'outstanding' => Invoice::query()->where('user_id', $userId)->where('status', 'PENDING')->sum('amount'),
        ];

        $recentInvoices = Invoice::query()
            ->where('user_id', $userId)
            ->latest()
            ->limit(8)
            ->get();

        return view('dashboard', compact('stats', 'recentInvoices'));
    }
}
