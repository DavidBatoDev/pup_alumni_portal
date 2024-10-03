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
    public function createSurvey(Request $request)
    {
        $survey = Survey::create([
            'title' => $request->title,
            'description' => $request->description,
            'creation_date' => now(),
            'start_date' => $request->start_date,
            'end_date' => $request->end_date
        ]);

        return response()->json($survey, 201);
    }

    public function addQuestion(Request $request, $surveyId)
    {
        $question = SurveyQuestion::create([
            'survey_id' => $surveyId,
            'question_text' => $request->question_text,
            'question_type' => $request->question_type,
        ]);

        return response()->json($question, 201);
    }

    public function addOption(Request $request, $questionId)
    {
        $option = SurveyOption::create([
            'question_id' => $questionId,
            'option_text' => $request->option_text,
            'option_value' => $request->option_value,
        ]);

        return response()->json($option, 201);
    }

    ///////////////////////////////Editing Surveys////////////////////////////////////
    /**
     * Edit a survey question.
     * If the question type is changed to 'open-ended', delete all associated options.
     *
     * @param Request $request
     * @param int $questionId
     * @return \Illuminate\Http\JsonResponse
     */
    public function editQuestion(Request $request, $questionId)
    {
        // Find the question by ID
        $question = SurveyQuestion::find($questionId);

        // If question not found, return an error
        if (!$question) {
            return response()->json(['error' => 'Question not found'], 404);
        }

        // Update the question text
        $question->question_text = $request->input('question_text', $question->question_text);

        // If question type changes to 'Open-ended', delete all associated options
        if ($request->has('question_type') && $request->question_type === 'Open-ended') {
            // Delete options associated with the question
            SurveyOption::where('question_id', $questionId)->delete();
        }

        // Update the question type
        $question->question_type = $request->input('question_type', $question->question_type);

        // Save the changes
        $question->save();

        return response()->json(['message' => 'Question updated successfully', 'question' => $question], 200);
    }

    /**
     * Edit a specific option for a question.
     *
     * @param Request $request
     * @param int $optionId
     * @return \Illuminate\Http\JsonResponse
     */
    public function editOption(Request $request, $optionId)
    {
        // Find the option by ID
        $option = SurveyOption::find($optionId);

        // If option not found, return an error
        if (!$option) {
            return response()->json(['error' => 'Option not found'], 404);
        }

        // Update the option text and value
        $option->option_text = $request->input('option_text', $option->option_text);
        $option->option_value = $request->input('option_value', $option->option_value);

        // Save the changes
        $option->save();

        return response()->json(['message' => 'Option updated successfully', 'option' => $option], 200);
    }

    ///////////////////////////////Deleting Question & Option////////////////////////////////////
    /**
     * Delete a specific question by its ID.
     *
     * @param int $questionId
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteQuestion($questionId)
    {
        // Find the question by ID
        $question = SurveyQuestion::find($questionId);
    
        // Check if the question exists
        if (!$question) {
            return response()->json(['error' => 'Question not found'], 404);
        }
    
        // If the question type is 'Multiple Choice', delete all associated options
        if ($question->question_type === 'Multiple Choice') {
            SurveyOption::where('question_id', $questionId)->delete();
        }
    
        // Delete the question itself
        $question->delete();
    
        return response()->json(['message' => 'Question deleted successfully'], 200);
    }

    /**
     * Delete a specific option by its ID.
     *
     * @param int $optionId
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteOption($optionId)
    {
        // Find the option by ID
        $option = SurveyOption::find($optionId);

        // Check if the option exists
        if (!$option) {
            return response()->json(['error' => 'Option not found'], 404);
        }

        // Delete the option
        $option->delete();

        return response()->json(['message' => 'Option deleted successfully'], 200);
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

        return response()->json($survey->questions, 200);
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
