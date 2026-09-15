<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class AuthenticatedSessionController extends Controller
{
    public function create(Request $request): Response|SymfonyResponse
    {
        if ($request->user()) {
            return Inertia::location($this->portalUrl($request));
        }

        return Inertia::render('login', [
            'status' => null,
            'redirect' => null,
        ]);
    }

    public function store(LoginRequest $request): Response|SymfonyResponse
    {
        $user = $request->authenticate();

        $request->session()->regenerate();

        $tenant = Tenant::query()->find($user->tenant_id);

        if ($tenant === null) {
            Auth::logout();

            return back()->withErrors([
                'message' => __('Your school could not be found.'),
            ]);
        }

        $tenant->makeCurrent();
        $request->session()->put('current_tenant_id', $tenant->id);

        $portalUrl = $this->portalUrl($request);

        return Inertia::render('login', [
            'status' => 'authenticated',
            'redirect' => $portalUrl,
        ]);
    }

    public function destroy(Request $request): SymfonyResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Tenant::forgetCurrent();

        return Inertia::location($this->authUrl($request));
    }

    private function portalUrl(Request $request): string
    {
        $baseDomain = config('app.base_domain');

        return $request->getScheme().'://portal.'.$baseDomain;
    }

    private function authUrl(Request $request): string
    {
        $baseDomain = config('app.base_domain');

        return $request->getScheme().'://auth.'.$baseDomain;
    }
}
