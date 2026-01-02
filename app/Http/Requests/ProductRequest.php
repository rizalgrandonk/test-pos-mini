<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('id');

        return [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('products')->ignore($productId),
                'regex:/^[a-zA-Z0-9]+$/'
            ],
            'name'   => 'required|string|max:150',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ];
    }
}