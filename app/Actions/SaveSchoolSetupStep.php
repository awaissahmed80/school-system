<?php

namespace App\Actions;

use App\Enums\SchoolSetupStep;
use App\Models\AcademicSession;
use App\Models\SchoolSetting;
use App\Models\Tenant;
use App\Support\SchoolLocaleDefaults;
use App\Support\SchoolSetupStatus;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class SaveSchoolSetupStep
{
    /**
     * Persist one onboarding step and return the step the user should see next.
     *
     * @param  array<string, mixed>  $data
     */
    public function handle(SchoolSetupStep $step, array $data): SchoolSetupStep
    {
        return match ($step) {
            SchoolSetupStep::Profile => $this->saveProfile($data),
            SchoolSetupStep::Calendar => $this->saveCalendar($data),
            SchoolSetupStep::Session => $this->saveSession($data),
            SchoolSetupStep::Review => $this->completeReview(),
        };
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function saveProfile(array $data): SchoolSetupStep
    {
        $settings = SchoolSetting::current();

        $settings->fill([
            'display_name' => $data['display_name'],
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'address_line_1' => $data['address_line_1'] ?? null,
            'address_line_2' => $data['address_line_2'] ?? null,
            'city' => $data['city'] ?? null,
            'region' => $data['region'] ?? null,
            'postal_code' => $data['postal_code'] ?? null,
            'country' => $data['country'] ?? SchoolLocaleDefaults::Country,
            'timezone' => $data['timezone'],
            'locale' => $data['locale'] ?? SchoolLocaleDefaults::Locale,
            'currency' => $data['currency'] ?? SchoolLocaleDefaults::Currency,
        ]);
        $settings->save();

        $tenant = Tenant::current();

        if ($tenant !== null && $tenant->name !== $data['display_name']) {
            $tenant->forceFill(['name' => $data['display_name']])->save();
        }

        return SchoolSetupStep::Calendar;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function saveCalendar(array $data): SchoolSetupStep
    {
        $this->ensurePriorSteps(SchoolSetupStep::Calendar);

        $settings = SchoolSetting::current();

        $settings->fill([
            'working_days' => $data['working_days'],
            'first_day_of_week' => $data['first_day_of_week'] ?? 1,
            'day_starts_at' => $data['day_starts_at'] ?? null,
            'day_ends_at' => $data['day_ends_at'] ?? null,
        ]);
        $settings->save();

        return SchoolSetupStep::Session;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function saveSession(array $data): SchoolSetupStep
    {
        $this->ensurePriorSteps(SchoolSetupStep::Session);

        $session = AcademicSession::query()->updateOrCreate(
            ['name' => $data['session_name']],
            [
                'code' => $data['session_code'] ?? null,
                'starts_on' => $data['session_starts_on'],
                'ends_on' => $data['session_ends_on'],
                'description' => null,
            ],
        );
        $session->activate();

        return SchoolSetupStep::Review;
    }

    private function completeReview(): SchoolSetupStep
    {
        $this->ensurePriorSteps(SchoolSetupStep::Review);

        $settings = SchoolSetting::current();

        if (! $settings->isOnboarded()) {
            $settings->forceFill(['onboarded_at' => now()])->save();
        }

        if (AcademicSession::current() === null) {
            throw new RuntimeException('An active academic session is required to finish setup.');
        }

        return SchoolSetupStep::Review;
    }

    private function ensurePriorSteps(SchoolSetupStep $step): void
    {
        $checklist = SchoolSetupStatus::checklist();

        $required = match ($step) {
            SchoolSetupStep::Calendar => ['profile'],
            SchoolSetupStep::Session => ['profile', 'calendar'],
            SchoolSetupStep::Review => ['profile', 'calendar', 'session'],
            SchoolSetupStep::Profile => [],
        };

        foreach ($required as $key) {
            if (! $checklist[$key]) {
                throw ValidationException::withMessages([
                    'step' => __('Please complete the previous setup steps first.'),
                ]);
            }
        }
    }
}
