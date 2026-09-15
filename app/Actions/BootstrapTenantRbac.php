<?php

namespace App\Actions;

use App\Models\Permission;
use App\Models\Role;
use App\Models\TenantUser;
use App\Support\SchoolPermissions;
use Spatie\Permission\PermissionRegistrar;

class BootstrapTenantRbac
{
    /**
     * Ensure school permissions and the school_owner super-admin role exist
     * in the current tenant database, then optionally assign the role.
     */
    public function handle(?TenantUser $tenantUser = null): Role
    {
        $guard = SchoolPermissions::schoolOwnerGuard();

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = collect(SchoolPermissions::all())
            ->map(fn (string $name) => Permission::findOrCreate($name, $guard))
            ->all();

        $role = Role::findOrCreate(SchoolPermissions::SchoolOwnerRole, $guard);
        $role->syncPermissions($permissions);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        if ($tenantUser instanceof TenantUser) {
            $tenantUser->assignRole($role);
        }

        return $role;
    }
}
