<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateThreadsTable extends Migration
{
    public function up()
    {
        Schema::create('threads', function (Blueprint $table) {
            $table->id('thread_id');
            $table->string('title');
            $table->text('description');
            $table->unsignedBigInteger('author_id');
            $table->foreign('author_id')->references('alumni_id')->on('alumni')->onDelete('cascade');
            $table->unsignedBigInteger('views')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('threads');
    }
}
