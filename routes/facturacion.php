<?php

use App\Http\Controllers\ClienteController;
use App\Http\Controllers\FacturacionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('facturacion', '/facturacion/index');

   Route::get('/facturacion/facturar', [FacturacionController::class, 'facturar'])
    ->name('facturacion.index');

    Route::resource('facturacion', FacturacionController::class)
        ->only(['create', 'store'])
        ->middleware('permission:facturacion.create');

    Route::resource('facturacion', FacturacionController::class)
        ->only(['edit', 'update'])
        ->middleware('permission:facturacion.edit');

    Route::resource('facturacion', FacturacionController::class)
        ->only(['destroy'])
        ->middleware('permission:facturacion.delete');

    Route::resource('facturacion', FacturacionController::class)
        ->only(['index', 'show'])
        ->middleware('permission:facturacion.view|facturacion.create|facturacion.edit|facturacion.delete');
});
