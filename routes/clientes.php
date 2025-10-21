<?php

use App\Http\Controllers\ClienteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('clientes', '/clientes/index');
     // Clientes routes 
    //importar clientes Excel
    Route::middleware('permission:clientes.import')->group(function () {
        Route::get('/clientes/import', function () {
            return Inertia::render('Clientes/Import');
        })->name('clientes.import');

        Route::post('/importar-excel', [ClienteController::class, 'importar'])->name('clientes.importar');
    });

    Route::get('/clientes/export', [ClienteController::class, 'export'])
        ->name('clientes.exportar')
        ->middleware('permission:clientes.export');

    // Route::get('/clientes/import', function () {
    //     return Inertia::render('Clientes/Import');
    // })->name('clientes.import')->middleware('permission:clientes.import');

    // Route::get('/clientes/export', [ClienteController::class, 'export'])->name('clientes.exportar')->middleware('permission:clientes.export');
    //Route::post('/importar-excel', [ClienteController::class, 'importar'])->name('clientes.import');
    Route::resource('clientes', ClienteController::class)
        ->only(['create', 'store'])
        ->middleware('permission:clientes.create');

    Route::resource('clientes', ClienteController::class)
        ->only(['edit', 'update'])
        ->middleware('permission:clientes.edit');

    Route::resource('clientes', ClienteController::class)
        ->only(['destroy'])
        ->middleware('permission:clientes.delete');

    Route::resource('clientes', ClienteController::class)
        ->only(['index', 'show'])
        ->middleware('permission:clientes.view|clientes.create|clientes.edit|clientes.delete');
});