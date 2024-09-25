<?php
// server/app/Models/SurveyOption.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyOption extends Model
{
    use HasFactory;

    protected $primaryKey = 'option_id'; // Define the primary key

    protected $fillable = ['question_id', 'option_text', 'option_value'];

    public function questionResponses()
    {
        return $this->hasMany(QuestionResponse::class, 'option_id');
    }
}
