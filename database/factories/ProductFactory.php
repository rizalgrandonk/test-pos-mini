<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\Sequence;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'  => $this->faker->word . ' ' . $this->faker->word,
            'price' => $this->faker->numberBetween(10000, 500000),
            'stock' => $this->faker->numberBetween(10, 100),
        ];
    }

    public function withProductCode(): static
    {
        return $this->state(
            new Sequence(fn($sequence) => [
                'code' => 'PROD' . str_pad($sequence->index + 1, 5, '0', STR_PAD_LEFT),
            ])
        );
    }
}
