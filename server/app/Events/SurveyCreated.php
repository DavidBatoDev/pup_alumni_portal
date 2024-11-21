<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use App\Models\Survey;
use App\Models\Notification;

class SurveyCreated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $survey;
    public $notification;

    public function __construct(Notification $notification, Survey $survey)
    {
        $this->survey = $survey;
        $this->notification = $notification;
    }

    public function broadcastOn()
    {
        return new Channel('alumni');
    }

    public function broadcastWith()
    {
        return [
            'notification' => $this->notification,
            'survey' => $this->survey,
        ];
    }
}
