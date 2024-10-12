<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventPhotosTable extends Migration
{
    public function up()
    {
        Schema::create('event_photos', function (Blueprint $table) {
            $table->id('photo_id');
            $table->unsignedBigInteger('event_id');
            $table->string('photo_path'); // store the path to the image
            $table->timestamps();

            // Foreign key constraint to link with events
            $table->foreign('event_id')->references('event_id')->on('events')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('event_photos');
    }
}

