<?php
use App\Http\Controllers\TarifasController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::redirect('tarifas', '/tarifas/index');

    Route::resource('tarifas', TarifasController::class)
        ->only(['create', 'store'])
        ->middleware('permission:tarifas.create');

    Route::resource('tarifas', TarifasController::class)
        ->only(['edit', 'update'])
        ->middleware('permission:tarifas.edit');

    Route::resource('tarifas', TarifasController::class)
        ->only(['destroy'])
        ->middleware('permission:tarifas.delete');

    Route::resource('tarifas', TarifasController::class)
        ->only(['index', 'show'])
        ->middleware('permission:tarifas.view|tarifas.create|tarifas.edit|tarifas.delete');
});