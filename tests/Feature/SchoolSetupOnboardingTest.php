<?php

use App\Enums\UserStatus;
use App\Enums\UserType;
use App\Models\AcademicSession;
use App\Models\SchoolSetting;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

beforeEach(function () {
    $tenantDatabase = database_path('testing-tenant-'.Str::random(8).'.sqlite');
    touch($tenantDatabase);

    config([
        'app.base_domain' => 'school-system.test',
        'database.connections.landlord' => [
            'driver' => 'sqlite',
            'database' => ':memory:',
            'prefix' => '',
            'foreign_key_constraints' => true,
        ],
        'database.connections.tenant' => [
            'driver' => 'sqlite',
            'database' => $tenantDatabase,
            'prefix' => '',
            'foreign_key_constraints' => true,
        ],
    ]);

    DB::purge('landlord');
    DB::reconnect('landlord');
    DB::purge('tenant');
    DB::reconnect('tenant');

    $this->artisan('migrate', [
        '--database' => 'landlord',
        '--path' => 'database/migrations/landlord',
        '--force' => true,
    ]);

    $this->artisan('migrate', [
        '--database' => 'tenant',
        '--path' => 'database/migrations/tenant',
        '--force' => true,
    ]);

    $this->tenantDatabase = $tenantDatabase;

    $this->tenant = Tenant::query()->create([
        'name' => 'Axiom School',
        'identifier' => 'axiom-'.Str::random(6),
        'database' => $tenantDatabase,
        'status' => 'ACTIVE',
        'secret_key' => Str::random(32),
        'public_key' => Str::random(32),
        'api_key' => Str::random(32),
    ]);

    $this->user = User::query()->create([
        'first_name' => 'School',
        'last_name' => 'Owner',
        'email_address' => 'owner@axiom.test',
        'password' => Hash::make('password'),
        'user_type' => UserType::SchoolOwner,
        'tenant_id' => $this->tenant->id,
        'status' => UserStatus::Active,
        'email_verified_at' => now(),
    ]);
});

afterEach(function () {
    Tenant::forgetCurrent();

    if (isset($this->tenantDatabase) && file_exists($this->tenantDatabase)) {
        @unlink($this->tenantDatabase);
    }
});

function actingAsPortalOwner(): mixed
{
    test()->tenant->makeCurrent();

    return test()
        ->actingAs(test()->user)
        ->withSession(['current_tenant_id' => test()->tenant->id])
        ->withServerVariables([
            'HTTP_HOST' => 'portal.school-system.test',
            'SERVER_NAME' => 'portal.school-system.test',
            'HTTPS' => 'off',
        ]);
}

test('uninitialized school is redirected from the dashboard to setup', function () {
    $response = actingAsPortalOwner()->get('http://portal.school-system.test/');

    $response->assertRedirect(route('setup.show'));
});

test('setup screen is available when the school is not onboarded', function () {
    $response = actingAsPortalOwner()->get('http://portal.school-system.test/setup');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('setup/index', false)
        ->has('defaults')
        ->where('defaults.timezone', 'Asia/Karachi')
        ->where('defaults.currency', 'PKR')
        ->where('defaults.country', 'PK')
        ->where('currentStep', 0)
        ->has('options.timezones')
        ->has('options.currencies')
        ->missing('options.locales')
        ->where('options.timezones.0.value', 'Asia/Karachi')
        ->where('options.timezones.0.offset', '+5')
        ->where('checklist.complete', false));
});

test('each setup step is validated, saved, and advances to the next step', function () {
    $profile = actingAsPortalOwner()->post('http://portal.school-system.test/setup', [
        'step' => 'profile',
        'display_name' => 'Axiom Grammar School',
        'email' => 'office@axiom.test',
        'phone' => '+92 300 1234567',
        'address_line_1' => '12 School Road',
        'city' => 'Lahore',
        'region' => 'Punjab',
        'postal_code' => '54000',
        'country' => 'PK',
        'timezone' => 'Asia/Karachi',
        'locale' => 'en',
        'currency' => 'PKR',
    ]);

    $profile->assertRedirect(route('setup.show', ['step' => 1]));

    test()->tenant->makeCurrent();
    $settings = SchoolSetting::query()->first();
    expect($settings)->not->toBeNull()
        ->and($settings->display_name)->toBe('Axiom Grammar School')
        ->and($settings->isOnboarded())->toBeFalse()
        ->and($settings->day_starts_at)->toBeNull();

    $calendar = actingAsPortalOwner()->post('http://portal.school-system.test/setup', [
        'step' => 'calendar',
        'working_days' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        'first_day_of_week' => 1,
        'day_starts_at' => '08:00',
        'day_ends_at' => '14:00',
    ]);

    $calendar->assertRedirect(route('setup.show', ['step' => 2]));

    test()->tenant->makeCurrent();
    $settings = SchoolSetting::query()->first();
    expect($settings->working_days)->toBe(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])
        ->and($settings->isOnboarded())->toBeFalse();

    $session = actingAsPortalOwner()->post('http://portal.school-system.test/setup', [
        'step' => 'session',
        'session_name' => '2026-2027',
        'session_code' => '2026',
        'session_starts_on' => '2026-09-01',
        'session_ends_on' => '2027-06-30',
    ]);

    $session->assertRedirect(route('setup.show', ['step' => 3]));

    test()->tenant->makeCurrent();
    $academicSession = AcademicSession::current();
    expect($academicSession)->not->toBeNull()
        ->and($academicSession->name)->toBe('2026-2027')
        ->and(SchoolSetting::query()->first()->isOnboarded())->toBeFalse();

    $review = actingAsPortalOwner()->post('http://portal.school-system.test/setup', [
        'step' => 'review',
    ]);

    $review->assertRedirect(route('dashboard'));

    test()->tenant->makeCurrent();
    expect(SchoolSetting::query()->first()->isOnboarded())->toBeTrue();

    $dashboard = actingAsPortalOwner()->get('http://portal.school-system.test/');
    $dashboard->assertOk();
    $dashboard->assertInertia(fn ($page) => $page->component('welcome', false));
});

test('profile step validation fails without a school name', function () {
    $response = actingAsPortalOwner()->post('http://portal.school-system.test/setup', [
        'step' => 'profile',
        'timezone' => 'Asia/Karachi',
        'currency' => 'PKR',
        'country' => 'PK',
    ]);

    $response->assertSessionHasErrors(['display_name']);
});

test('onboarded schools cannot revisit the setup wizard', function () {
    test()->tenant->makeCurrent();

    $settings = SchoolSetting::current();
    $settings->forceFill([
        'display_name' => 'Axiom School',
        'timezone' => 'UTC',
        'working_days' => SchoolSetting::DefaultWorkingDays,
        'day_starts_at' => '08:00:00',
        'day_ends_at' => '14:00:00',
        'onboarded_at' => now(),
    ])->save();

    AcademicSession::factory()->active()->create([
        'name' => '2026-2027',
        'starts_on' => '2026-09-01',
        'ends_on' => '2027-06-30',
    ]);

    $response = actingAsPortalOwner()->get('http://portal.school-system.test/setup');

    $response->assertRedirect(route('dashboard'));
});
