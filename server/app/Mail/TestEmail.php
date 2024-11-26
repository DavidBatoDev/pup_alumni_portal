<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TestEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $data; // Add a public variable to pass data to the email.

    /**
     * Create a new message instance.
     *
     * @param array $data
     */
    public function __construct($data = [])
    {
        $this->data = $data; // Assign data to the class property.
    }

    /**
     * Build the email message.
     */
    public function build()
    {
        $name = $this->data['name'] ?? 'User';
        $message = $this->data['message'] ?? 'This is a test email sent from Laravel without a view.';

        $htmlContent = "
            <html>
                <head>
                    <title>Test Email</title>
                </head>
                <body>
                    <h1>Hello, {$name}!</h1>
                    <p>{$message}</p>
                </body>
            </html>
        ";

        return $this->subject('Test Email Without View')
                    ->html($htmlContent);
    }
}
