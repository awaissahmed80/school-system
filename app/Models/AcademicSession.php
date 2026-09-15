<?php

namespace App\Models;

use Database\Factories\AcademicSessionFactory;
use Illuminate\Database\Eloquent\Attributes\Connection;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * Tenant-scoped academic year / session.
 *
 * Only one session should be active at a time; use {@see activate()} to switch.
 *
 * @property int $id
 * @property string $name
 * @property string|null $code
 * @property Carbon $starts_on
 * @property Carbon $ends_on
 * @property bool $is_active
 * @property string|null $description
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'name',
    'code',
    'starts_on',
    'ends_on',
    'is_active',
    'description',
])]
#[Connection('tenant')]
class AcademicSession extends Model
{
    /** @use HasFactory<AcademicSessionFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'is_active' => false,
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'starts_on' => 'date',
            'ends_on' => 'date',
            'is_active' => 'boolean',
        ];
    }

    #[Scope]
    protected function active(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public static function current(): ?static
    {
        /** @var static|null $session */
        $session = static::query()->active()->first();

        return $session;
    }

    /**
     * Mark this session active and deactivate all others.
     */
    public function activate(): void
    {
        static::query()
            ->whereKeyNot($this->getKey())
            ->where('is_active', true)
            ->update(['is_active' => false]);

        $this->forceFill(['is_active' => true])->save();
    }
}
