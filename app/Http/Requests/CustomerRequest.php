<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $customerId = $this->route('id');

        return [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('customers')->ignore($customerId),
                'regex:/^[a-zA-Z0-9]+$/'
            ],
            'name'         => 'required|string|max:150',
            'province_id'  => 'nullable|integer',
            'regency_id'   => 'nullable|integer',
            'district_id'  => 'nullable|integer',
            'village_id'   => 'nullable|integer',
            'province'     => 'nullable|string|max:150',
            'regency'      => 'nullable|string|max:150',
            'district'     => 'nullable|string|max:150',
            'village'      => 'nullable|string|max:150',
            'postal_code'  => 'nullable|string|max:50',
            'address'      => 'nullable|string|max:255',
        ];
    }
}