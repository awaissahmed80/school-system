<?php

namespace App\Support;

use DateTime;
use DateTimeZone;
use Exception;

class SchoolLocaleDefaults
{
    public const Timezone = 'Asia/Karachi';

    public const Currency = 'PKR';

    public const Country = 'PK';

    public const Locale = 'en';

    /**
     * @return list<array{value: string, label: string, offset: string}>
     */
    public static function timezones(): array
    {
        $preferred = [
            'Asia/Karachi' => 'Pakistan',
            'Asia/Dubai' => 'United Arab Emirates',
            'Asia/Riyadh' => 'Saudi Arabia',
            'Asia/Kolkata' => 'India',
            'Asia/Dhaka' => 'Bangladesh',
            'Europe/London' => 'United Kingdom',
            'America/New_York' => 'United States Eastern',
            'UTC' => 'UTC',
        ];

        $options = [];

        foreach ($preferred as $value => $name) {
            $offset = self::offsetLabel($value);
            $options[] = [
                'value' => $value,
                'label' => "{$name} ({$value}) · {$offset}",
                'offset' => $offset,
            ];
        }

        foreach (timezone_identifiers_list() as $timezone) {
            if (isset($preferred[$timezone])) {
                continue;
            }

            $offset = self::offsetLabel($timezone);
            $options[] = [
                'value' => $timezone,
                'label' => "{$timezone} · {$offset}",
                'offset' => $offset,
            ];
        }

        return $options;
    }

    /**
     * Format a timezone offset like +5 or +5:30.
     */
    public static function offsetLabel(string $timezone): string
    {
        try {
            $dateTimeZone = new DateTimeZone($timezone);
            $offsetSeconds = $dateTimeZone->getOffset(new DateTime('now', $dateTimeZone));
        } catch (Exception) {
            return 'UTC';
        }

        $sign = $offsetSeconds >= 0 ? '+' : '-';
        $absolute = abs($offsetSeconds);
        $hours = intdiv($absolute, 3600);
        $minutes = intdiv($absolute % 3600, 60);

        if ($minutes === 0) {
            return $sign.$hours;
        }

        return sprintf('%s%d:%02d', $sign, $hours, $minutes);
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function currencies(): array
    {
        return [
            ['value' => 'PKR', 'label' => 'Pakistani Rupee (PKR)'],
            ['value' => 'USD', 'label' => 'US Dollar (USD)'],
            ['value' => 'AED', 'label' => 'UAE Dirham (AED)'],
            ['value' => 'SAR', 'label' => 'Saudi Riyal (SAR)'],
            ['value' => 'GBP', 'label' => 'British Pound (GBP)'],
            ['value' => 'EUR', 'label' => 'Euro (EUR)'],
            ['value' => 'INR', 'label' => 'Indian Rupee (INR)'],
        ];
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function countries(): array
    {
        return [
            ['value' => 'PK', 'label' => 'Pakistan'],
            ['value' => 'AE', 'label' => 'United Arab Emirates'],
            ['value' => 'SA', 'label' => 'Saudi Arabia'],
            ['value' => 'GB', 'label' => 'United Kingdom'],
            ['value' => 'US', 'label' => 'United States'],
            ['value' => 'IN', 'label' => 'India'],
            ['value' => 'BD', 'label' => 'Bangladesh'],
        ];
    }
}
