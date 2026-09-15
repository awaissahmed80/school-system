<?php

namespace App\Http\Middleware;

use App\Support\SchoolSetupStatus;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSchoolIsOnboarded
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $isSetupRoute = $request->routeIs('setup.*');
        $isLogoutRoute = $request->routeIs('portal.logout');

        if ($isLogoutRoute) {
            return $next($request);
        }

        $complete = SchoolSetupStatus::isComplete();

        if (! $complete && ! $isSetupRoute) {
            return redirect()->route('setup.show');
        }

        if ($complete && $isSetupRoute) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
