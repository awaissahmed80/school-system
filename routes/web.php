<?php

use Illuminate\Support\Facades\Route;

// Route::inertia('/', 'welcome')->name('home');

Route::middleware(['web', 'public'])->group(function() {        
    // Route::domain(env('APP_BASE_DOMAIN'))->group(function () {    
        // Log::debug('home', [env('APP_BASE_DOMAIN')]);
        Route::inertia('/', 'welcome')->name('home');
    // });    
});

// Route::middleware(['web', 'auth'])->group(function() {        
//     Route::domain(env('APP_BASE_DOMAIN', 'auth.school-system.test'))->group(function () {    
//         // Log::debug('home', [env('APP_BASE_DOMAIN')]);
//         Route::inertia('/', 'welcome')->name('login');
//     });    
// });

// Route::middleware(['web', 'portal'])->group(function() {        
//     Route::domain(env('APP_BASE_DOMAIN', 'portal.school-system.test'))->group(function () {    
//         // Log::debug('home', [env('APP_BASE_DOMAIN')]);
//         Route::inertia('/', 'welcome')->name('dashboard');
//     });    
// });
