<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionHeaderRequest;
use App\Models\TransactionHeader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class TransactionHeaderController extends Controller
{
    private static $allowedSortColumn = [
        'invoice_number' => 'transaction_headers.invoice_number',
        'customer_id' => 'transaction_headers.customer_id',
        'invoice_date' => 'transaction_headers.invoice_date',
        'total' => 'transaction_headers.total',
        'customer_name' => 'customers.name',
        'customer_code' => 'customers.code',
    ];

    public function index(Request $request): Response
    {
        return Inertia::render('transactions/index');
    }

    public function table(Request $request)
    {
        $query = TransactionHeader::query()
            ->select([
                'transaction_headers.id',
                'transaction_headers.invoice_number',
                'transaction_headers.customer_id',
                'transaction_headers.invoice_date',
                'transaction_headers.total',
                'customers.name as customer_name',
                'customers.code as customer_code',
            ])
            ->leftJoin(
                'customers',
                'customers.id',
                '=',
                'transaction_headers.customer_id'
            );

        if ($search = $request->get('search')) {
            $query->where(function ($query) use ($search) {
                $query->where('invoice_number', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('sort')) {
            [$column, $direction] = explode(':', $request->sort);

            if (isset(self::$allowedSortColumn[$column])) {
                $query->orderBy(self::$allowedSortColumn[$column], $direction);
            }
        }

        return $query->paginate(
            $request->integer('perPage', 10)
        );
    }

    public function create(Request $request): Response
    {
        return Inertia::render('transactions/create');
    }

    public function edit($id): Response
    {
        $transaction = TransactionHeader::find($id);

        if (!$transaction) {
            return Inertia::render('404');
        }

        return Inertia::render('transactions/edit', [
            'transaction' => $transaction
        ]);
    }

    public function store(TransactionHeaderRequest $request)
    {
        try {
            $data = $request->validated();
            $data['invoice_number'] = TransactionHeader::generateInvoiceNumber();

            $transaction = TransactionHeader::create($data);

            return to_route('transactions.edit', ['id' => $transaction->id]);
        } catch (\Exception $e) {
            Log::error('Product store error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'delete' => 'An unexpected error occurred. Please try again.',
            ])->with(
                'error',
                'An unexpected error occurred. Please try again.',
            );
        }
    }

    public function update($id, TransactionHeaderRequest $request)
    {
        try {
            $transaction = TransactionHeader::find($id);

            if (!$transaction) {
                return back()->withErrors([
                    'delete' => 'Data not found',
                ])->with(
                    'error',
                    'Data not found',
                );
            }

            $data = $request->validated();

            $transaction->update($data);

            return back()->with('success', 'Transaction updated successfully');
        } catch (\Exception $e) {
            Log::error('Transaction update error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'delete' => 'An unexpected error occurred. Please try again.',
            ])->with(
                'error',
                'An unexpected error occurred. Please try again.',
            );
        }
    }

    public function destroy($id)
    {
        try {
            $transaction = TransactionHeader::find($id);

            if (!$transaction) {
                return back()->withErrors([
                    'delete' => 'Data not found',
                ])->with(
                    'error',
                    'Data not found',
                );
            }

            $transaction->delete();

            return back()->with('success', 'Transaction deleted successfully.');
        } catch (\Throwable $e) {
            Log::error('Transaction delete error', [
                'transaction_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors([
                'delete' => 'An unexpected error occurred. Please try again.',
            ])->with(
                'error',
                'An unexpected error occurred. Please try again.',
            );
        }
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:transaction_headers,id'],
        ]);

        try {
            TransactionHeader::whereIn('id', $validated['ids'])->delete();

            return back()->with(
                'success',
                count($validated['ids']) . ' transactions deleted successfully.'
            );
        } catch (\Throwable $e) {
            Log::error('Bulk transaction delete error', [
                'ids' => $validated['ids'],
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors([
                'delete' => 'An unexpected error occurred. Please try again.',
            ])->with(
                'error',
                'An unexpected error occurred. Please try again.',
            );
        }
    }
}
