<?php
// app/Models/EmploymentHistory.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmploymentHistory extends Model
{
    use HasFactory;

    // Specify the table name if it's different from the default 'employment_histories'
    protected $table = 'employment_history';

    // Specify the primary key as 'employment_id'
    protected $primaryKey = 'employment_id';

    // Fillable fields
    protected $fillable = [
        'alumni_id', 'company', 'job_title', 'start_date', 'end_date', 'description'
    ];

    // Define relationship to Alumni model
    public function alumni()
    {
        return $this->belongsTo(Alumni::class, 'alumni_id', 'alumni_id');
    }
}
