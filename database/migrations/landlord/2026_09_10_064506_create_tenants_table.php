<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('code', 20)->nullable();
            $table->string('identifier')->unique();
            $table->string('database')->unique();
            $table->enum('status', ['ACTIVE','INACTIVE','BLOCKED', 'SUSPENDED'])->default('ACTIVE');
            $table->string('secret_key')->unique()->nullable();
            $table->string('public_key')->unique()->nullable();
            $table->string('api_key')->unique()->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
