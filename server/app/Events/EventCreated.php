<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use App\Models\Event;
use App\Models\Notification;

class EventCreated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $event;
    public $notification;

    public function __construct(Notification $notification, Event $event,)
    {
        $this->event = $event;
        $this->notification = $notification;
    }

    public function broadcastOn()
    {
        return new Channel('alumni');
    }

    public function broadcastWith()
    {
        return [
            // 'notification' => [
            //     'notification_id' => $this->notification->notification_id,
            //     'type' => $this->notification->type,
            //     'alert' =>  $this->notification->alert,
            //     'title' => $this->notification->title,
            //     'message' => $this->notification->message,
            //     'link' => $this->notification->link,
            // ]

            "notification" => $this->notification,
            'events' => $this->event

        ];
    }
}
