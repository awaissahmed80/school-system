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
        Schema::create('school_settings', function (Blueprint $table) {
            $table->id();
            $table->string('display_name')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('address_line_1')->nullable();
            $table->string('address_line_2')->nullable();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
            $table->string('postal_code', 30)->nullable();
            $table->string('country', 2)->nullable()->default('PK');
            $table->string('timezone', 64)->default('Asia/Karachi');
            $table->string('locale', 20)->default('en');
            $table->string('currency', 3)->default('PKR');
            $table->json('working_days')->nullable();
            $table->unsignedTinyInteger('first_day_of_week')->default(1);
            $table->time('day_starts_at')->nullable();
            $table->time('day_ends_at')->nullable();
            $table->timestamp('onboarded_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_settings');
    }
};
