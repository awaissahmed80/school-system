<?php

namespace App\Models;

use Spatie\Multitenancy\Models\Tenant as SpatieTenant;
use Spatie\Permission\Models\Role as SpatieRole;

/**
 * Shared role model for landlord and tenant permission tables.
 * Resolves connection from the current tenant context.
 */
class Role extends SpatieRole
{
    public function getConnectionName(): ?string
    {
        return SpatieTenant::checkCurrent() ? 'tenant' : 'landlord';
    }
}
