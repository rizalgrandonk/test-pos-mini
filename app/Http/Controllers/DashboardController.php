<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\TransactionHeader;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Revenue
        $thisMonthRevenue = TransactionHeader::thisMonth()->sum('total');
        $thisMonthTransaction = TransactionHeader::thisMonth()->count();
        $lastMonthRevenue = TransactionHeader::lastMonth()->sum('total');
        $revenueGrowth = $lastMonthRevenue > 0
            ? (($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100
            : 0;

        // Customers
        $thisMonthCustomers = Customer::thisMonth()->count();
        $lastMonthCustomers = Customer::lastMonth()->count();
        $customerGrowth = $lastMonthCustomers > 0
            ? (($thisMonthCustomers - $lastMonthCustomers) / $lastMonthCustomers) * 100
            : 0;

        $topCustomers = TransactionHeader::query()
            ->whereBetween('invoice_date', [
                now()->subMonth()->startOfMonth(),
                now()->endOfMonth(),
            ])
            ->select(
                'customer_id',
                DB::raw('COUNT(*) as transactions_count'),
                DB::raw('SUM(total) as total_spent')
            )
            ->with('customer:id,name,code')
            ->groupBy('customer_id')
            ->orderByDesc('total_spent')
            ->limit(10)
            ->get()
            ->map(fn($row) => [
                'id' => $row->customer_id,
                'name' => $row->customer?->name,
                'code' => $row->customer?->code,
                'transactions_count' => $row->transactions_count,
                'total_spent' => $row->total_spent,
            ]);

        $topProducts = DB::table('transaction_details')
            ->join('transaction_headers', 'transaction_headers.id', '=', 'transaction_details.transaction_header_id')
            ->join('products', 'products.id', '=', 'transaction_details.product_id')
            ->whereBetween('transaction_headers.invoice_date', [
                now()->subMonth()->startOfMonth(),
                now()->endOfMonth(),
            ])
            ->select(
                'products.id',
                'products.name',
                'products.code',
                DB::raw('SUM(transaction_details.qty) as total_qty'),
                DB::raw('SUM(transaction_details.subtotal) as total_revenue')
            )
            ->groupBy('products.id', 'products.name', 'products.code')
            ->orderByDesc('total_qty')
            ->limit(10)
            ->get();

        $start = now()->subMonths(5)->startOfMonth();
        $end = now()->endOfMonth();

        $rawRevenue = TransactionHeader::query()
            ->whereBetween('invoice_date', [$start, $end])
            ->select(
                DB::raw("DATE_FORMAT(invoice_date, '%Y-%m') as month"),
                DB::raw('SUM(total) as total')
            )
            ->groupBy(DB::raw("DATE_FORMAT(invoice_date, '%Y-%m')"))
            ->orderBy(DB::raw("DATE_FORMAT(invoice_date, '%Y-%m')"))
            ->get()
            ->keyBy('month');
        $lastSixMonths = collect();

        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i)->format('Y-m');

            $lastSixMonths->push([
                'month' => $month,
                'total' => (float) ($rawRevenue[$month]->total ?? 0),
            ]);
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'monthlyRevenue' => round($thisMonthRevenue),
                'revenueGrowth' => round($revenueGrowth, 2),

                'monthlyTransactions' => $thisMonthTransaction,

                'newCustomers' => $thisMonthCustomers,
                'customerGrowth' => round($customerGrowth, 2),

                'lowStock' => Product::where('stock', '<=', 20)->count(),
            ],
            'topCustomers' => $topCustomers,
            'topProducts' => $topProducts,
            'monthlyRevenue' => $lastSixMonths
        ]);
    }
}
