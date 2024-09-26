<?php
// server/app/Http/Controllers/SurveyController.php
namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\SurveyQuestion;
use App\Models\SurveyOption;
use Illuminate\Http\Request;

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
}
