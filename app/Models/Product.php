<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'price',
        'stock',
    ];

    public function transactionDetails()
    {
        return $this->hasMany(TransactionDetail::class, 'product_id');
    }

    public function adjustStock(int $delta)
    {
        $newStock = $this->stock + $delta;

        if ($newStock < 0) {
            throw new \RuntimeException('Insufficient stock');
        }

        $this->updateQuietly([
            'stock' => $newStock,
        ]);
    }
}
