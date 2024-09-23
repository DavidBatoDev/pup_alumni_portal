<?php
// app/Models/EducationHistory.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EducationHistory extends Model
{
    use HasFactory;

    // Specify the table name if it's different from the default 'education_histories'
    protected $table = 'education_history';

    // Specify the primary key as 'employment_id'
    protected $primaryKey = 'education_id';


    // Fillable fields
    protected $fillable = [
        'alumni_id', 'institution', 'degree', 'field_of_study', 'start_date', 'end_date'
    ];

    // Define relationship to Alumni model
    public function alumni()
    {
        return $this->belongsTo(Alumni::class, 'alumni_id', 'alumni_id');
    }
}
