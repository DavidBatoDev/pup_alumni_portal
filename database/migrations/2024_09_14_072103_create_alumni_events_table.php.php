<?php

// database/migrations/xxxx_xx_xx_create_alumni_events_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAlumniEventsTable extends Migration
{
    public function up()
    {
        Schema::create('alumni_events', function (Blueprint $table) {
            $table->id('alumni_event_id');
            
            // Reference alumni_id in the alumni table
            $table->unsignedBigInteger('alumni_id');
            $table->foreign('alumni_id')->references('alumni_id')->on('alumni')->onDelete('cascade');
            
            // Reference event_id in the events table
            $table->unsignedBigInteger('event_id');
            $table->foreign('event_id')->references('event_id')->on('events')->onDelete('cascade');
            
            $table->date('registration_date');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('alumni_events');
    }
}
