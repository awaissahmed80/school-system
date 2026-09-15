<?php

use App\Enums\UserStatus;
use App\Enums\UserType;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

beforeEach(function () {
    config([
        'app.base_domain' => 'school-system.test',
        'database.connections.landlord' => [
            'driver' => 'sqlite',
            'database' => ':memory:',
            'prefix' => '',
            'foreign_key_constraints' => true,
        ],
    ]);

    DB::purge('landlord');
    DB::reconnect('landlord');

    $this->artisan('migrate', [
        '--database' => 'landlord',
        '--path' => 'database/migrations/landlord',
        '--force' => true,
    ]);
});

function createSchoolOwner(array $overrides = []): User
{
    $tenant = Tenant::query()->create([
        'name' => 'Axiom School',
        'identifier' => 'axiom-'.Str::random(6),
        'database' => 'axiom_school_test',
        'status' => 'ACTIVE',
        'secret_key' => Str::random(32),
        'public_key' => Str::random(32),
        'api_key' => Str::random(32),
    ]);

    return User::query()->create(array_merge([
        'first_name' => 'School',
        'last_name' => 'Owner',
        'email_address' => 'owner@axiom.test',
        'password' => Hash::make('password'),
        'user_type' => UserType::SchoolOwner,
        'tenant_id' => $tenant->id,
        'status' => UserStatus::Active,
        'email_verified_at' => now(),
    ], $overrides));
}

test('school owner can log in and is redirected to the portal', function () {
    createSchoolOwner();

    $response = $this
        ->withServerVariables([
            'HTTP_HOST' => 'auth.school-system.test',
            'SERVER_NAME' => 'auth.school-system.test',
        ])
        ->post('http://auth.school-system.test/auth', [
            'email_address' => 'owner@axiom.test',
            'password' => 'password',
            'remember' => false,
        ]);

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('login', false)
        ->where('status', 'authenticated')
        ->where('redirect', 'http://portal.school-system.test'));

    $this->assertAuthenticated();
    expect(session('current_tenant_id'))->not->toBeNull();
});

test('login fails with invalid credentials', function () {
    createSchoolOwner();

    $response = $this
        ->from('http://auth.school-system.test/')
        ->withServerVariables([
            'HTTP_HOST' => 'auth.school-system.test',
            'SERVER_NAME' => 'auth.school-system.test',
        ])
        ->post('http://auth.school-system.test/auth', [
            'email_address' => 'owner@axiom.test',
            'password' => 'wrong-password',
        ]);

    $response->assertSessionHasErrors(['message', 'email_address']);
    $this->assertGuest();
});

test('guests are redirected from the portal to the auth site', function () {
    $response = $this
        ->withServerVariables([
            'HTTP_HOST' => 'portal.school-system.test',
            'SERVER_NAME' => 'portal.school-system.test',
            'HTTPS' => 'off',
        ])
        ->get('http://portal.school-system.test/');

    $response->assertRedirect('http://auth.school-system.test');
});
