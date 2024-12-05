<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventFeedbackPhoto extends Model
{
    use HasFactory;

    // Define the table name (optional, Laravel automatically guesses the table name)
    protected $table = 'event_feedback_photos';

    // Define the primary key if it's not the default 'id'
    protected $primaryKey = 'feedback_event_photo_id';

    // Define fillable columns (adjust according to your needs)
    protected $fillable = [
        'event_feedback_id',
        'photo_url',
    ];

    // Define the relationship with the EventFeedback model (belongs to relationship)
    public function eventFeedback()
    {
        return $this->belongsTo(EventFeedback::class, 'event_feedback_id', 'event_feedback_id');
    }
}
