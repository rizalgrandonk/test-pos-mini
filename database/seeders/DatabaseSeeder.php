<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Product;
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

        Product::factory()
            ->count(100)
            ->withProductCode()
            ->create();

        $customers = Customer::factory()
            ->count(100)
            ->withCode()
            ->create();

        // Transaction Header
        $transactionHeaders = collect();

        $transactionsPerMonth = 20;
        $monthsBack = 5;
        
        $customerIds = $customers->pluck('id');

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
    }
}
