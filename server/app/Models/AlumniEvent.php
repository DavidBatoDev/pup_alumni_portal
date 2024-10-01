<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlumniEvent extends Model
{
    use HasFactory;

    protected $table = 'alumni_events'; // Define the table name
    protected $primaryKey = 'alumni_event_id'; // Define the primary key

    protected $fillable = ['alumni_id', 'event_id', 'registration_date'];

    public $timestamps = true; // Use timestamps if applicable

    public function alumni()
    {
        return $this->belongsTo(Alumni::class, 'alumni_id', 'alumni_id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }
}
