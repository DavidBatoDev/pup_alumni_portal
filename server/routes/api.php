<?php
// app/Http/Controllers/AuthController.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AlumniController;
use App\Http\Controllers\AdminAuthController;

// Authentication routes for alumni
Route::post('login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');

// Admin authentication routes
Route::post('admin/login', [AdminAuthController::class, 'login']);
Route::post('admin/register', [AdminAuthController::class, 'register']);
Route::post('admin/logout', [AdminAuthController::class, 'logout'])->middleware('auth:api');

// Protected alumni routes (Require JWT Authentication)
Route::group(['middleware' => ['auth:api']], function () {
    Route::get('/profile', [AlumniController::class, 'profile']);
    Route::post('/update-profile', [AlumniController::class, 'updateProfile']);

    // Routes for managing employment and education history
    Route::post('/add-employment-history', [AlumniController::class, 'addEmploymentHistory']);
    Route::put('/update-employment-history/{id}', [AlumniController::class, 'updateEmploymentHistory']);
    Route::post('/add-education-history', [AlumniController::class, 'addEducationHistory']);
    Route::put('/update-education-history/{id}', [AlumniController::class, 'updateEducationHistory']);

    // Routes for managing multiple addresses
    Route::post('/add-address', [AlumniController::class, 'addAddress']);
    Route::put('/update-address/{id}', [AlumniController::class, 'updateAddress']);
});

// Protected admin routes (Require JWT Authentication for admin)
// You can define admin-specific routes here that only admin users can access.
Route::group(['middleware' => ['auth:api']], function () {
    // Example admin routes:
    Route::get('/admin/dashboard', function () {
        return response()->json(['message' => 'Welcome to the admin dashboard']);
    });
});
