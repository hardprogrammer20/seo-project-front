<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

# Include Google Auth Controller:
use App\Http\Controllers\Auth\GoogleController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('google/redirect', [GoogleController::class, 'redirectToGoogle']);
Route::get('google/callback', [GoogleController::class, 'handleGoogleCallback']);
