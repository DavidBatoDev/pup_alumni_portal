<?php
// server/app/Http/Controllers/SurveyController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Survey; 
use App\Models\SurveyQuestion;
use App\Models\SurveyOption; 
use App\Models\FeedbackResponse; 
use App\Models\QuestionResponse; 

class SurveyController extends Controller
{
    ///////////////////////////////Creating Surveys////////////////////////////////////
    public function saveSurvey(Request $request)
    {
        try {
            // Validate the request payload
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
                'questions' => 'required|array',
                'questions.*.question_text' => 'required|string|max:255',
                'questions.*.question_type' => 'required|string|in:Multiple Choice,Open-ended',
                'questions.*.options' => 'array|required_if:questions.*.question_type,Multiple Choice',
                'questions.*.options.*.option_text' => 'required_with:questions.*.options|string|max:255',
                'questions.*.options.*.option_value' => 'nullable|integer', // Ensure option_value is an integer as per schema
            ]);
    
            // Create the survey and reference 'survey_id'
            $survey = Survey::create([
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
                'creation_date' => now(),
                'start_date' => $validatedData['start_date'],
                'end_date' => $validatedData['end_date']
            ]);
    
            // Check if the survey was successfully created and ID is valid
            if (!$survey || !$survey->survey_id) {
                return response()->json(['error' => 'Failed to create survey. Survey ID is null.'], 500);
            }
    
            // Loop through each question and create it with associated options if applicable
            foreach ($validatedData['questions'] as $questionData) {
                $question = SurveyQuestion::create([
                    'survey_id' => $survey->survey_id,  // Use $survey->survey_id as foreign key
                    'question_text' => $questionData['question_text'],
                    'question_type' => $questionData['question_type'],
                ]);
    
                // If the question type is 'Multiple Choice', add the options
                if ($questionData['question_type'] === 'Multiple Choice' && isset($questionData['options'])) {
                    foreach ($questionData['options'] as $optionData) {
                        SurveyOption::create([
                            'question_id' => $question->question_id,  // Use $question->question_id as foreign key
                            'option_text' => $optionData['option_text'],
                            'option_value' => $optionData['option_value'],  // Ensure option_value is stored as integer
                        ]);
                    }
                }
            }
    
            return response()->json(['message' => 'Survey and its details saved successfully.', 'survey' => $survey], 201);
    
        } catch (\Exception $e) {
            // Log the exception and return an error response
            \Log::error('Error in saveSurvey: ' . $e->getMessage());
    
            // Return detailed error message with stack trace for debugging (optional)
            return response()->json([
                'error' => 'An error occurred while saving the survey.',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
    

    ///////////////////////////////Deleting Surveys////////////////////////////////////
    /**
     * Delete a specific survey along with its questions and options.
     *
     * @param int $surveyId
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteSurvey($surveyId)
    {
        // Find the survey by ID
        $survey = Survey::find($surveyId);

        // Check if the survey exists
        if (!$survey) {
            return response()->json(['error' => 'Survey not found'], 404);
        }

        // Get all questions associated with the survey
        $questions = SurveyQuestion::where('survey_id', $surveyId)->get();

        // Loop through each question and delete associated options
        foreach ($questions as $question) {
            SurveyOption::where('question_id', $question->question_id)->delete();
            $question->delete(); // Delete the question itself
        }

        // Delete the survey itself
        $survey->delete();

        return response()->json(['message' => 'Survey and its associated questions and options deleted successfully'], 200);
    }


    ///////////////////////////////Fetching Surveys////////////////////////////////////

    /**
     * Get a survey along with its questions and options.
     *
     * @param int $surveyId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSurveyWithQuestions($surveyId)
    {
        // Fetch the survey by its survey_id instead of id
        $survey = Survey::with(['questions.options'])->where('survey_id', $surveyId)->first();
    
        // Check if the survey exists
        if (!$survey) {
            return response()->json(['error' => 'Survey not found'], 404);
        }
    
        // Return the survey with its associated questions and options
        return response()->json([
            'survey' => $survey->title,
            'description' => $survey->description,
            'start_date' => $survey->start_date,
            'end_date' => $survey->end_date,
            'questions' => $survey->questions->map(function ($question) {
                return [
                    'question_id' => $question->question_id,
                    'question_text' => $question->question_text,
                    'question_type' => $question->question_type,
                    'options' => $question->options->map(function ($option) {
                        return [
                            'option_id' => $option->option_id,
                            'option_text' => $option->option_text,
                            'option_value' => $option->option_value,
                        ];
                    })
                ];
            }),
        ], 200);
    }

    /**
     * Get all surveys that the authenticated alumni has not yet answered.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUnansweredSurveys()
    {
        try {
            // Get the authenticated alumni ID
            $alumniId = Auth::id();

            // Fetch all surveys that the alumni has not yet responded to
            $unansweredSurveys = Survey::whereDoesntHave('feedbackResponses', function ($query) use ($alumniId) {
                $query->where('alumni_id', $alumniId);
            })
            ->select('survey_id', 'title', 'description', 'start_date', 'end_date', 'creation_date')
            ->orderBy('creation_date', 'desc')
            ->get();

            // Check if any surveys are available
            if ($unansweredSurveys->isEmpty()) {
                return response()->json(['message' => 'No surveys available for you to answer.'], 404);
            }

            // Return the surveys list
            return response()->json([
                'success' => true,
                'surveys' => $unansweredSurveys
            ], 200);
        } catch (\Exception $e) {
            // Log the error and return a response with error details
            \Log::error('Error fetching unanswered surveys: ' . $e->getMessage());

            return response()->json(['error' => 'Failed to fetch surveys. Please try again later.'], 500);
        }
    }


    public function getAnsweredSurveys()
    {
        try {
            // Get the authenticated alumni ID
            $alumniId = Auth::id();

            // Fetch all surveys that the alumni has already responded to
            $answeredSurveys = Survey::whereHas('feedbackResponses', function ($query) use ($alumniId) {
                $query->where('alumni_id', $alumniId);
            })
            ->select('survey_id', 'title', 'description', 'start_date', 'end_date', 'creation_date')
            ->orderBy('creation_date', 'desc')
            ->get();

            // Check if any surveys are available
            if ($answeredSurveys->isEmpty()) {
                return response()->json(['message' => 'You have not answered any surveys yet.'], 404);
            }

            // Return the list of answered surveys
            return response()->json([
                'success' => true,
                'surveys' => $answeredSurveys
            ], 200);
        } catch (\Exception $e) {
            // Log the error and return a response with error details
            \Log::error('Error fetching answered surveys: ' . $e->getMessage());

            return response()->json(['error' => 'Failed to fetch answered surveys. Please try again later.'], 500);
        }
    }


    /**
     * Get all surveys created by the admin.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllSurveys()
    {
        // Fetch all surveys with basic details
        $surveys = Survey::select('survey_id', 'title', 'description', 'start_date', 'end_date', 'creation_date')
                         ->orderBy('creation_date', 'desc') // Optional: Order by creation date
                         ->get();

        // Check if any surveys are available
        if ($surveys->isEmpty()) {
            return response()->json(['message' => 'No surveys found'], 404);
        }

        // Return the surveys list
        return response()->json([
            'success' => true,
            'surveys' => $surveys
        ], 200);
    }

    ///////////////////////////////Survey Participation////////////////////////////////////

    /**
     * Get questions for a given survey.
     *
     * @param int $surveyId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSurveyQuestions($surveyId)
    {
        $survey = Survey::with('questions.options')->find($surveyId);

        if (!$survey) {
            return response()->json(['error' => 'Survey not found'], 404);
        }

        return response()->json($survey, 200);
    }

    /**
     * Submit survey response by an alumni.
     *
     * @param Request $request
     * @param int $surveyId
     * @return \Illuminate\Http\JsonResponse
     */
    public function submitSurveyResponse(Request $request, $surveyId)
    {
        $alumniId = Auth::id(); // Get the authenticated alumni ID

        // Validate the request payload
        $validatedData = $request->validate([
            'responses' => 'required|array',
            'responses.*.question_id' => 'required|exists:survey_questions,question_id',
            'responses.*.option_id' => 'nullable|exists:survey_options,option_id', // Nullable for open-ended responses
            'responses.*.response_text' => 'nullable|string' // Text response if option_id is not selected
        ]);

        // Create a feedback response record
        $feedbackResponse = FeedbackResponse::create([
            'survey_id' => $surveyId,
            'alumni_id' => $alumniId,
            'response_date' => now()
        ]);

        // Save individual question responses
        foreach ($validatedData['responses'] as $response) {
            QuestionResponse::create([
                'response_id' => $feedbackResponse->response_id,
                'question_id' => $response['question_id'],
                'option_id' => $response['option_id'] ?? null,
                'response_text' => $response['response_text'] ?? null,
            ]);
        }

        return response()->json(['message' => 'Survey responses submitted successfully.'], 201);
    }

    /**
     * Get all alumni responses for a specific survey along with their details.
     *
     * @param int $surveyId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSurveyResponses($surveyId)
    {
        // Fetch all feedback responses for the given survey along with related alumni information
        $responses = FeedbackResponse::with([
            'alumni' => function ($query) {
                // Select the appropriate fields and primary key column from the alumni table
                $query->select('alumni_id', 'email', 'first_name', 'last_name');
            },
            'questionResponses',
            'survey'
        ])
        ->where('survey_id', $surveyId) // Filter by specific survey ID
        ->get()
        ->map(function ($response) {
            return [
                'response_id' => $response->response_id,
                'survey_id' => $response->survey_id,
                'survey_title' => $response->survey->title,
                'alumni_id' => $response->alumni_id,
                'alumni_email' => $response->alumni->email,
                'alumni_first_name' => $response->alumni->first_name,
                'alumni_last_name' => $response->alumni->last_name,
                'response_date' => $response->response_date,
                'question_responses' => $response->questionResponses->map(function ($questionResponse) {
                    return [
                        'question_id' => $questionResponse->question_id,
                        'response_text' => $questionResponse->response_text,
                        'option_id' => $questionResponse->option_id,
                    ];
                }),
            ];
        });
    
        // Return the formatted response
        return response()->json(['success' => true, 'data' => $responses], 200);
    }
}
