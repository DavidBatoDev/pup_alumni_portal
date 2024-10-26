<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use App\Models\Event;

class EventCreated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $event;

    public function __construct(Event $event)
    {
        $this->event = $event;
    }

    public function broadcastOn()
    {
        return new Channel('alumni');
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->event->id,
            'name' => $this->event->event_name,
            'date' => $this->event->event_date,
            'location' => $this->event->location,
        ];
    }
}
