<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventFeedbackTable extends Migration
{
    public function up()
    {
        Schema::create('event_feedback', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('event_id');
            $table->unsignedBigInteger('alumni_id');
            $table->text('feedback');
            $table->timestamps();

            $table->foreign('event_id')->references('event_id')->on('events')->onDelete('cascade');
            $table->foreign('alumni_id')->references('alumni_id')->on('alumni')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('event_feedback');
    }
}
