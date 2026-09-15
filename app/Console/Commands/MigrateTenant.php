<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use App\Models\Tenant;

#[Signature('tenant:migrate {db} {--fresh} {--seed}')]
#[Description('Run migrations for tenant database')]
class MigrateTenant extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $dbName = $this->argument('db');

        $this->info("Migrating tenant DB: {$dbName}");
        
        Config::set('database.connections.tenant', [
            'driver' => 'mysql',
            'host' => env('DB_DEFAULT_HOST', '127.0.0.1'),
            'port' => env('DB_DEFAULT_PORT', '3306'),
            'database' => $dbName,
            'username' => env('DB_DEFAULT_USERNAME'),
            'password' => env('DB_DEFAULT_PASSWORD'),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
            'engine' => null,
        ]);

        DB::purge('tenant');
        DB::reconnect('tenant');

        $params = ['--database' => 'tenant'];

        if ($this->option('fresh')) {
            $this->call('migrate:fresh', $params);
        } else {
            // $this->call('migrate', $params);
            $this->call('migrate', [
                '--database' => 'tenant',
                '--path' => '/database/migrations/tenant', // NOTE: relative to base_path
            ]);
        }

        if ($this->option('seed')) {
            $this->call('db:seed', $params);
        }

        $this->info("✅ Migration complete for {$dbName}");
    }
}
