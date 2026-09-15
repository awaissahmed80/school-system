<?php

namespace Database\Factories;

use App\Models\SchoolSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SchoolSetting>
 */
class SchoolSettingFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'display_name' => fake()->company().' School',
            'logo_path' => null,
            'email' => fake()->companyEmail(),
            'phone' => fake()->e164PhoneNumber(),
            'address_line_1' => fake()->streetAddress(),
            'address_line_2' => null,
            'city' => fake()->city(),
            'region' => fake()->state(),
            'postal_code' => fake()->postcode(),
            'country' => 'PK',
            'timezone' => 'Asia/Karachi',
            'locale' => 'en',
            'currency' => 'PKR',
            'working_days' => SchoolSetting::DefaultWorkingDays,
            'first_day_of_week' => 1,
            'day_starts_at' => '08:00:00',
            'day_ends_at' => '15:00:00',
            'onboarded_at' => null,
        ];
    }

    public function onboarded(): static
    {
        return $this->state(fn (array $attributes) => [
            'onboarded_at' => now(),
        ]);
    }
}
