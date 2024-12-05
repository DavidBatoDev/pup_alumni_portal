<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventFeedbackPhotosTable extends Migration
{
    public function up()
    {
        Schema::create('event_feedback_photos', function (Blueprint $table) {
            $table->id('feedback_event_photo_id'); // Auto-incrementing primary key for the photo table
            $table->unsignedBigInteger('event_feedback_id'); // Foreign key to event_feedback table
            $table->foreign('event_feedback_id')->references('event_feedback_id')->on('event_feedback')->onDelete('cascade');
            $table->string('photo_url'); // URL or file path to the photo
            $table->timestamps(); // Created_at and updated_at

            // Foreign key constraint
        });
    }

    public function down()
    {
        Schema::dropIfExists('event_feedback_photos');
    }
}
