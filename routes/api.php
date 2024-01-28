<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
|
*/

/**
 * Forwards API requests
 */
Route::post('/forward-request', [\App\Http\Controllers\Application\ForwardRequestController::class, 'forward'])->middleware('withauthorization');

Route::prefix('authorization-token')->group(function () {
    Route::post('/', [\App\Http\Controllers\Application\AuthorizationTokenController::class, 'set']);
    Route::post('/check', [\App\Http\Controllers\Application\AuthorizationTokenController::class, 'check']);
});
