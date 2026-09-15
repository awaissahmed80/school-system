<?php

use App\Http\Middleware\EnsureSchoolIsOnboarded;
use App\Http\Middleware\HandleAuthRequests;
use App\Http\Middleware\HandleHomeRequests;
use App\Http\Middleware\HandlePortalRequests;
use App\Http\Middleware\SetCurrentTenantFromSession;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::domain('auth.'.env('APP_BASE_DOMAIN', 'school-system.test'))
                ->middleware(['web', 'auth_site'])
                ->group(base_path('routes/auth.php'));

            Route::domain('portal.'.env('APP_BASE_DOMAIN', 'school-system.test'))
                ->middleware(['web', 'auth', 'portal'])
                ->group(base_path('routes/portal.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->group('public', [
            HandleHomeRequests::class,
        ]);

        $middleware->group('auth_site', [
            HandleAuthRequests::class,
        ]);

        $middleware->group('portal', [
            SetCurrentTenantFromSession::class,
            HandlePortalRequests::class,
            EnsureSchoolIsOnboarded::class,
        ]);

        $middleware->redirectGuestsTo(function (Request $request) {
            return $request->getScheme().'://auth.'.config('app.base_domain');
        });
    })
    // ->withExceptions(function (Exceptions $exceptions): void {
    //     $exceptions->shouldRenderJsonWhen(
    //         fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
    //     );
    // })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Record not found.',
                ], 404);
            }

            return Inertia::render('errors/not-found')->toResponse($request)->setStatusCode(404);
        });
    })->create();
