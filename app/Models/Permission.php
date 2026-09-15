<?php

namespace App\Models;

use Spatie\Multitenancy\Models\Tenant as SpatieTenant;
use Spatie\Permission\Models\Permission as SpatiePermission;

/**
 * Shared permission model for landlord and tenant permission tables.
 * Resolves connection from the current tenant context.
 */
class Permission extends SpatiePermission
{
    public function getConnectionName(): ?string
    {
        return SpatieTenant::checkCurrent() ? 'tenant' : 'landlord';
    }
}
