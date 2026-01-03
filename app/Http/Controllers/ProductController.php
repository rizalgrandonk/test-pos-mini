<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use \App\Models\Product;
use App\Models\TransactionDetail;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    private static $allowedSortColumn = [
        'name',
        'code',
        'price',
        'stock'
    ];

    public function index(Request $request): Response
    {
        return Inertia::render('products/index');
    }

    public function table(Request $request)
    {
        $query = Product::query();

        if ($search = $request->get('search')) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('code', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('sort')) {
            [$column, $direction] = explode(':', $request->sort);

            if (in_array($column, self::$allowedSortColumn)) {
                $query->orderBy($column, $direction);
            }
        }

        return $query->paginate(
            $request->integer('perPage', 10)
        );
    }

    public function search(Request $request)
    {
        $search = $request->string('q');
        $available = $request->string('available');

        $query = Product::query()
            ->where(function ($query) use ($search) {
                $query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('code', 'LIKE', "%{$search}%")
                    ->orWhere('id', '=', $search);
            });

        if ($available == "1") {
            $query->where('stock', '>', 0);
        }

        return $query->orderBy('name')
            ->limit(10)
            ->get();
    }

    public function create(Request $request): Response
    {
        return Inertia::render('products/create');
    }

    public function edit($id): Response
    {
        $product = Product::find($id);

        if (!$product) {
            return Inertia::render('404');
        }

        return Inertia::render('products/edit', [
            'product' => $product
        ]);
    }

    public function store(ProductRequest $request)
    {
        try {
            $data = $request->validated();

            $product = Product::create($data);

            return to_route('products.edit', ['id' => $product->id]);
        } catch (\Exception $e) {
            Log::error('Product store error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with(
                'error',
                'An unexpected error occurred. Please try again.',
            );
        }
    }

    public function update($id, ProductRequest $request)
    {
        try {
            $product = Product::find($id);

            if (!$product) {
                return back()->with(
                    'error',
                    'Data not found',
                );
            }

            $data = $request->validated();

            $product->update($data);

            return back()->with('success', 'Product updated successfully');
        } catch (\Exception $e) {
            Log::error('Product update error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with(
                'error',
                'An unexpected error occurred. Please try again.',
            );
        }
    }

    public function destroy($id)
    {
        try {
            $product = Product::find($id);

            if (!$product) {
                return back()->withErrors([
                    'delete' => 'Data not found',
                ])->with(
                    'error',
                    'Data not found',
                );
            }

            if (TransactionDetail::where('product_id', $product->id)->exists()) {
                return back()->withErrors([
                    'delete' => 'Transaction with the product exists',
                ])->with(
                    'error',
                    'Transaction with the product exists',
                );
            }

            $product->delete();

            return back()->with('success', 'Product deleted successfully.');
        } catch (\Throwable $e) {
            Log::error('Product delete error', [
                'product_id' => $id,
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
            'ids.*' => ['integer', 'exists:products,id'],
        ]);

        try {
            if (TransactionDetail::whereIn('product_id', $validated['ids'])->exists()) {
                return back()->withErrors([
                    'delete' => 'Transaction with the product exists',
                ])->with(
                    'error',
                    'Transaction with the product exists',
                );
            }

            Product::whereIn('id', $validated['ids'])->delete();

            return back()->with(
                'success',
                count($validated['ids']) . ' products deleted successfully.'
            );
        } catch (\Throwable $e) {
            Log::error('Bulk product delete error', [
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
