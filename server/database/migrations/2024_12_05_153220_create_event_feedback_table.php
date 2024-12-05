<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventFeedbackTable extends Migration
{
    public function up()
    {
        Schema::create('event_feedback', function (Blueprint $table) {
            $table->id('event_feedback_id'); // Auto-incrementing primary key
            $table->unsignedBigInteger('event_id'); // Foreign key to events table
            $table->foreign('event_id')->references('event_id')->on('events')->onDelete('cascade');
            $table->unsignedBigInteger('alumni_id'); // Foreign key to alumni table
            $table->foreign('alumni_id')->references('alumni_id')->on('alumni')->onDelete('cascade');
            $table->text('feedback_text'); // Feedback field
            $table->timestamps(); // Created_at and updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('event_feedback');
    }
}
