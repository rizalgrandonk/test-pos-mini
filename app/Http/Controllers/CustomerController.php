<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use Illuminate\Http\Request;
use \App\Models\Customer;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    private static $allowedSortColumn = [
        'code',
        'name',
        'province',
        'regency',
        'district',
        'village',
        'address',
        'postal_code',
    ];

    public function index(Request $request): Response
    {
        return Inertia::render('customers/index');
    }

    public function table(Request $request)
    {
        $query = Customer::query();

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

        return Customer::query()
            ->where(function ($query) use ($search) {
                $query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('code', 'LIKE', "%{$search}%")
                    ->orWhere('id', '=', $search);
            })
            ->orderBy('name')
            ->limit(10)
            ->get();
    }

    public function create(Request $request): Response
    {
        return Inertia::render('customers/create');
    }

    public function edit($id): Response
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return Inertia::render('404');
        }

        return Inertia::render('customers/edit', [
            'customer' => $customer
        ]);
    }

    public function store(CustomerRequest $request)
    {
        try {
            $data = $request->validated();

            $customer = Customer::create($data);

            return to_route('customer.edit', ['id' => $customer->id]);
        } catch (\Exception $e) {
            Log::error('Customer store error: ' . $e->getMessage(), [
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

    public function update($id, CustomerRequest $request)
    {
        try {
            $customer = Customer::find($id);

            if (!$customer) {
                return back()->withErrors([
                    'delete' => 'Data not found',
                ])->with(
                    'error',
                    'Data not found',
                );
            }

            $data = $request->validated();

            $customer->update($data);

            return back()->with('success', 'Customer updated successfully');
        } catch (\Exception $e) {
            Log::error('Customer update error: ' . $e->getMessage(), [
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
            $customer = Customer::find($id);

            if (!$customer) {
                return back()->withErrors([
                    'delete' => 'Data not found',
                ])->with(
                    'error',
                    'Data not found',
                );
            }

            // TODO handle check customer with transaction

            $customer->delete();

            return back()->with('success', 'Customer deleted successfully.');
        } catch (\Throwable $e) {
            Log::error('Customer delete error', [
                'customer_id' => $id,
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
            'ids.*' => ['integer', 'exists:customers,id'],
        ]);

        try {
            // TODO handle check customer with transaction

            Customer::whereIn('id', $validated['ids'])->delete();

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

    public function getProvinces()
    {
        $data = Customer::getProvinces();
        return response()->json($data);
    }

    public function getRegencies(Request $request)
    {
        $provinceId = $request->query('province_id');
        $data = Customer::getRegencies($provinceId);
        return response()->json($data);
    }

    public function getDistricts(Request $request)
    {
        $regencyId = $request->query('regency_id');
        $data = Customer::getDistricts($regencyId);
        return response()->json($data);
    }

    public function getVillages(Request $request)
    {
        $districtId = $request->query('district_id');
        $data = Customer::getVillages($districtId);
        return response()->json($data);
    }

    public function getPostalCodes(Request $request)
    {
        $regencyId = $request->query('regency_id');
        $districtId = $request->query('district_id');
        $data = Customer::getPostalCodes($regencyId, $districtId);
        return response()->json($data);
    }
}
