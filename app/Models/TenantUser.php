<?php

namespace App\Models;

use App\Enums\UserType;
use Illuminate\Database\Eloquent\Attributes\Connection;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Spatie\Permission\Traits\HasRoles;

/**
 * School-scoped membership linking a landlord {@see User} into the current tenant.
 * Identity fields live on User; `user_type` mirrors User.user_type for tenant-local roles/queries.
 *
 * @property int $id
 * @property int $landlord_user_id
 * @property UserType $user_type
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'landlord_user_id',
    'user_type',
])]
#[Connection('tenant')]
class TenantUser extends Model
{
    use HasRoles;
    use SoftDeletes;

    /**
     * Spatie guard is derived from the school user type.
     */
    public function guardName(): string
    {
        $type = $this->user_type;

        if ($type instanceof UserType) {
            return $type->guardName();
        }

        return (string) $type;
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'user_type' => UserType::class,
        ];
    }

    public function landlord_user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'landlord_user_id');
    }
}
