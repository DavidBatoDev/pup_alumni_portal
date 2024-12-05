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
use App\Models\SurveySection;
use App\Models\Alumni;
use App\Models\Notification;
use App\Models\AlumniNotification;
use App\Events\SurveyCreated;

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
                'sections' => 'required|array',
                'sections.*.section_title' => 'required|string|max:255',
                'sections.*.section_description' => 'nullable|string',
                'sections.*.questions' => 'required|array',
                'sections.*.questions.*.question_text' => 'required|string|max:255',
                'sections.*.questions.*.question_type' => 'required|string|in:Multiple Choice,Open-ended,Rating,Dropdown',
                'sections.*.questions.*.is_required' => 'nullable|boolean',
                'sections.*.questions.*.is_other_option' => 'nullable|boolean',
                'sections.*.questions.*.options' => 'array|required_if:sections.*.questions.*.question_type,Multiple Choice,Dropdown,Rating',
                'sections.*.questions.*.options.*.option_text' => 'required_with:sections.*.questions.*.options|string|max:255',
                'sections.*.questions.*.options.*.option_value' => 'nullable|integer',
            ]);
    
            // Create the survey
            $survey = Survey::create([
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
                'creation_date' => now(),
                'start_date' => $validatedData['start_date'],
                'end_date' => $validatedData['end_date']
            ]);
    
            foreach ($validatedData['sections'] as $sectionData) {
                $section = SurveySection::create([
                    'survey_id' => $survey->survey_id,
                    'section_title' => $sectionData['section_title'],
                    'section_description' => $sectionData['section_description']
                ]);
    
                foreach ($sectionData['questions'] as $questionData) {
                    $question = SurveyQuestion::create([
                        'survey_id' => $survey->survey_id,
                        'section_id' => $section->section_id,
                        'question_text' => $questionData['question_text'],
                        'question_type' => $questionData['question_type'],
                        'is_required' => $questionData['is_required'] ?? false,
                    ]);
    
                    // If the question has options (for Multiple Choice, Dropdown, or Rating), add them
                    if (isset($questionData['options']) && in_array($questionData['question_type'], ['Multiple Choice', 'Rating', 'Dropdown'])) {
                        foreach ($questionData['options'] as $optionData) {
                            SurveyOption::create([
                                'question_id' => $question->question_id,
                                'option_text' => $optionData['option_text'],
                                'option_value' => $optionData['option_value'],
                                'is_other_option' => false, // Default is_other_option to false for normal options
                            ]);
                        }
                    }
    
                    // Add an "Others" option if specified and if question type is Multiple Choice or Dropdown
                    if (in_array($questionData['question_type'], ['Multiple Choice', 'Dropdown']) && !empty($questionData['is_other_option'])) {
                        SurveyOption::create([
                            'question_id' => $question->question_id,
                            'option_text' => 'Others', // Text for the "Others" option
                            'option_value' => null, // No predefined value for "Others"
                            'is_other_option' => true,
                        ]);
                    }
                }
            }

            $notification = Notification::create([
                'type' => 'surveyInvitation',
                'alert' => 'SurveyInviation',
                'title' => $validatedData['title'],
                'message' => 'A new survey has been created: ' . $validatedData['title'] . '. Please participate before ' . $validatedData['end_date'],
                'link' => '/survey/' . $survey->survey_id,
            ]);
    
            // Fetch all alumni IDs
            $alumniIds = Alumni::pluck('alumni_id');
    
            // Attach the notification to all alumni
            foreach ($alumniIds as $alumniId) {
                AlumniNotification::create([
                    'alumni_id' => $alumniId,
                    'notification_id' => $notification->notification_id,
                    'is_read' => false,
                ]);
            }

            broadcast(new SurveyCreated($notification, $survey))->toOthers();
    
            return response()->json(['message' => 'Survey with sections and questions created successfully.', 'survey' => $survey], 201);
    
        } catch (\Exception $e) {
            \Log::error('Error in saveSurvey: ' . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred while creating the survey.',
                'message' => $e->getMessage()
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
 * Get a survey along with its sections, questions, and options.
 *
 * @param int $surveyId
 * @return \Illuminate\Http\JsonResponse
 */
    public function getSurveyWithQuestions($surveyId)
    {
        try {
            $survey = Survey::with(['sections.questions.options'])->where('survey_id', $surveyId)->first();

            if (!$survey) {
                return response()->json(['error' => 'Survey not found'], 404);
            }

            return response()->json([
                'survey' => $survey->title,
                'description' => $survey->description,
                'start_date' => $survey->start_date,
                'end_date' => $survey->end_date,
                'sections' => $survey->sections->map(function ($section) {
                    return [
                        'section_id' => $section->section_id,
                        'section_title' => $section->section_title,
                        'section_description' => $section->section_description,
                        'questions' => $section->questions->map(function ($question) {
                            return [
                                'question_id' => $question->question_id,
                                'question_text' => $question->question_text,
                                'question_type' => $question->question_type,
                                'is_required' => $question->is_required,
                                'options' => $question->options->map(function ($option) {
                                    return [
                                        'option_id' => $option->option_id,
                                        'option_text' => $option->option_text,
                                        'option_value' => $option->option_value,
                                        'is_other_option' => $option->is_other_option, // Include is_other_option
                                    ];
                                })
                            ];
                        }),
                    ];
                }),
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Error in getSurveyWithQuestions: ' . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred while fetching the survey details.',
                'message' => $e->getMessage()
            ], 500);
        }
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
        try {
            $survey = Survey::with(['sections.questions.options'])->where('survey_id', $surveyId)->first();

            if (!$survey) {
                return response()->json(['error' => 'Survey not found'], 404);
            }

            return response()->json([
                'survey' => $survey->title,
                'description' => $survey->description,
                'start_date' => $survey->start_date,
                'end_date' => $survey->end_date,
                'sections' => $survey->sections->map(function ($section) {
                    return [
                        'section_id' => $section->section_id,
                        'section_title' => $section->section_title,
                        'section_description' => $section->section_description,
                        'questions' => $section->questions->map(function ($question) {
                            return [
                                'question_id' => $question->question_id,
                                'question_text' => $question->question_text,
                                'question_type' => $question->question_type,
                                'is_required' => $question->is_required,
                                'options' => $question->options->map(function ($option) {
                                    return [
                                        'option_id' => $option->option_id,
                                        'option_text' => $option->option_text,
                                        'option_value' => $option->option_value,
                                        'is_other_option' => $option->is_other_option, // Include is_other_option
                                    ];
                                })
                            ];
                        }),
                    ];
                }),
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Error in getSurveyWithQuestions: ' . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred while fetching the survey details.',
                'message' => $e->getMessage()
            ], 500);
        }
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
        try {
            $alumniId = Auth::id(); // Get the authenticated alumni ID
    
            // Check if the survey exists
            $survey = Survey::with('questions')->find($surveyId);
            if (!$survey) {
                return response()->json(['error' => 'Survey not found'], 404);
            }
    
            // Check if the alumni has already responded to this survey
            $existingResponse = FeedbackResponse::where('survey_id', $surveyId)
                                                ->where('alumni_id', $alumniId)
                                                ->first();
    
            if ($existingResponse) {
                return response()->json(['error' => 'You have already submitted a response for this survey.'], 409);
            }
    
            // Get all question IDs for this survey
            $surveyQuestionIds = $survey->questions->pluck('question_id')->toArray();
    
            // Validate the request payload
            $validatedData = $request->validate([
                'responses' => 'required|array',
                'responses.*.question_id' => [
                    'required',
                    'exists:survey_questions,question_id',
                    function ($attribute, $value, $fail) use ($surveyId, $surveyQuestionIds) {
                        if (!in_array($value, $surveyQuestionIds)) {
                            $fail('The question does not belong to the specified survey.');
                        }
                    },
                ],
                'responses.*.option_id' => 'nullable|exists:survey_options,option_id',
                'responses.*.response_text' => 'nullable|string', // Text response if option_id is not selected
            ]);
    
            // Check if all questions in the survey have been answered
            $answeredQuestionIds = array_column($validatedData['responses'], 'question_id');
            $unansweredQuestions = array_diff($surveyQuestionIds, $answeredQuestionIds);
    
            if (!empty($unansweredQuestions)) {
                return response()->json(['error' => 'All questions must be answered.'], 422);
            }
    
            // Create a feedback response record
            $feedbackResponse = FeedbackResponse::create([
                'survey_id' => $surveyId,
                'alumni_id' => $alumniId,
                'response_date' => now()
            ]);
    
            // Save individual question responses
            foreach ($validatedData['responses'] as $response) {
                $optionId = $response['option_id'] ?? null;
                $responseText = $response['response_text'] ?? null;
    
                // Check if the option selected is "Others" and requires additional text input
                if ($optionId) {
                    $option = SurveyOption::find($optionId);
                    if ($option && $option->is_other_option && empty($responseText)) {
                        return response()->json([
                            'error' => 'Response text is required when selecting "Others" for question ID ' . $response['question_id']
                        ], 422);
                    }
                }
    
                QuestionResponse::create([
                    'response_id' => $feedbackResponse->response_id,
                    'question_id' => $response['question_id'],
                    'option_id' => $optionId,
                    'response_text' => $responseText,
                ]);
            }

            $expectedLink = '/survey/' . $surveyId;

            // Remove the survey notification for this alumni
            $notification = Notification::where('type', 'surveyInvitation')
                ->where('link', $expectedLink)
                ->first();

            \Log::info('Notification: ' . $notification);

            if ($notification) {
                $alumniNotification = AlumniNotification::where('alumni_id', $alumniId)
                    ->where('notification_id', $notification->notification_id)
                    ->first();

                if ($alumniNotification) {
                    $alumniNotification->update(['is_read' => true]);
                }

            } else {
                \Log::info("No matching notification found for survey ID: " . $surveyId);
            }

            return response()->json(['message' => 'Survey responses submitted successfully.'], 201);
    
        } catch (\Exception $e) {
            \Log::error('Error in submitSurveyResponse: ' . $e->getMessage());
    
            return response()->json([
                'error' => 'An error occurred while submitting the survey response.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    

    public function getSurveyResponses($surveyId)
    {
        try {
            // Fetch the survey with sections, questions, and alumni responses
            $survey = Survey::with([
                'sections.questions',  // Fetch sections with questions
                'feedbackResponses.alumni:alumni_id,email,first_name,last_name', // Fetch alumni details
                'feedbackResponses.questionResponses.surveyOption'  // Fetch question responses with options
            ])->where('survey_id', $surveyId)->first();
    
            // Check if survey exists
            if (!$survey) {
                return response()->json(['error' => 'Survey not found'], 404);
            }
    
            // Organize responses by sections and questions
            $responses = [
                'survey_id' => $survey->survey_id,
                'title' => $survey->title,
                'sections' => $survey->sections->map(function ($section) use ($survey) {
                    return [
                        'section_id' => $section->section_id,
                        'section_title' => $section->section_title,
                        'questions' => $section->questions->map(function ($question) use ($survey) {
                            return [
                                'question_id' => $question->question_id,
                                'question_text' => $question->question_text,
                                'responses' => $survey->feedbackResponses->map(function ($feedbackResponse) use ($question) {
                                    // Find the response for this specific question
                                    $questionResponse = $feedbackResponse->questionResponses
                                        ->firstWhere('question_id', $question->question_id);
    
                                    return [
                                        'alumni_id' => $feedbackResponse->alumni_id,
                                        'alumni_email' => $feedbackResponse->alumni->email,
                                        'alumni_first_name' => $feedbackResponse->alumni->first_name,
                                        'alumni_last_name' => $feedbackResponse->alumni->last_name,
                                        'response_text' => $questionResponse ? $questionResponse->response_text : null,
                                        'option_text' => optional($questionResponse->surveyOption)->option_text,
                                        'option_value' => optional($questionResponse->surveyOption)->option_value,
                                    ];
                                })
                            ];
                        })
                    ];
                })
            ];
    
            return response()->json(['success' => true, 'data' => $responses], 200);
    
        } catch (\Exception $e) {
            // Log error and return a JSON response with error message
            \Log::error('Error in getSurveyResponses: ' . $e->getMessage());
    
            return response()->json([
                'error' => 'An error occurred while fetching survey responses.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
