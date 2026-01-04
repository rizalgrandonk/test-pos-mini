<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionHeader extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'invoice_number',
        'customer_id',
        'invoice_date',
        'total',
    ];

    protected function casts(): array
    {
        return [
            'invoice_date' => 'datetime',
        ];
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function transactionDetails()
    {
        return $this->hasMany(TransactionDetail::class, 'transaction_header_id');
    }

    public function scopeThisMonth($query)
    {
        return $query->whereBetween('invoice_date', [
            now()->startOfMonth(),
            now()->endOfMonth(),
        ]);
    }

    public function scopeLastMonth($query)
    {
        return $query->whereBetween('invoice_date', [
            now()->subMonth()->startOfMonth(),
            now()->subMonth()->endOfMonth(),
        ]);
    }

    // INV/YYMM/****
    public static function generateInvoiceNumber(): string
    {
        $prefix = 'INV';
        $now = Carbon::now();
        $yearMonth = $now->format('ym');

        $lastInvoice = TransactionHeader::whereYear('invoice_date', $now->year)
            ->whereMonth('invoice_date', $now->month)
            ->orderBy('invoice_number', 'desc')
            ->first();

        if ($lastInvoice) {
            $lastNumber = (int) substr($lastInvoice->invoice_number, -4);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        $numberPadded = str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

        return "{$prefix}/{$yearMonth}/{$numberPadded}";
    }

    public function recalculateTotal()
    {
        $total = $this->transactionDetails()->sum('subtotal');
        $this->update([
            'total' => $total
        ]);
    }
}
