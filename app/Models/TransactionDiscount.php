<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionDiscount extends Model
{
    use SoftDeletes;

    const TYPE_PERCENTAGE = 'PERCENTAGE';
    const TYPE_AMOUNT = 'AMOUNT';

    protected $fillable = [
        'transaction_detail_id',
        'sequence',
        'type',
        'value',
    ];

    public function transactionDetail()
    {
        return $this->belongsTo(TransactionDetail::class, 'transaction_detail_id');
    }
}
