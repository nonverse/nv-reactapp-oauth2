<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::view('/{path?}', 'app')
    ->where('path', '.*');

/**
 * Initialise application
 */
Route::post('/initialize', [\App\Http\Controllers\Application\ApiController::class, 'initialize']);

/**
 * Logout user from application
 */
Route::post('/logout', [\App\Http\Controllers\UserController::class, 'logout']);
