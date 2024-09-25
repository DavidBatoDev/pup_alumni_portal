<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionResponse extends Model
{
    use HasFactory;

    protected $fillable = ['response_id', 'question_id', 'option_id', 'response_text'];

    public function feedbackResponse()
    {
        return $this->belongsTo(FeedbackResponse::class, 'response_id');
    }

    public function surveyQuestion()
    {
        return $this->belongsTo(SurveyQuestion::class, 'question_id');
    }

    public function surveyOption()
    {
        return $this->belongsTo(SurveyOption::class, 'option_id');
    }
}
