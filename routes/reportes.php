<?php

use App\Http\Controllers\ReportesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    // API para reportes
    Route::prefix('api')->group(function () {
        // Reporte de Facturación
        Route::get('reportes/facturacion', [ReportesController::class, 'facturacion'])
            ->name('api.reportes.facturacion')
            ->middleware('permission:reportes.view');
        
        // Reporte de Pagos / Recaudo
        Route::get('reportes/pagos', [ReportesController::class, 'pagos'])
            ->name('api.reportes.pagos')
            ->middleware('permission:reportes.view');
        
        // Reporte de Cartera Vencida
        Route::get('reportes/cartera-vencida', [ReportesController::class, 'carteraVencida'])
            ->name('api.reportes.cartera-vencida')
            ->middleware('permission:reportes.view');
        
        // Reporte de Caja
        Route::get('reportes/caja', [ReportesController::class, 'caja'])
            ->name('api.reportes.caja')
            ->middleware('permission:reportes.view');
        
        // Reporte de Suspendidos
        Route::get('reportes/suspendidos', [ReportesController::class, 'suspendidos'])
            ->name('api.reportes.suspendidos')
            ->middleware('permission:reportes.view');
        
        // Reporte de Desconectados
        Route::get('reportes/desconectados', [ReportesController::class, 'desconectados'])
            ->name('api.reportes.desconectados')
            ->middleware('permission:reportes.view');
        
        // Exportar reportes
        Route::post('reportes/exportar', [ReportesController::class, 'exportarPdf'])
            ->name('api.reportes.exportar')
            ->middleware('permission:reportes.export');
    });

    // Vistas para reportes
    Route::prefix('reportes')->group(function () {
        // Página principal de reportes
        Route::get('/', function () {
            return Inertia::render('Reportes/Index');
        })->name('reportes.index')->middleware('permission:reportes.view');
        
        // Páginas individuales de reportes
        Route::get('facturacion', function () {
            return Inertia::render('Reportes/Facturacion');
        })->name('reportes.facturacion')->middleware('permission:reportes.view');
        
        Route::get('pagos', function () {
            return Inertia::render('Reportes/Pagos');
        })->name('reportes.pagos')->middleware('permission:reportes.view');
        
        Route::get('cartera-vencida', function () {
            return Inertia::render('Reportes/CarteraVencida');
        })->name('reportes.cartera-vencida')->middleware('permission:reportes.view');
        
        Route::get('caja', function () {
            return Inertia::render('Reportes/Caja');
        })->name('reportes.caja')->middleware('permission:reportes.view');
        
        Route::get('suspendidos', function () {
            return Inertia::render('Reportes/Suspendidos');
        })->name('reportes.suspendidos')->middleware('permission:reportes.view');
        
        Route::get('desconectados', function () {
            return Inertia::render('Reportes/Desconectados');
        })->name('reportes.desconectados')->middleware('permission:reportes.view');
    });
});
