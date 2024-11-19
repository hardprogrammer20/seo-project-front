<?php

use Illuminate\Support\Facades\Route;
# Include Google Auth Controller:
use App\Http\Controllers\Auth\GoogleController;
# Include Performance Score Controller:
use App\Http\Controllers\SEO\PerformanceScore;

# When user send GET request to main Welcoming Page::
Route::get('/', function () {
    $user = request()->user();
    return response()->json([
        'status' => 'success',
        'data' => $user,
        'cookie' => Cookie::get("Laravel"),
        'message' => 'User data retrieved successfully',
    ]);
})->middleware('auth:sanctum');

# When User is not authenticated to the API system:
Route::get('login', function(){
    return response()->json([
        "status" => 500,
        "error" => "User is not authenticated"
    ], 500); 
})->name('login');

# Google Login
Route::get('google/redirect', [GoogleController::class, 'openTheGoogle']);
Route::get('google/callback', [GoogleController::class, 'googleCallback']);

# Route for learning the performance score of the website:
Route::get("seo/performance-score", [PerformanceScore::class, "getTheScore"])->middleware('auth:sanctum');
