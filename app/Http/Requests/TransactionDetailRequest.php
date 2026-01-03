<?php

namespace App\Http\Requests;

use App\Models\Product;
use App\Models\TransactionDetail;
use App\Models\TransactionDiscount;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TransactionDetailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => [
                'required',
                'exists:products,id'
            ],
            'price' => ['required', 'numeric', 'min:0'],
            'qty' => [
                'required',
                'integer',
                'min:1',
                function (string $attribute, mixed $value, Closure $fail) {
                    $detail = null;
                    if ($this->route('id')) {
                        $detail = TransactionDetail::find($this->route('id'));
                    }
                    $productId = $this->product_id;
                    if (!$productId) {
                        return;
                    }
                    $product = Product::find($productId);
                    if (!$product) {
                        return;
                    }

                    $existingQty = $detail?->qty ?? 0;
                    $available = $product->stock + $existingQty;

                    if ($value > $available) {
                        $fail("Quantity exceeds available stock ({$available}).");
                    }
                },
            ],

            'discounts' => ['array'],
            'discounts.*.id' => ['nullable', 'exists:transaction_discounts,id'],
            'discounts.*.type' => [
                'required',
                Rule::in([
                    TransactionDiscount::TYPE_PERCENTAGE,
                    TransactionDiscount::TYPE_AMOUNT
                ])
            ],
            'discounts.*.value' => ['required', 'numeric', 'min:0'],
            'discounts.*.sequence' => ['required', 'integer', 'min:1'],
        ];
    }
}
