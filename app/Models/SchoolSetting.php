<?php

namespace App\Models;

use App\Support\SchoolLocaleDefaults;
use Database\Factories\SchoolSettingFactory;
use Illuminate\Database\Eloquent\Attributes\Connection;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Tenant-scoped school profile and operational configuration (singleton row).
 *
 * @property int $id
 * @property string|null $display_name
 * @property string|null $logo_path
 * @property string|null $email
 * @property string|null $phone
 * @property string|null $address_line_1
 * @property string|null $address_line_2
 * @property string|null $city
 * @property string|null $region
 * @property string|null $postal_code
 * @property string|null $country
 * @property string $timezone
 * @property string $locale
 * @property string $currency
 * @property list<string>|null $working_days
 * @property int $first_day_of_week
 * @property string|null $day_starts_at
 * @property string|null $day_ends_at
 * @property Carbon|null $onboarded_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'display_name',
    'logo_path',
    'email',
    'phone',
    'address_line_1',
    'address_line_2',
    'city',
    'region',
    'postal_code',
    'country',
    'timezone',
    'locale',
    'currency',
    'working_days',
    'first_day_of_week',
    'day_starts_at',
    'day_ends_at',
    'onboarded_at',
])]
#[Connection('tenant')]
class SchoolSetting extends Model
{
    /** @use HasFactory<SchoolSettingFactory> */
    use HasFactory;

    /**
     * Default Monday–Friday working week.
     *
     * @var list<string>
     */
    public const DefaultWorkingDays = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
    ];

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'timezone' => 'Asia/Karachi',
        'locale' => 'en',
        'currency' => 'PKR',
        'country' => 'PK',
        'first_day_of_week' => 1,
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'working_days' => 'array',
            'first_day_of_week' => 'integer',
            'onboarded_at' => 'datetime',
        ];
    }

    public function isOnboarded(): bool
    {
        return $this->onboarded_at !== null;
    }

    /**
     * Fetch the singleton settings row, creating defaults when missing.
     */
    public static function current(): static
    {
        /** @var static $settings */
        $settings = static::query()->firstOrCreate(
            ['id' => 1],
            [
                'timezone' => SchoolLocaleDefaults::Timezone,
                'locale' => SchoolLocaleDefaults::Locale,
                'currency' => SchoolLocaleDefaults::Currency,
                'country' => SchoolLocaleDefaults::Country,
            ],
        );

        return $settings;
    }
}
