<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFeedbackResponseTable extends Migration
{
    public function up()
    {
        Schema::create('feedback_responses', function (Blueprint $table) {
            $table->id('response_id');
            
            // Use unsignedBigInteger and reference survey_id explicitly
            $table->unsignedBigInteger('survey_id');
            $table->foreign('survey_id')->references('survey_id')->on('surveys')->onDelete('cascade');
            
            // Use unsignedBigInteger and reference alumni_id explicitly
            $table->unsignedBigInteger('alumni_id');
            $table->foreign('alumni_id')->references('alumni_id')->on('alumni')->onDelete('cascade');

            $table->date('response_date');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('feedback_responses');
    }
}
