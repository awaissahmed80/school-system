<?php

namespace App\Models;

use App\Enums\UserStatus;
use App\Enums\UserType;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Connection;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Spatie\Permission\Traits\HasRoles;

/**
 * Central auth identity for the platform (landlord).
 *
 * @property int $id
 * @property string|null $first_name
 * @property string|null $last_name
 * @property string $email_address
 * @property string|null $phone
 * @property Carbon|null $email_verified_at
 * @property string|null $password
 * @property string|null $remember_token
 * @property UserType $user_type
 * @property int|null $tenant_id
 * @property UserStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'first_name',
    'last_name',
    'email_address',
    'phone',
    'password',
    'email_verified_at',
    'user_type',
    'tenant_id',
    'status',
])]
#[Hidden(['password', 'remember_token'])]
#[Connection('landlord')]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable, SoftDeletes;

    /**
     * Spatie guard follows user type; permissions are granted only through roles.
     */
    public function guardName(): string
    {
        $type = $this->user_type;

        if ($type instanceof UserType) {
            return $type->guardName();
        }

        return (string) ($type ?: 'web');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'user_type' => UserType::class,
            'status' => UserStatus::class,
        ];
    }

    public function getEmailForPasswordReset(): string
    {
        return $this->email_address;
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * School membership rows in the current tenant DB (requires a tenant to be current).
     */
    public function tenant_users(): HasMany
    {
        return $this->hasMany(TenantUser::class, 'landlord_user_id', 'id');
    }
}
