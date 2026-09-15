<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Connection;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Multitenancy\Models\Tenant as BaseTenant;

#[Fillable(['name', 'code', 'database', 'identifier', 'status', 'secret_key', 'public_key', 'api_key'])]
#[Hidden(['secret_key', 'public_key', 'api_key', 'database'])]
#[Connection('landlord')]
class Tenant extends BaseTenant
{
    use SoftDeletes;

    public static ?int $currentTenantId = null;

    protected static function booted(): void
    {
        static::creating(function (Tenant $tenant): void {
            if (filled($tenant->code)) {
                return;
            }

            $nextId = (int) (static::withTrashed()->max('id') ?? 0) + 1;
            $datePart = date('dm');
            $numberPart = str_pad((string) $nextId, 6, '0', STR_PAD_LEFT);

            $tenant->code = 'S'.$nextId.$datePart.$numberPart;
        });
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
