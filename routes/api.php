<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AlumniController;

// Authentication routes
Route::post('login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');

// Protected routes (Require JWT Authentication)
Route::group(['middleware' => ['auth:api']], function () {
    Route::get('/profile', [AlumniController::class, 'profile']);
    Route::post('/update-profile', [AlumniController::class, 'updateProfile']);
});
