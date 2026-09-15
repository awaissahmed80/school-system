<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;
use App\Models\Tenant;

#[Signature('make:tenant 
        {--name= : Tenant name}
        {--database= : Database name}
        {--identifier= : unique identifier}
        {--admin_email=admin@example.com : Admin email}
        {--admin_password=password : Admin password}')]
#[Description('Create a new tenant with DB, user, and dummy data')]
class MakeTenant extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $name = $this->option('name');
        $dbName = $this->option('database');
        $identifier = $this->option('identifier');
        $email = $this->option('admin_email');
        $password = $this->option('admin_password');

        if (!$name || !$dbName || !$subdomain) {
            $this->error("❌ Missing required options: --name, --database, --identifier");
            return 1;
        }

        $this->info("🚧 Creating new tenant: $name ($identifier.$dbName)");

        // Step 1: Add tenant to landlord DB
        $tenant = Tenant::create([
            'name' => $name,
            'database' => $dbName,
            'identifier' => $identifier,
        ]);

        $tenant_user = $tenant->users()->create([
            'display_name' => $name .' Admin',
            'email_address' => $email,
            'password' => bcrypt($password),
            'tenant_id' => $tenant->id,
            'status' => 'ACTIVE',
        ]);

        $this->info("✅ Tenant created in landlord DB");

        // Step 2: Create tenant DB (MySQL only)
        DB::statement("CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $this->info("✅ Tenant database created: $dbName");

        // Step 3: Configure tenant DB connection
        Config::set('database.connections.tenant', [
            'driver' => 'mysql',
            'host' => env('DB_DEFAULT_HOST', '127.0.0.1'),
            'port' => env('DB_DEFAULT_PORT', '3306'),
            'database' => $dbName,
            'username' => env('DB_DEFAULT_USERNAME'),
            'password' => env('DB_DEFAULT_PASSWORD'),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
        ]);

        DB::purge('tenant');
        DB::reconnect('tenant');

        // Step 4: Run tenant migrations from custom path
        $this->info("🚀 Running migrations...");

        Artisan::call('migrate', [
            '--database' => 'tenant',
            '--path' => '/database/migrations/tenant',
            '--force' => true,
        ]);
        $this->info(Artisan::output());
        // Step 5: Create main tenant user

        if (Schema::connection('tenant')->hasTable('tenant_users')) {
            DB::connection('tenant')->table('tenant_users')->insert([
                'first_name'    => $name,
                'last_name'     => 'Admin',
                'title'         => 'Administrator',
                'super_admin'   => 1,
                'tenant_id'     => $tenant_user->id,
                'status'        => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $this->info("✅ Main tenant user created: $email");
        } else {
            $this->error("❌ 'users' table not found. Make sure the migration was correct.");
        }

        config(['seeder.tenant_id' => $tenant->id]);
        // Step 6: Run dummy seeders (optional)
        $this->info("🌱 Running dummy seeders...");
        Artisan::call('db:seed', [
            '--database' => 'tenant',
            '--class' => 'TenantDataSeeder',
            '--force' => true,
        ]);
        $this->info(Artisan::output());

        $this->info("🎉 Tenant setup complete!");
        return 0;

    }
}
