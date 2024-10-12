<?php

// File: /app/Models/EventPhoto.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventPhoto extends Model
{
    use HasFactory;

    protected $table = 'event_photos';
    protected $primaryKey = 'photo_id';

    protected $fillable = ['event_id', 'photo_path'];

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }
}
