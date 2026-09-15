<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['web','portal'])->group(function() {        
    // Route::domain('auth'.env('APP_BASE_DOMAIN'))->group(function () {    
        // Log::debug('home', [env('APP_BASE_DOMAIN')]);
        Route::inertia('/', 'welcome')->name('dashboard');
    // });    
});


?>