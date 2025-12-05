<?php

use App\Http\Controllers\PagosController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::redirect('pagos', '/pagos/index');
  

    Route::resource('pagos', PagosController::class)
        ->only(['create', 'store'])
        ->middleware('permission:pagos.create');

    Route::resource('pagos', PagosController::class)
        ->only(['edit', 'update'])
        ->middleware('permission:pagos.edit');

    Route::resource('pagos', PagosController::class)
        ->only(['destroy'])
        ->middleware('permission:pagos.delete');

    Route::resource('pagos', PagosController::class)
        ->only(['index', 'show'])
        ->middleware('permission:pagos.view|pagos.create|pagos.edit|pagos.delete');
});