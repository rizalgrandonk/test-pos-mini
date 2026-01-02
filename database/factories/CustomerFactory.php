<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\Sequence;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName . ' ' . $this->faker->lastName,
            'province' => 'Jawa Timur',
            'province_id' => 11,
            'regency' => 'Kota Surabaya',
            'regency_id' => 159,
            'district' => 'Wiyung',
            'district_id' => 2528,
            'village' => 'Babatan',
            'village_id' => 36589,
            'address' => $this->faker->streetAddress,
            'postal_code' => '60227',
        ];
    }

    public function withCode(): static
    {
        return $this->state(
            new Sequence(fn($sequence) => [
                'code' => 'CTM' . str_pad($sequence->index + 1, 5, '0', STR_PAD_LEFT),
            ])
        );
    }
}
