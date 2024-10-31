<?php
// server/app/Models/SurveySection.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveySection extends Model
{
    use HasFactory;

    protected $primaryKey = 'section_id';

    protected $fillable = ['survey_id', 'section_title', 'section_description'];

    public function survey()
    {
        return $this->belongsTo(Survey::class, 'survey_id');
    }

    public function questions()
    {
        return $this->hasMany(SurveyQuestion::class, 'section_id');
    }
}
