<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateThreadImagesTable extends Migration
{
    public function up()
    {
        Schema::create('thread_images', function (Blueprint $table) {
            $table->id('tread_image_id');
            $table->unsignedBigInteger('thread_id');
            $table->foreign('thread_id')->references('thread_id')->on('threads')->onDelete('cascade');
            $table->string('image_path');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('thread_images');
    }
}
