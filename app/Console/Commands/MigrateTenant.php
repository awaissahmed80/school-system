<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Throwable;

#[Signature('tenant:migrate {db : Tenant database name} {--fresh : Drop all tables and re-run migrations} {--seed : Seed after migrating}')]
#[Description('Create the tenant database if needed, then run tenant migrations')]
class MigrateTenant extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $dbName = $this->argument('db');

        if (! preg_match('/^[A-Za-z0-9_]+$/', $dbName)) {
            $this->error('Invalid database name. Use only letters, numbers, and underscores.');

            return self::FAILURE;
        }

        $this->configureTenantConnection(database: null);

        try {
            $charset = config('database.connections.tenant.charset', 'utf8mb4');
            $collation = config('database.connections.tenant.collation', 'utf8mb4_unicode_ci');

            DB::connection('tenant')->statement(
                "CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET {$charset} COLLATE {$collation}"
            );
            $this->info("Database ready: {$dbName}");
        } catch (Throwable $exception) {
            $this->error("Failed to create database `{$dbName}`: {$exception->getMessage()}");

            return self::FAILURE;
        }

        $this->configureTenantConnection(database: $dbName);

        $migrateParams = [
            '--database' => 'tenant',
            '--path' => 'database/migrations/tenant',
            '--force' => true,
        ];

        if ($this->option('fresh')) {
            $this->call('migrate:fresh', $migrateParams);
        } else {
            $this->call('migrate', $migrateParams);
        }

        if ($this->option('seed')) {
            $this->call('db:seed', [
                '--database' => 'tenant',
                '--force' => true,
            ]);
        }

        $this->info("Migration complete for {$dbName}");

        return self::SUCCESS;
    }

    private function configureTenantConnection(?string $database): void
    {
        $connection = config('database.connections.tenant');
        $connection['database'] = $database;

        Config::set('database.connections.tenant', $connection);

        DB::purge('tenant');
        DB::reconnect('tenant');
    }
}
