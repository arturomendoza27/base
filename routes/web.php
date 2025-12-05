<?php

use App\Http\Controllers\ClienteController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Users routes with permissions
    Route::resource('users', UserController::class)
        ->only(['create', 'store'])
        ->middleware('permission:users.create');

    Route::resource('users', UserController::class)
        ->only(['edit', 'update'])
        ->middleware('permission:users.edit');

    Route::resource('users', UserController::class)
        ->only(['destroy'])
        ->middleware('permission:users.delete');

    Route::resource('users', UserController::class)
        ->only(['index', 'show'])
        ->middleware('permission:users.view|users.create|users.edit|users.delete');

    // Roles routes with permissions
    Route::resource('roles', RoleController::class)
        ->only(['create', 'store'])
        ->middleware('permission:roles.create');

    Route::resource('roles', RoleController::class)
        ->only(['edit', 'update'])
        ->middleware('permission:roles.edit');

    Route::resource('roles', RoleController::class)
        ->only(['destroy'])
        ->middleware('permission:roles.delete');

    Route::resource('roles', RoleController::class)
        ->only(['index', 'show'])
        ->middleware('permission:roles.view|roles.create|roles.edit|roles.delete');

 
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/clientes.php';
require __DIR__ . '/tarifas.php';
require __DIR__ . '/predios.php';
require __DIR__ . '/ciclos.php';
require __DIR__ . '/facturacion.php';
require __DIR__ . '/pagos.php';
require __DIR__ . '/caja.php';
require __DIR__ . '/logs.php';
