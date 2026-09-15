<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use App\Models\Tenant;

#[Signature('landlord:migrate {--fresh} {--seed}')]
#[Description('Run migrations for landlord database')]
class MigrateLandlord extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        

        $this->info("Migrating landlord DB");
             

        DB::purge('landlord');
        DB::reconnect('landlord');

        $params = ['--database' => 'tenant'];

        if ($this->option('fresh')) {
            $this->call('migrate:fresh', $params);
        } else {
            // $this->call('migrate', $params);
            $this->call('migrate', [
                '--database' => 'landlord',
                '--path' => '/database/migrations/landlord', // NOTE: relative to base_path
            ]);
        }

        if ($this->option('seed')) {
            $this->call('db:seed', $params);
        }

        $this->info("✅ Migration complete for Landlord");
    }
}
