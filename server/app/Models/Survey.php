<?php
// server/app/Models/Survey.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    use HasFactory;

    protected $table = 'surveys'; // Assuming the table name is 'surveys'

    protected $primaryKey = 'survey_id'; // Set the primary key to 'survey_id'

    protected $fillable = ['title', 'description', 'creation_date', 'start_date', 'end_date'];

    public function questions()
    {
        return $this->hasMany(SurveyQuestion::class, 'survey_id');
    }

    public function feedbackResponses()
    {
        return $this->hasMany(FeedbackResponse::class, 'survey_id');
    }
}
