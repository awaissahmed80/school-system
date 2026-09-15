<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['web','auth'])->group(function() {        
    // Route::domain('auth'.env('APP_BASE_DOMAIN'))->group(function () {    
        // Log::debug('home', [env('APP_BASE_DOMAIN')]);
        Route::inertia('/', 'login')->name('login');
        Route::inertia('/forgot-password', 'forgot-password')->name('login');

        // Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        // ->name('password.request');

    // });    
});

Route::fallback(function () {
    throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException();
});

?>