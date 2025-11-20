<?php

use App\Http\Controllers\ActivityLogController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::redirect('log', '/log/index');

    Route::resource('log', ActivityLogController::class)
        ->only(['index', 'show'])
        ->middleware('permission:log.view|log.show');
});
