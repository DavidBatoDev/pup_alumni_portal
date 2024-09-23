<?php
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
    
    // Routes for updating employment and education history
    Route::post('/add-employment-history', [AlumniController::class, 'addEmploymentHistory']);
    Route::put('/update-employment-history/{id}', [AlumniController::class, 'updateEmploymentHistory']);
    Route::post('/add-education-history', [AlumniController::class, 'addEducationHistory']);
    Route::put('/update-education-history/{id}', [AlumniController::class, 'updateEducationHistory']);

    // Routes for managing multiple addresses
    Route::post('/add-address', [AlumniController::class, 'addAddress']);
    Route::put('/update-address/{id}', [AlumniController::class, 'updateAddress']);
});