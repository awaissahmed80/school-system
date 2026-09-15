<?php

namespace App\Http\Middleware;

use App\Models\AcademicSession;
use App\Models\Tenant;
use App\Support\SchoolSetupStatus;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandlePortalRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'portal';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $schoolOnboarded = Tenant::checkCurrent() && SchoolSetupStatus::isComplete();
        $currentSession = $schoolOnboarded ? AcademicSession::current() : null;

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email_address' => $user->email_address,
                    'user_type' => $user->user_type?->value ?? $user->user_type,
                ] : null,
            ],
            'school' => [
                'onboarded' => $schoolOnboarded,
            ],
            'academicSession' => [
                'current' => $currentSession ? [
                    'id' => $currentSession->id,
                    'label' => $currentSession->name,
                    'is_active' => $currentSession->is_active,
                ] : null,
                'options' => $schoolOnboarded
                    ? AcademicSession::query()
                        ->orderByDesc('starts_on')
                        ->get(['id', 'name', 'is_active'])
                        ->map(fn (AcademicSession $session) => [
                            'id' => $session->id,
                            'label' => $session->name,
                            'is_active' => $session->is_active,
                        ])
                        ->all()
                    : [],
            ],
        ];
    }
}
