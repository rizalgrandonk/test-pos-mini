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

    public function syncDiscounts(array $discounts)
    {
        $incomingIds = collect($discounts)
            ->pluck('id')
            ->filter()
            ->values();

        $this->discounts()
            ->whereNotIn('id', $incomingIds)
            ->delete();

        foreach ($discounts as $discount) {
            $this->discounts()->updateOrCreate(
                [
                    'id' => $discount['id'] ?? null,
                ],
                [
                    'type' => $discount['type'],
                    'value' => $discount['value'],
                    'sequence' => $discount['sequence'],
                ]
            );
        }
    }

    public function recalculateValues(): void
    {
        $price = $this->price;
        $qty = $this->qty;
        $net = $price;

        foreach ($this->discounts()->orderBy('sequence')->get() as $discount) {
            if ($discount->type === TransactionDiscount::TYPE_PERCENTAGE) {
                $net -= $net * ($discount->value / 100);
            } else {
                $net -= $discount->value;
            }
        }

        $this->update([
            'net_price' => max(0, $net),
            'subtotal' => max(0, $net * $qty),
        ]);
    }
}
