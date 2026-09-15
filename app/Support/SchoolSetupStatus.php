<?php

namespace App\Support;

use App\Enums\SchoolSetupStep;
use App\Models\AcademicSession;
use App\Models\SchoolSetting;

class SchoolSetupStatus
{
    /**
     * A school is initialized when settings are marked onboarded
     * and an active academic session exists.
     */
    public static function isComplete(): bool
    {
        $settings = SchoolSetting::query()->first();

        if ($settings === null || ! $settings->isOnboarded()) {
            return false;
        }

        return AcademicSession::current() !== null;
    }

    /**
     * @return array{profile: bool, calendar: bool, session: bool, complete: bool}
     */
    public static function checklist(): array
    {
        $settings = SchoolSetting::query()->first();
        $hasSession = AcademicSession::query()->exists();

        return [
            'profile' => filled($settings?->display_name),
            'calendar' => filled($settings?->day_starts_at),
            'session' => $hasSession,
            'complete' => self::isComplete(),
        ];
    }

    /**
     * First incomplete wizard step (review once prior steps are saved).
     */
    public static function currentStep(): SchoolSetupStep
    {
        $checklist = self::checklist();

        if (! $checklist['profile']) {
            return SchoolSetupStep::Profile;
        }

        if (! $checklist['calendar']) {
            return SchoolSetupStep::Calendar;
        }

        if (! $checklist['session']) {
            return SchoolSetupStep::Session;
        }

        return SchoolSetupStep::Review;
    }
}
