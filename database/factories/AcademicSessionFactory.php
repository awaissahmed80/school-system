<?php

namespace Database\Factories;

use App\Models\AcademicSession;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AcademicSession>
 */
class AcademicSessionFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startYear = (int) fake()->numberBetween(2024, 2030);

        return [
            'name' => $startYear.'-'.($startYear + 1),
            'code' => (string) $startYear,
            'starts_on' => sprintf('%d-09-01', $startYear),
            'ends_on' => sprintf('%d-07-31', $startYear + 1),
            'is_active' => false,
            'description' => null,
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }
}
