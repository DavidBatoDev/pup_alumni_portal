<?php
// server/routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AlumniController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\DiscussionController;
use App\Http\Controllers\VerificationController;
use App\Mail\TestEmail;


// Authentication routes for alumni
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('jwt.verify');
Route::post('/refresh-token', [AuthController::class, 'refreshToken']);


// Admin authentication routes
Route::post('admin/login', [AdminAuthController::class, 'login']);
Route::post('admin/register', [AdminAuthController::class, 'register']);
Route::post('admin/logout', [AdminAuthController::class, 'logout'])->middleware('jwt.verify');

// Route to list event/s
Route::get('/events', [EventController::class, 'getEvents']);
// Route to get inactive events
Route::get('/events/inactive', [EventController::class, 'getInactiveEvents']);
Route::get('/events/{eventId}', [EventController::class, 'getEventDetails']);

// route to check if there's an account already registered with the email or student number
Route::post('/check-alumni', [AuthController::class, 'checkAlumni']);

// route for fetching graduates from the db:
Route::get('/graduates/search', [AuthController::class, 'searchGraduate']);

// route for forgot password
Route::post('/forgot-password', [AuthController::class, 'sendResetLink']);

// Route to show the reset password form 
Route::get('/reset-password/{token}', [AuthController::class, 'verifyResetToken']);

// Route to reset password
Route::post('/reset-password/{token}', [AuthController::class, 'resetPassword']);

// Route to send verification email
Route::post('/send-verification-email', [VerificationController::class, 'sendVerificationEmail']);


// Route to verify email
Route::get('/verify-email', [VerificationController::class, 'verifyEmail']);

// route to check the verification is successful
Route::get('/graduates/check-verification', [VerificationController::class, 'checkVerification']);

// Protected alumni routes (Require JWT Authentication)
Route::group(['middleware' => ['jwt.verify']], function () {
    // route for refreshin the token 
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);

    Route::get('/profile', [AlumniController::class, 'profile']);
    Route::post('/update-profile', [AlumniController::class, 'updateProfile']);

    // Route to get notifications for the authenticated alumni
    Route::get('/notifications', [AlumniController::class, 'getNotifications'])->middleware('jwt.verify');


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

    // Check if the user is registered for an event
    Route::get('/event/{eventId}/details-with-status', [EventController::class, 'getEventDetailsWithStatus']);  

    // Route to submit feedback for an event
    Route::post('/event/{eventId}/feedback', [EventController::class, 'submitFeedback']);

    // Route to fetch all events that the alumni has registered for
    Route::get('/surveys', [SurveyController::class, 'getAllSurveys']);

    // Route to fetch all surveys that the alumni has not yet answered
    Route::get('survey/unanswered-surveys', [SurveyController::class, 'getUnansweredSurveys']);

    // Route to fetch all surveys that the alumni has answered
    Route::get('survey/answered-surveys', [SurveyController::class, 'getAnsweredSurveys']);

    // Route to fetch all events that the alumni has registered for
    Route::get('/event/{eventId}', [EventController::class, 'getEventDetails']);

     // Get all alumni except the authenticated user
    Route::get('/alumni', [AlumniController::class, 'getAllAlumniExceptSelf']);

    // Get a specific alumni with their employment and education history
    Route::get('/alumni/{id}', [AlumniController::class, 'getSpecificAlumni']);

    // Create a new thread
    Route::post('/threads', [DiscussionController::class, 'createThread']);

    // Route to get all discussions
    Route::get('/threads', [DiscussionController::class, 'getThreads']);

    // Route to get a specific discussion
    Route::get('/threads/{id}', [DiscussionController::class, 'getThread']);

    // Update a thread
    Route::put('/threads/{id}', [DiscussionController::class, 'updateThread']);

    // Delete a thread
    Route::delete('/threads/{id}', [DiscussionController::class, 'deleteThread']);

    // Add a comment to a thread
    Route::post('/threads/{threadId}/comment', [DiscussionController::class, 'addComment']);

    // Vote on a thread
    Route::post('/threads/{threadId}/vote', [DiscussionController::class, 'voteThread']);

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

    // Admin-specific route to end an event
    Route::put('/admin/event/{eventId}/end', [EventController::class, 'endEvent']);


    // Admin-specific route to get registered alumni for a specific event
    Route::get('/admin/event/{eventId}/registered-alumni', [EventController::class, 'getRegisteredAlumniForEvent']);
});

