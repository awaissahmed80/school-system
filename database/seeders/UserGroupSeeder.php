<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\UserGroup;

class UserGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        UserGroup::create(['name' => 'ADMIN', 'description' => 'School Administrator']);
        UserGroup::create(['name' => 'TEACHER', 'description' => 'Teacher']);
        UserGroup::create(['name' => 'STUDENT', 'description' => 'Student']);
        UserGroup::create(['name' => 'STAFF', 'description' => 'Non-Academic Staff']);
        UserGroup::create(['name' => 'GUARDIAN', 'description' => 'Parent / Guardian']);        
    }
}
