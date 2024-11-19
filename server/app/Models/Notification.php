<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $primaryKey = 'notification_id';

    protected $fillable = [
        'type',
        'alert',
        'title',
        'message',
        'link',
    ];

    /**
     * Relationship: A notification can have many alumni linked to it.
     */
    public function alumni()
    {
        return $this->belongsToMany(Alumni::class, 'alumni_notifications', 'notification_id', 'alumni_id')
            ->withPivot('is_read', 'created_at', 'updated_at');
    }
}
