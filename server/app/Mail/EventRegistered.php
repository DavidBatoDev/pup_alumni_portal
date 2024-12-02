<?php

namespace App\Mail;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EventRegistered extends Mailable
{
    use Queueable, SerializesModels;

    public $event;

    /**
     * Create a new message instance.
     *
     * @param  Event  $event
     * @return void
     */
    public function __construct(Event $event)
    {
        $this->event = $event;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('You\'ve successfully registered for an event!')
                    // Use the view method to send the HTML content
                    ->view('emails.event_registered') // Your Blade view will be interpreted as HTML
                    ->with([
                        'eventName' => $this->event->event_name,
                        'eventDescription' => $this->event->description,
                        'eventDate' => $this->event->event_date,
                        'eventLocation' => $this->event->location,
                    ]);
    }
}

