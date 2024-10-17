<?php
// server/routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AlumniController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\EventController;

// Authentication routes for alumni
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('jwt.verify');


// Admin authentication routes
Route::post('admin/login', [AdminAuthController::class, 'login']);
Route::post('admin/register', [AdminAuthController::class, 'register']);
Route::post('admin/logout', [AdminAuthController::class, 'logout'])->middleware('jwt.verify');

// Route to list event/s
Route::get('/events', [EventController::class, 'getEvents']);
Route::get('/events/{eventId}', [EventController::class, 'getEventDetails']);


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

    // Routes for alumni to participate in surveys
    Route::post('/survey/{surveyId}/submit', [SurveyController::class, 'submitSurveyResponse']);
    Route::get('/survey/{surveyId}/questions', [SurveyController::class, 'getSurveyQuestions']);

    // Route to register for an event
    Route::post('/event/{eventId}/register', [EventController::class, 'registerAlumniToEvent']);

    // Route to fetch all events that the alumni has registered for
    Route::get('/surveys', [SurveyController::class, 'getAllSurveys']);

    // Route to fetch all surveys that the alumni has not yet answered
    Route::get('survey/unanswered-surveys', [SurveyController::class, 'getUnansweredSurveys']);

    // Route to fetch all surveys that the alumni has answered
     Route::get('survey/answered-surveys', [SurveyController::class, 'getAnsweredSurveys']);

     Route::get('/event/{eventId}', [EventController::class, 'getEventDetails']);

});

// Protected admin routes (Require JWT Authentication for admin)
Route::group(['middleware' => ['jwt.verify']], function () {
    // Admin-specific routes
    Route::post('/admin/save-survey', [SurveyController::class, 'saveSurvey']);

    // Fetch surveys and related data
    Route::get('/admin/survey/{surveyId}', [SurveyController::class, 'getSurveyWithQuestions']);
    Route::get('/admin/surveys', [SurveyController::class, 'getAllSurveys']);

    // Admin-specific route to get responses for a specific survey along with alumni details
    Route::get('/admin/survey/{surveyId}/responses', [SurveyController::class, 'getSurveyResponses']);

    // admin-specific route to create an event
    Route::post('/admin/event', [EventController::class, 'createEvent']);
    // Route for updating an event
    Route::post('/admin/update-event/{eventId}', [EventController::class, 'updateEvent']);
    // Route for deleting an event
    Route::delete('/admin/event/{eventId}', [EventController::class, 'deleteEvent']);

    // Admin-specific route to get registered alumni for a specific event
    Route::get('/admin/event/{eventId}/registered-alumni', [EventController::class, 'getRegisteredAlumniForEvent']);
});

