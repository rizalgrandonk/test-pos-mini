<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionDetailRequest;
use App\Models\Product;
use App\Models\TransactionDetail;
use App\Models\TransactionHeader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class TransactionDetailController extends Controller
{
    private static $allowedSortColumn = [
        'transaction_header_id' => 'transaction_details.transaction_header_id',
        'product_id' => 'transaction_details.product_id',
        'qty' => 'transaction_details.qty',
        'price' => 'transaction_details.price',
        'net_price' => 'transaction_details.net_price',
        'subtotal' => 'transaction_details.subtotal',
        'product_name' => 'products.name',
        'product_code' => 'products.code',
        'transaction_header_invoice_number' => 'transaction_headers.invoice_number'
    ];

    public function table($header_id, Request $request)
    {
        $query = TransactionDetail::query()
            ->select([
                'transaction_details.id',
                'transaction_details.transaction_header_id',
                'transaction_details.product_id',
                'transaction_details.qty',
                'transaction_details.price',
                'transaction_details.net_price',
                'transaction_details.subtotal',

                'products.name as product_name',
                'products.code as product_code',
                'transaction_headers.invoice_number as transaction_header_invoice_number'
            ])
            ->leftJoin(
                'products',
                'products.id',
                '=',
                'transaction_details.product_id'
            )
            ->leftJoin(
                'transaction_headers',
                'transaction_headers.id',
                '=',
                'transaction_details.transaction_header_id'
            );

        $query->where('transaction_header_id', '=', $header_id);

        if ($search = $request->get('search')) {
            $query->where(function ($query) use ($search) {
                $query->where('transaction_headers.invoice_number', 'LIKE', "%{$search}%")
                    ->orWhere('products.name', 'LIKE', "%{$search}%")
                    ->orWhere('products.code', 'LIKE', "%{$search}%");
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

    public function create($header_id): Response
    {
        $transaction = TransactionHeader::find($header_id);
        if (!$transaction) {
            return Inertia::render('404');
        }

        return Inertia::render('transaction-details/create', [
            'transaction' => $transaction
        ]);
    }

    public function edit($header_id, $id): Response
    {
        $transaction = TransactionHeader::find($header_id);
        if (!$transaction) {
            return Inertia::render('404');
        }

        $transactionDetail = TransactionDetail::with(['discounts', 'product'])->find($id);

        if (!$transactionDetail) {
            return Inertia::render('404');
        }

        return Inertia::render('transaction-details/edit', [
            'transaction' => $transaction,
            'transactionDetail' => $transactionDetail
        ]);
    }

    public function store($header_id, TransactionDetailRequest $request)
    {
        $transaction = TransactionHeader::find($header_id);
        if (!$transaction) {
            return back()->with(
                'error',
                'Data not found',
            );
        }

        $data = $request->validated();

        try {
            DB::transaction(function () use ($data, $header_id) {
                $product = Product::lockForUpdate()->findOrFail($data['product_id']);

                $detail = TransactionDetail::create([
                    'transaction_header_id' => $header_id,
                    'product_id' => $data['product_id'],
                    'qty' => $data['qty'],
                    'price' => $data['price'],
                    'net_price' => 0,
                    'subtotal' => 0,
                ]);

                $product->adjustStock(-$detail->qty);
                $detail->syncDiscounts($data['discounts'] ?? []);
                $detail->recalculateValues();
                $detail->transactionHeader->recalculateTotal();
            });

            return to_route('transactions.edit', ['id' => $header_id])
                ->with('success', 'Transaction detail created');
        } catch (\Throwable $e) {
            Log::error('TransactionDetail store failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with([
                'error' => 'Failed to create transaction detail.',
            ]);
        }
    }

    public function update($header_id, $id, TransactionDetailRequest $request)
    {
        $transaction = TransactionHeader::find($header_id);
        if (!$transaction) {
            return back()->with(
                'error',
                'Data not found',
            );
        }

        $transactionDetail = TransactionDetail::find($id);
        if (!$transactionDetail) {
            return back()->with(
                'error',
                'Data not found',
            );
        }

        $data = $request->validated();

        try {
            DB::transaction(function () use ($data, $transactionDetail) {
                $product = Product::lockForUpdate()->findOrFail($data['product_id']);

                $qtyDiff = $data['qty'] - $transactionDetail->qty;

                $transactionDetail->update([
                    'product_id' => $data['product_id'],
                    'qty' => $data['qty'],
                    'price' => $data['price'],
                ]);

                $product->adjustStock(-$qtyDiff);
                $transactionDetail->syncDiscounts($data['discounts'] ?? []);
                $transactionDetail->recalculateValues();
                $transactionDetail->transactionHeader->recalculateTotal();
            });

            return to_route('transactions.edit', ['id' => $header_id])
                ->with('success', 'Transaction detail created');
        } catch (\Throwable $e) {
            Log::error('TransactionDetail update failed', [
                'id' => $transactionDetail->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with([
                'error' => 'Failed to update transaction detail.',
            ]);
        }
    }

    public function destroy($header_id, $id)
    {
        try {
            $transaction = TransactionHeader::find($header_id);
            if (!$transaction) {
                return back()->withErrors([
                    'delete' => 'Data not found',
                ])->with(
                    'error',
                    'Data not found',
                );
            }

            $transactionDetail = TransactionDetail::find($id);
            if (!$transactionDetail) {
                return back()->withErrors([
                    'delete' => 'Data not found',
                ])->with(
                    'error',
                    'Data not found',
                );
            }

            DB::transaction(function () use ($transaction, $transactionDetail) {
                $product = Product::lockForUpdate()
                    ->findOrFail($transactionDetail->product_id);

                $product->adjustStock($transactionDetail->qty);
                $transactionDetail->delete();
                $transaction->recalculateTotal();
            });


            return back()->with('success', 'Transaction detail deleted successfully.');
        } catch (\Throwable $e) {
            Log::error('Transaction detail delete error', [
                'transaction_detail_id' => $id,
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

    public function bulkDestroy($header_id, Request $request)
    {
        $transaction = TransactionHeader::find($header_id);
        if (!$transaction) {
            return back()->withErrors([
                'delete' => 'Data not found',
            ])->with(
                'error',
                'Data not found',
            );
        }

        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:transaction_details,id'],
        ]);

        try {
            DB::transaction(function () use ($request, $transaction) {
                $details = TransactionDetail::whereIn('id', $request->ids)
                    ->lockForUpdate()
                    ->get();
                if ($details->isEmpty()) {
                    return;
                }

                foreach ($details as $detail) {
                    $product = Product::lockForUpdate()
                        ->find($detail->product_id);
                    if ($product) {
                        $product->adjustStock($detail->qty);
                    }

                    $detail->delete();
                }

                $transaction->recalculateTotal();
            });

            return back()->with(
                'success',
                count($validated['ids']) . ' detail transactions deleted successfully.'
            );
        } catch (\Throwable $e) {
            Log::error('Bulk transaction detail delete error', [
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
