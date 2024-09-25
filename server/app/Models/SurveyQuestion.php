<?php
// server/app/Models/SurveyOption.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyQuestion extends Model
{
    use HasFactory;

    protected $primaryKey = 'question_id'; // Define the primary key

    protected $fillable = ['survey_id', 'question_text', 'question_type'];

    public function options()
    {
        return $this->hasMany(SurveyOption::class, 'question_id');
    }

    public function questionResponses()
    {
        return $this->hasMany(QuestionResponse::class, 'question_id');
    }
}
