<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\SchoolSetupController;
use Illuminate\Support\Facades\Route;

Route::get('/setup', [SchoolSetupController::class, 'show'])->name('setup.show');
Route::post('/setup', [SchoolSetupController::class, 'store'])->name('setup.store');

Route::inertia('/', 'welcome')->name('dashboard');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('portal.logout');
