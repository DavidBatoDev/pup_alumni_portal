<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $table = 'events'; // Define the table name
    protected $primaryKey = 'event_id'; // Define the primary key

    protected $fillable = ['event_name', 'event_date', 'location', 'description'];

    public $timestamps = true; // Use timestamps (created_at, updated_at) if applicable

    public function alumniEvents()
    {
        return $this->hasMany(AlumniEvent::class, 'event_id', 'event_id');
    }
}
