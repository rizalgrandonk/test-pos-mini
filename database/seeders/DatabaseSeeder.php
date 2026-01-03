<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Product;
use App\Models\TransactionDetail;
use App\Models\TransactionDiscount;
use App\Models\TransactionHeader;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        $products = Product::factory()
            ->count(100)
            ->withProductCode()
            ->create();

        $customers = Customer::factory()
            ->count(100)
            ->withCode()
            ->create();

        $customerIds = $customers->pluck('id');
        $productIds = $products->pluck('id');

        // Transaction Header
        $transactionHeaders = collect();

        $transactionsPerMonth = 20;
        $monthsBack = 3;

        foreach (range(1, $monthsBack) as $monthOffset) {
            $date = Carbon::now()->subMonths($monthOffset);
            $yearMonth = $date->format('ym');
            $sequence = 1;

            foreach (range(1, $transactionsPerMonth) as $i) {
                $transactionHeaders->push(
                    TransactionHeader::create([
                        'invoice_number' => sprintf(
                            'INV/%s/%04d',
                            $yearMonth,
                            $sequence++
                        ),
                        'invoice_date' => $date
                            ->copy()
                            ->day(rand(1, $date->daysInMonth)),
                        'customer_id' => $customerIds->random(),
                        'total' => 0
                    ])
                );
            }
        }

        // Transaction Detail
        foreach ($transactionHeaders as $header) {
            $headerTotal = 0;

            // prevent duplicate product in one invoice
            $usedProductIds = collect();

            $itemsCount = rand(1, 3);

            for ($i = 0; $i < $itemsCount; $i++) {
                do {
                    $product = $products->random();
                } while ($usedProductIds->contains($product->id));

                $usedProductIds->push($product->id);

                $qty = rand(1, 5);
                $price = $product->price;
                $netPrice = $price;

                // detail (temp values)
                $detail = TransactionDetail::create([
                    'transaction_header_id' => $header->id,
                    'product_id' => $product->id,
                    'qty' => $qty,
                    'price' => $price,
                    'net_price' => $price,
                    'subtotal' => $price * $qty,
                ]);

                // ===== DISCOUNTS =====
                $discountCount = rand(0, 2);
                $sequence = 1;

                for ($d = 0; $d < $discountCount; $d++) {
                    $type = rand(0, 1)
                        ? TransactionDiscount::TYPE_PERCENTAGE
                        : TransactionDiscount::TYPE_AMOUNT;

                    if ($type === TransactionDiscount::TYPE_PERCENTAGE) {
                        $value = rand(5, 20); // %
                        $discountAmount = $netPrice * ($value / 100);
                    } else {
                        $value = rand(5_000, 50_000);
                        $discountAmount = $value;
                    }

                    $netPrice = max(0, $netPrice - $discountAmount);

                    TransactionDiscount::create([
                        'transaction_detail_id' => $detail->id,
                        'sequence' => $sequence++,
                        'type' => $type,
                        'value' => $value,
                    ]);
                }

                // ===== FINAL DETAIL UPDATE =====
                $subtotal = $netPrice * $qty;

                $detail->update([
                    'net_price' => $netPrice,
                    'subtotal' => $subtotal,
                ]);

                $headerTotal += $subtotal;
            }

            // ===== FINAL HEADER TOTAL =====
            $header->update([
                'total' => $headerTotal,
            ]);
        }
    }
}
