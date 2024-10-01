<?php
// app/Models/FeedbackResponse.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedbackResponse extends Model
{
    use HasFactory;

    protected $primaryKey = 'response_id';

    protected $fillable = ['survey_id', 'alumni_id', 'response_date'];

    public function questionResponses()
    {
        return $this->hasMany(QuestionResponse::class, 'response_id');
    }

    public function alumni()
    {
        return $this->belongsTo(Alumni::class, 'alumni_id', 'alumni_id');
    }

    public function survey()
    {
        return $this->belongsTo(Survey::class, 'survey_id');
    }
}
