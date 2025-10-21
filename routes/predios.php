<?php
use App\Http\Controllers\PrediosController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('predios', '/predios/index');

    Route::middleware('permission:predios.import')->group(function () {
        Route::get('/predios/import', function () {
            return Inertia::render('Predios/Import');
        })->name('predios.import');

        Route::post('/importar-predios', [PrediosController::class, 'importar'])->name('predios.importar');
    });

    Route::get('/predios/export', [PrediosController::class, 'export'])
        ->name('predios.exportar')
        ->middleware('permission:predios.export');

    Route::resource('predios', PrediosController::class)
        ->only(['create', 'store'])
        ->middleware('permission:predios.create');

    Route::resource('predios', PrediosController::class)
        ->only(['edit', 'update'])
        ->middleware('permission:predios.edit');

    Route::resource('predios', PrediosController::class)
        ->only(['destroy'])
        ->middleware('permission:predios.delete');
 
    Route::resource('predios', PrediosController::class)
        ->only(['index', 'show']) 
        ->middleware('permission:predios.view|predios.create|predios.edit|predios.delete');
});