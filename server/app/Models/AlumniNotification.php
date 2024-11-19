<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlumniNotification extends Model
{
    use HasFactory;

    protected $primaryKey = 'alumni_notification_id';

    protected $fillable = [
        'alumni_id',
        'notification_id',
        'is_read',
    ];

    /**
     * Relationship: An alumni notification belongs to a specific alumni.
     */
    public function alumni()
    {
        return $this->belongsTo(Alumni::class, 'alumni_id', 'alumni_id');
    }

    /**
     * Relationship: An alumni notification belongs to a specific notification.
     */
    public function notification()
    {
        return $this->belongsTo(Notification::class, 'notification_id', 'notification_id');
    }
}
