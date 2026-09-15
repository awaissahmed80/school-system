<?php

namespace App\Enums;

enum UserType: string
{
    case PlatformAdmin = 'platform_admin';
    case SchoolOwner = 'school_owner';
    case Admin = 'admin';
    case Student = 'student';
    case Teacher = 'teacher';
    case Staff = 'staff';
    case Guardian = 'guardian';

    public function label(): string
    {
        return match ($this) {
            self::PlatformAdmin => 'Platform Admin',
            self::SchoolOwner => 'School Owner',
            self::Admin => 'Admin',
            self::Student => 'Student',
            self::Teacher => 'Teacher',
            self::Staff => 'Staff',
            self::Guardian => 'Parent / Guardian',
        };
    }

    /**
     * User types that exist as people inside a tenant school.
     *
     * @return list<self>
     */
    public static function tenantTypes(): array
    {
        return [
            self::Admin,
            self::Student,
            self::Teacher,
            self::Staff,
            self::Guardian,
        ];
    }

    /**
     * Spatie guard name for this user type.
     */
    public function guardName(): string
    {
        return $this->value;
    }
}
