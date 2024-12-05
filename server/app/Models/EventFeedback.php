<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventFeedback extends Model
{
    use HasFactory;

    // Define the table name (optional, Laravel automatically guesses the table name)
    protected $table = 'event_feedback';

    // Define the primary key if it's not the default 'id'
    protected $primaryKey = 'event_feedback_id';

    // Define fillable columns (adjust according to your needs)
    protected $fillable = [
        'event_id',
        'alumni_id',
        'feedback_text',
    ];

    // Define the relationship with the Event model (belongs to relationship)
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }

    // Define the relationship with the Alumni model (belongs to relationship)
    public function alumni()
    {
        return $this->belongsTo(Alumni::class, 'alumni_id', 'alumni_id');
    }

    // Define the relationship with the EventFeedbackPhoto model (has many relationship)
    public function photos()
    {
        return $this->hasMany(EventFeedbackPhoto::class, 'event_feedback_id', 'event_feedback_id');
    }
}
