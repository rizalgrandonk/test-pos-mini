<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionDetail extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'transaction_header_id',
        'product_id',
        'product_name',
        'qty',
        'price',
        'net_price',
        'subtotal',
    ];

    public function transactionHeader()
    {
        return $this->belongsTo(TransactionHeader::class, 'transaction_header_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function discounts()
    {
        return $this->hasMany(TransactionDiscount::class, 'transaction_detail_id');
    }
}
