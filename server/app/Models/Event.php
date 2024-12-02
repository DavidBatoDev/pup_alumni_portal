<?php
// File: /app/Models/Event.php
// File: /app/Models/Event.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $table = 'events';
    protected $primaryKey = 'event_id';

    protected $fillable = [
        'event_name', 'event_date', 'location', 'type', 'category', 
        'organization', 'description', 'is_active'
    ];

    public $timestamps = true;

    public function alumniEvents()
    {
        return $this->hasMany(AlumniEvent::class, 'event_id', 'event_id');
    }

    public function photos()
    {
        return $this->hasMany(EventPhoto::class, 'event_id', 'event_id');
    }

    public function postEventPhotos()
    {
        return $this->hasMany(PostEventPhoto::class, 'event_id', 'event_id');
    }

    
}

