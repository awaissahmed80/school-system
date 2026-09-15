<?php

namespace App\Http\Controllers;

use App\Actions\SaveSchoolSetupStep;
use App\Enums\SchoolSetupStep;
use App\Http\Requests\School\SaveSchoolSetupStepRequest;
use App\Models\AcademicSession;
use App\Models\SchoolSetting;
use App\Models\Tenant;
use App\Support\SchoolLocaleDefaults;
use App\Support\SchoolSetupStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SchoolSetupController extends Controller
{
    public function show(Request $request): Response
    {
        $settings = SchoolSetting::query()->first();
        $session = AcademicSession::current() ?? AcademicSession::query()->latest('starts_on')->first();
        $tenant = Tenant::current();
        $suggestedStep = SchoolSetupStatus::currentStep();

        $requestedStep = $request->integer('step', $suggestedStep->index());
        $step = max(0, min(3, $requestedStep));

        if ($step > $suggestedStep->index()) {
            $step = $suggestedStep->index();
        }

        return Inertia::render('setup/index', [
            'checklist' => SchoolSetupStatus::checklist(),
            'currentStep' => $step,
            'defaults' => [
                'display_name' => $settings?->display_name ?? $tenant?->name,
                'email' => $settings?->email,
                'phone' => $settings?->phone,
                'address_line_1' => $settings?->address_line_1,
                'address_line_2' => $settings?->address_line_2,
                'city' => $settings?->city,
                'region' => $settings?->region,
                'postal_code' => $settings?->postal_code,
                'country' => $settings?->country ?? SchoolLocaleDefaults::Country,
                'timezone' => $settings?->timezone ?? SchoolLocaleDefaults::Timezone,
                'locale' => $settings?->locale ?? SchoolLocaleDefaults::Locale,
                'currency' => $settings?->currency ?? SchoolLocaleDefaults::Currency,
                'working_days' => $settings?->working_days ?? SchoolSetting::DefaultWorkingDays,
                'first_day_of_week' => $settings?->first_day_of_week ?? 1,
                'day_starts_at' => $settings?->day_starts_at
                    ? substr((string) $settings->day_starts_at, 0, 5)
                    : '08:00',
                'day_ends_at' => $settings?->day_ends_at
                    ? substr((string) $settings->day_ends_at, 0, 5)
                    : '14:00',
                'session_name' => $session?->name ?? $this->suggestedSessionName(),
                'session_code' => $session?->code,
                'session_starts_on' => $session?->starts_on?->toDateString()
                    ?? now()->startOfYear()->toDateString(),
                'session_ends_on' => $session?->ends_on?->toDateString()
                    ?? now()->addYear()->endOfYear()->toDateString(),
            ],
            'options' => [
                'timezones' => SchoolLocaleDefaults::timezones(),
                'currencies' => SchoolLocaleDefaults::currencies(),
                'countries' => SchoolLocaleDefaults::countries(),
            ],
            'weekDays' => [
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday',
                'sunday',
            ],
        ]);
    }

    public function store(
        SaveSchoolSetupStepRequest $request,
        SaveSchoolSetupStep $saveSchoolSetupStep,
    ): RedirectResponse {
        $step = $request->step();
        $nextStep = $saveSchoolSetupStep->handle($step, $request->stepData());

        if ($step === SchoolSetupStep::Review) {
            return redirect()
                ->route('dashboard')
                ->with('success', __('Your school is ready. Welcome aboard.'));
        }

        return redirect()
            ->route('setup.show', ['step' => $nextStep->index()])
            ->with('success', __('Saved. Continue to the next step.'));
    }

    private function suggestedSessionName(): string
    {
        $year = (int) now()->year;

        if (now()->month >= 8) {
            return $year.'-'.($year + 1);
        }

        return ($year - 1).'-'.$year;
    }
}
