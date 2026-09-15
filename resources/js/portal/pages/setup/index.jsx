import { memo, useEffect, useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { withHookFormMask } from 'use-mask-input';
import SetupLayout from '@/layouts/setup.layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectEmpty,
    SelectFilter,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

const STEPS = [
    {
        id: 'profile',
        title: 'School profile',
        description: 'Tell us how your school should appear across the portal.',
    },
    {
        id: 'calendar',
        title: 'Working calendar',
        description: 'Set the days and hours your campus normally runs.',
    },
    {
        id: 'session',
        title: 'Academic session',
        description: 'Create the active academic year for classes and reports.',
    },
    {
        id: 'review',
        title: 'Review & finish',
        description: 'Confirm the details, then open your school dashboard.',
    },
];

const WEEK_DAY_LABELS = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
};

function StepRail({ currentStep }) {
    return (
        <ol className="mb-10 grid gap-3 sm:grid-cols-4">
            {STEPS.map((step, index) => {
                const active = index === currentStep;
                const done = index < currentStep;

                return (
                    <li
                        key={step.id}
                        className={cn(
                            'rounded-lg border px-3 py-3 transition-colors',
                            active
                                ? 'border-primary/40 bg-primary/5'
                                : done
                                  ? 'border-border bg-card'
                                  : 'border-transparent bg-muted/40',
                        )}
                    >
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            Step {index + 1}
                        </p>
                        <p
                            className={cn(
                                'mt-1 text-sm font-semibold',
                                active
                                    ? 'text-foreground'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {step.title}
                        </p>
                    </li>
                );
            })}
        </ol>
    );
}

function FieldSelect({
    label,
    required = false,
    value,
    onValueChange,
    placeholder,
    items,
    filterPlaceholder = 'Filter…',
}) {
    const [query, setQuery] = useState('');

    const filteredItems = useMemo(() => {
        const needle = query.trim().toLowerCase();

        if (!needle) {
            return items;
        }

        return items.filter((item) => {
            const haystack = `${item.label} ${item.value} ${item.offset ?? ''}`
                .toLowerCase();

            return haystack.includes(needle);
        });
    }, [items, query]);

    return (
        <div>
            {label && (
                <Label className="mb-0.5 flex flex-row items-center text-base text-muted-foreground">
                    {label}
                    {required && (
                        <span className="text-sm text-destructive">*</span>
                    )}
                </Label>
            )}
            <Select
                value={value ?? null}
                onValueChange={onValueChange}
                onOpenChange={(open) => {
                    if (!open) {
                        setQuery('');
                    }
                }}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                    <SelectFilter
                        value={query}
                        onValueChange={setQuery}
                        placeholder={filterPlaceholder}
                        autoFocus
                    />
                    {filteredItems.length === 0 ? (
                        <SelectEmpty />
                    ) : (
                        <SelectList>
                            {filteredItems.map((item) => (
                                <SelectItem
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectList>
                    )}
                </SelectContent>
            </Select>
        </div>
    );
}

function SchoolSetupForm({
    defaults,
    weekDays,
    options,
    currentStep = 0,
}) {
    const [step, setStep] = useState(currentStep);
    const [loading, setLoading] = useState(false);
    const { handleSubmit, register, watch, setValue, reset } = useForm({
        defaultValues: defaults,
    });

    useEffect(() => {
        setStep(currentStep);
    }, [currentStep]);

    useEffect(() => {
        reset(defaults);
    }, [defaults, reset]);

    const workingDays = watch('working_days') ?? [];
    const displayName = watch('display_name');
    const timezone = watch('timezone');
    const currency = watch('currency');
    const country = watch('country');
    const sessionName = watch('session_name');
    const sessionStartsOn = watch('session_starts_on');
    const sessionEndsOn = watch('session_ends_on');

    const dayOptions = useMemo(
        () => weekDays ?? Object.keys(WEEK_DAY_LABELS),
        [weekDays],
    );

    const timezoneOptions = options?.timezones ?? [];
    const currencyOptions = options?.currencies ?? [];
    const countryOptions = options?.countries ?? [];

    const updateField = (name) => (value) => {
        setValue(name, value, { shouldDirty: true });
    };

    const toggleWorkingDay = (day) => {
        const next = workingDays.includes(day)
            ? workingDays.filter((value) => value !== day)
            : [...workingDays, day];

        setValue('working_days', next, { shouldDirty: true });
    };

    const goBack = () => setStep((current) => Math.max(current - 1, 0));

    const payloadForStep = (data) => {
        const stepId = STEPS[step].id;

        if (stepId === 'profile') {
            return {
                step: stepId,
                display_name: data.display_name,
                email: data.email,
                phone: data.phone,
                address_line_1: data.address_line_1,
                address_line_2: data.address_line_2,
                city: data.city,
                region: data.region,
                postal_code: data.postal_code,
                country: data.country,
                timezone: data.timezone,
                locale: data.locale,
                currency: data.currency,
            };
        }

        if (stepId === 'calendar') {
            return {
                step: stepId,
                working_days: data.working_days,
                first_day_of_week: data.first_day_of_week,
                day_starts_at: data.day_starts_at,
                day_ends_at: data.day_ends_at,
            };
        }

        if (stepId === 'session') {
            return {
                step: stepId,
                session_name: data.session_name,
                session_code: data.session_code,
                session_starts_on: data.session_starts_on,
                session_ends_on: data.session_ends_on,
            };
        }

        return { step: stepId };
    };

    const onSubmit = (data) => {
        setLoading(true);

        router.post('/setup', payloadForStep(data), {
            preserveScroll: true,
            onFinish: () => {
                setLoading(false);
            },
            onError: (errors) => {
                const message =
                    errors?.step ||
                    errors?.display_name ||
                    errors?.timezone ||
                    errors?.working_days ||
                    errors?.day_starts_at ||
                    errors?.day_ends_at ||
                    errors?.session_name ||
                    errors?.session_ends_on ||
                    errors?.message ||
                    'Could not save this step. Please check the form.';
                toast.error(message);
            },
        });
    };

    const current = STEPS[step];
    const isLastStep = step === STEPS.length - 1;

    return (
        <>
            <Head title="Set up your school" />

            <StepRail currentStep={step} />

            <div className="mb-8">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    {current.title}
                </h1>
                <p className="mt-2 max-w-2xl text-base text-muted-foreground">
                    {current.description}
                </p>
            </div>

            <form
                className="flex flex-1 flex-col"
                onSubmit={handleSubmit(onSubmit)}
            >
                {step === 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Input
                                label="School name"
                                required
                                placeholder="Axiom Grammar School"
                                {...register('display_name')}
                            />
                        </div>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="office@school.edu.pk"
                            {...withHookFormMask(register('email'), 'email')}
                        />
                        <Input
                            label="Phone"
                            type="tel"
                            placeholder="+92 300 1234567"
                            {...withHookFormMask(
                                register('phone'),
                                '+92 999 9999999',
                            )}
                        />
                        <div className="sm:col-span-2">
                            <Input
                                label="Address line 1"
                                placeholder="12 School Road"
                                {...register('address_line_1')}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Input
                                label="Address line 2"
                                placeholder="Near main market"
                                {...register('address_line_2')}
                            />
                        </div>
                        <Input
                            label="City"
                            placeholder="Lahore"
                            {...register('city')}
                        />
                        <Input
                            label="Province / region"
                            placeholder="Punjab"
                            {...register('region')}
                        />
                        <Input
                            label="Postal code"
                            placeholder="54000"
                            {...register('postal_code')}
                        />
                        <FieldSelect
                            label="Country"
                            required
                            value={country}
                            onValueChange={updateField('country')}
                            placeholder="Select country"
                            filterPlaceholder="Filter countries…"
                            items={countryOptions}
                        />
                        <FieldSelect
                            label="Timezone"
                            required
                            value={timezone}
                            onValueChange={updateField('timezone')}
                            placeholder="Select timezone"
                            filterPlaceholder="Filter timezones…"
                            items={timezoneOptions}
                        />
                        <FieldSelect
                            label="Currency"
                            required
                            value={currency}
                            onValueChange={updateField('currency')}
                            placeholder="Select currency"
                            filterPlaceholder="Filter currencies…"
                            items={currencyOptions}
                        />
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <p className="mb-3 text-sm font-medium text-muted-foreground">
                                Working days
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {dayOptions.map((day) => {
                                    const checked = workingDays.includes(day);

                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() =>
                                                toggleWorkingDay(day)
                                            }
                                            className={cn(
                                                'rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                                                checked
                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                    : 'border-border bg-card text-foreground hover:bg-accent',
                                            )}
                                        >
                                            {WEEK_DAY_LABELS[day] ?? day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                label="Day starts at"
                                type="time"
                                {...register('day_starts_at')}
                            />
                            <Input
                                label="Day ends at"
                                type="time"
                                {...register('day_ends_at')}
                            />
                        </div>

                        <Checkbox
                            checked={watch('first_day_of_week') === 1}
                            onCheckedChange={(checked) =>
                                setValue(
                                    'first_day_of_week',
                                    checked ? 1 : 0,
                                    { shouldDirty: true },
                                )
                            }
                        >
                            Use Monday as the first day of the week (uncheck for
                            Sunday).
                        </Checkbox>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Input
                                label="Session name"
                                required
                                placeholder="2026-2027"
                                {...register('session_name')}
                            />
                        </div>
                        <Input
                            label="Session code"
                            placeholder="2026"
                            {...register('session_code')}
                        />
                        <div className="hidden sm:block" />
                        <Input
                            label="Starts on"
                            type="date"
                            required
                            {...register('session_starts_on')}
                        />
                        <Input
                            label="Ends on"
                            type="date"
                            required
                            {...register('session_ends_on')}
                        />
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 rounded-xl border border-border bg-card/60 p-5">
                        <div>
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                School
                            </p>
                            <p className="mt-1 text-lg font-semibold text-foreground">
                                {displayName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {timezone} · {currency} · {country}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Working days
                            </p>
                            <p className="mt-1 text-sm text-foreground">
                                {workingDays
                                    .map(
                                        (day) =>
                                            WEEK_DAY_LABELS[day] ?? day,
                                    )
                                    .join(', ')}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Academic session
                            </p>
                            <p className="mt-1 text-sm text-foreground">
                                {sessionName} · {sessionStartsOn} →{' '}
                                {sessionEndsOn}
                            </p>
                        </div>
                    </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 pt-10">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={step === 0 || loading}
                        onClick={goBack}
                    >
                        Back
                    </Button>

                    <Button type="submit" loading={loading}>
                        {isLastStep ? 'Finish setup' : 'Save & continue'}
                    </Button>
                </div>
            </form>
        </>
    );
}

const SchoolSetup = memo(SchoolSetupForm);

SchoolSetup.layout = (page) => <SetupLayout children={page} />;

export default SchoolSetup;
