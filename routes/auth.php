<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

Route::get('/', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/auth', [AuthenticatedSessionController::class, 'store'])->name('login.store');
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

Route::inertia('/forgot-password', 'forgot-password')->name('password.request');

Route::fallback(function () {
    throw new NotFoundHttpException;
});
