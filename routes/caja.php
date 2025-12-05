<?php

use App\Http\Controllers\PagosController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
 
    Route::redirect('caja', '/caja/index');
    Route::resource('caja', PagosController::class)
        ->only(['create', 'store'])
        ->middleware('permission:caja.create');

        Route::resource('caja', PagosController::class)
        ->only(['index'])
        ->middleware('permission:caja.view|caja.create|caja.edit|caja.delete');
});