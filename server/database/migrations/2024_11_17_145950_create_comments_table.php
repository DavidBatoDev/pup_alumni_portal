<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsTable extends Migration
{
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->unsignedBigInteger('comment_id')->autoIncrement(); // Primary key
            $table->unsignedBigInteger('thread_id'); // Foreign key for threads
            $table->foreign('thread_id')->references('thread_id')->on('threads')->onDelete('cascade'); // Correct reference
            $table->unsignedBigInteger('alumni_id'); // Foreign key for alumni
            $table->foreign('alumni_id')->references('alumni_id')->on('alumni')->onDelete('cascade'); // Correct reference
            $table->unsignedBigInteger('parent_comment_id')->nullable(); // Self-referencing for replies
            $table->foreign('parent_comment_id')->references('comment_id')->on('comments')->onDelete('cascade');
            $table->text('content');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('comments');
    }
}
