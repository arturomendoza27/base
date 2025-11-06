<?php
use App\Http\Controllers\CiclosController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::redirect('ciclos', '/ciclos/index');

    Route::resource('ciclos', CiclosController::class)
        ->only(['create', 'store'])
        ->middleware('permission:facturacion.create');

    Route::resource('ciclos', CiclosController::class)
        ->only(['edit', 'update'])
        ->middleware('permission:facturacion.edit');

    Route::resource('ciclos', CiclosController::class)
        ->only(['destroy'])
        ->middleware('permission:facturacion.delete');

    Route::resource('ciclos', CiclosController::class)
        ->only(['index', 'show'])
        ->middleware('permission:facturacion.view|facturacion.create|facturacion.edit|facturacion.delete');
});