<?php

namespace App\Console\Commands;

use App\Actions\BootstrapTenantRbac;
use App\Enums\UserStatus;
use App\Enums\UserType;
use App\Models\Tenant;
use App\Models\TenantUser;
use App\Models\User;
use App\Support\SchoolPermissions;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Throwable;

#[Signature('make:tenant
    {name : Tenant / school name}
    {identifier : Unique tenant identifier}
    {database : Tenant database name}
    {--admin_email= : School owner email}
    {--admin_password= : School owner password}
    {--admin_first_name=Admin : School owner first name}
    {--admin_last_name=User : School owner last name}')]
#[Description('Create a tenant record, database, run tenant migrations, and optionally create the school owner')]
class MakeTenant extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $name = (string) $this->argument('name');
        $identifier = (string) $this->argument('identifier');
        $dbName = (string) $this->argument('database');
        $adminEmail = $this->option('admin_email');
        $adminPassword = $this->option('admin_password');

        if (! preg_match('/^[A-Za-z0-9_-]+$/', $identifier)) {
            $this->error('Invalid identifier. Use only letters, numbers, underscores, and hyphens.');

            return self::FAILURE;
        }

        if (! preg_match('/^[A-Za-z0-9_]+$/', $dbName)) {
            $this->error('Invalid database name. Use only letters, numbers, and underscores.');

            return self::FAILURE;
        }

        if (Tenant::query()->where('identifier', $identifier)->orWhere('database', $dbName)->exists()) {
            $this->error('A tenant with this identifier or database name already exists.');

            return self::FAILURE;
        }

        if (filled($adminEmail) xor filled($adminPassword)) {
            $this->error('Provide both --admin_email and --admin_password, or neither.');

            return self::FAILURE;
        }

        if (filled($adminEmail) && User::query()->where('email_address', $adminEmail)->exists()) {
            $this->error("A user with email [{$adminEmail}] already exists.");

            return self::FAILURE;
        }

        $this->info("Creating tenant: {$name} ({$identifier} → {$dbName})");

        try {
            $tenant = DB::connection('landlord')->transaction(function () use ($name, $identifier, $dbName, $adminEmail, $adminPassword) {
                $tenant = Tenant::query()->create([
                    'name' => $name,
                    'identifier' => $identifier,
                    'database' => $dbName,
                    'status' => 'ACTIVE',
                    'secret_key' => Str::random(64),
                    'public_key' => Str::random(64),
                    'api_key' => Str::random(64),
                ]);

                if (filled($adminEmail) && filled($adminPassword)) {
                    User::query()->create([
                        'first_name' => (string) $this->option('admin_first_name'),
                        'last_name' => (string) $this->option('admin_last_name'),
                        'email_address' => $adminEmail,
                        'password' => $adminPassword,
                        'user_type' => UserType::SchoolOwner,
                        'tenant_id' => $tenant->id,
                        'status' => UserStatus::Active,
                        'email_verified_at' => now(),
                    ]);
                }

                return $tenant;
            });
        } catch (Throwable $exception) {
            $this->error("Failed to create landlord tenant record: {$exception->getMessage()}");

            return self::FAILURE;
        }

        $this->info("Tenant record created (id: {$tenant->id}, code: {$tenant->code}).");

        $migrateExitCode = $this->call('tenant:migrate', [
            'db' => $dbName,
        ]);

        if ($migrateExitCode !== self::SUCCESS) {
            $this->error('Tenant database migration failed. Landlord tenant record was created; fix DB issues and re-run tenant:migrate.');

            return self::FAILURE;
        }

        $tenant->makeCurrent();

        try {
            $ownerTenantUser = null;

            if (filled($adminEmail)) {
                $owner = User::query()->where('email_address', $adminEmail)->first();

                if ($owner) {
                    $ownerTenantUser = TenantUser::query()->create([
                        'landlord_user_id' => $owner->id,
                        'user_type' => UserType::SchoolOwner,
                    ]);

                    $this->info("School owner linked: {$adminEmail}");
                }
            }

            $role = app(BootstrapTenantRbac::class)->handle($ownerTenantUser);
            $permissionCount = count(SchoolPermissions::all());

            $this->info("Role [{$role->name}] ready with {$permissionCount} permissions.");
        } catch (Throwable $exception) {
            Tenant::forgetCurrent();
            $this->error("Failed to bootstrap tenant RBAC: {$exception->getMessage()}");

            return self::FAILURE;
        }

        Tenant::forgetCurrent();

        // Seeding deferred for now.
        // $this->info('Running tenant seeders...');
        // $this->call('db:seed', [
        //     '--database' => 'tenant',
        //     '--class' => 'TenantDataSeeder',
        //     '--force' => true,
        // ]);

        $this->info('Tenant setup complete.');

        return self::SUCCESS;
    }
}
