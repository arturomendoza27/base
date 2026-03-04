<?php

use App\Http\Controllers\BackupController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Rutas de respaldos - solo para administradores
    Route::middleware('permission:backups.manage')->group(function () {
        Route::get('backups', [BackupController::class, 'index'])
            ->name('backups.index');
            
        Route::post('backups/generate', [BackupController::class, 'generate'])
            ->name('backups.generate');
            
        Route::get('backups/download', [BackupController::class, 'download'])
            ->name('backups.download');
    });
});