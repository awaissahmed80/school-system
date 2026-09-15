<?php

namespace App\Http\Requests\School;

use App\Enums\SchoolSetupStep;
use App\Models\SchoolSetting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveSchoolSetupStepRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function step(): SchoolSetupStep
    {
        return SchoolSetupStep::from((string) $this->input('step'));
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $step = $this->input('step');

        return match ($step) {
            SchoolSetupStep::Profile->value => [
                'step' => ['required', Rule::enum(SchoolSetupStep::class)],
                'display_name' => ['required', 'string', 'max:255'],
                'email' => ['nullable', 'email', 'max:255'],
                'phone' => ['nullable', 'string', 'max:50'],
                'address_line_1' => ['nullable', 'string', 'max:255'],
                'address_line_2' => ['nullable', 'string', 'max:255'],
                'city' => ['nullable', 'string', 'max:120'],
                'region' => ['nullable', 'string', 'max:120'],
                'postal_code' => ['nullable', 'string', 'max:30'],
                'country' => ['nullable', 'string', 'size:2'],
                'timezone' => ['required', 'timezone:all'],
                'locale' => ['nullable', 'string', 'max:20'],
                'currency' => ['nullable', 'string', 'size:3'],
            ],
            SchoolSetupStep::Calendar->value => [
                'step' => ['required', Rule::enum(SchoolSetupStep::class)],
                'working_days' => ['required', 'array', 'min:1'],
                'working_days.*' => ['required', 'string', Rule::in([
                    'monday',
                    'tuesday',
                    'wednesday',
                    'thursday',
                    'friday',
                    'saturday',
                    'sunday',
                ])],
                'first_day_of_week' => ['nullable', 'integer', 'between:0,6'],
                'day_starts_at' => ['required', 'date_format:H:i'],
                'day_ends_at' => ['required', 'date_format:H:i', 'after:day_starts_at'],
            ],
            SchoolSetupStep::Session->value => [
                'step' => ['required', Rule::enum(SchoolSetupStep::class)],
                'session_name' => ['required', 'string', 'max:100'],
                'session_code' => ['nullable', 'string', 'max:50'],
                'session_starts_on' => ['required', 'date'],
                'session_ends_on' => ['required', 'date', 'after:session_starts_on'],
            ],
            SchoolSetupStep::Review->value => [
                'step' => ['required', Rule::enum(SchoolSetupStep::class)],
            ],
            default => [
                'step' => ['required', Rule::enum(SchoolSetupStep::class)],
            ],
        };
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'working_days.required' => __('Select at least one working day.'),
            'working_days.min' => __('Select at least one working day.'),
            'session_ends_on.after' => __('The academic session must end after it starts.'),
            'day_ends_at.after' => __('The school day must end after it starts.'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function stepData(): array
    {
        return $this->safe()->except(['step']);
    }

    protected function prepareForValidation(): void
    {
        if ($this->input('step') === SchoolSetupStep::Calendar->value && $this->missing('working_days')) {
            $this->merge([
                'working_days' => SchoolSetting::DefaultWorkingDays,
            ]);
        }

        if ($this->filled('country')) {
            $this->merge([
                'country' => strtoupper((string) $this->input('country')),
            ]);
        }

        if ($this->filled('currency')) {
            $this->merge([
                'currency' => strtoupper((string) $this->input('currency')),
            ]);
        }
    }
}
