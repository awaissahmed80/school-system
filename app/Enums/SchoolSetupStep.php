<?php

namespace App\Enums;

enum SchoolSetupStep: string
{
    case Profile = 'profile';
    case Calendar = 'calendar';
    case Session = 'session';
    case Review = 'review';

    public function next(): ?self
    {
        return match ($this) {
            self::Profile => self::Calendar,
            self::Calendar => self::Session,
            self::Session => self::Review,
            self::Review => null,
        };
    }

    public function index(): int
    {
        return match ($this) {
            self::Profile => 0,
            self::Calendar => 1,
            self::Session => 2,
            self::Review => 3,
        };
    }

    public static function fromIndex(int $index): self
    {
        return match ($index) {
            0 => self::Profile,
            1 => self::Calendar,
            2 => self::Session,
            default => self::Review,
        };
    }
}
