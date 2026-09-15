<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SetCurrentTenantFromSession
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null) {
            return $next($request);
        }

        $tenantId = $request->session()->get('current_tenant_id') ?? $user->tenant_id;

        if ($tenantId === null) {
            Auth::logout();

            return redirect($request->getScheme().'://auth.'.config('app.base_domain'));
        }

        $tenant = Tenant::query()->find($tenantId);

        if ($tenant === null) {
            Auth::logout();
            $request->session()->forget('current_tenant_id');

            return redirect($request->getScheme().'://auth.'.config('app.base_domain'));
        }

        $tenant->makeCurrent();
        $request->session()->put('current_tenant_id', $tenant->id);

        return $next($request);
    }
}
