<?php
// app/Http/Controllers/AuthController.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AlumniController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\SurveyController;

// Authentication routes for alumni
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('jwt.verify');

// Admin authentication routes
Route::post('admin/login', [AdminAuthController::class, 'login']);
Route::post('admin/register', [AdminAuthController::class, 'register']);
Route::post('admin/logout', [AdminAuthController::class, 'logout'])->middleware('jwt.verify');

// Protected alumni routes (Require JWT Authentication)
Route::group(['middleware' => ['jwt.verify']], function () {
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
Route::group(['middleware' => ['jwt.verify']], function () {
    // Admin-specific routes
    Route::post('/admin/survey', [SurveyController::class, 'createSurvey']);
    Route::post('/admin/survey/{surveyId}/question', [SurveyController::class, 'addQuestion']);
    Route::post('/admin/question/{questionId}/option', [SurveyController::class, 'addOption']);

    // Routes to edit a question or option
    Route::put('/admin/question/{questionId}', [SurveyController::class, 'editQuestion']);
    Route::put('/admin/option/{optionId}', [SurveyController::class, 'editOption']); 

    // Fetch surveys and related data
    Route::get('/admin/survey/{surveyId}', [SurveyController::class, 'getSurveyWithQuestions']);
    Route::get('/admin/surveys', [SurveyController::class, 'getAllSurveys']);
});

