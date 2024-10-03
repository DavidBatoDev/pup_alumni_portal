<?php

// database/migrations/xxxx_xx_xx_create_question_responses_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuestionResponsesTable extends Migration
{
    public function up()
    {
        Schema::create('question_responses', function (Blueprint $table) {
            $table->id('response_detail_id');
            
            // Explicitly reference response_id in feedback_responses table
            $table->unsignedBigInteger('response_id');
            $table->foreign('response_id')->references('response_id')->on('feedback_responses')->onDelete('cascade');

            // Explicitly reference question_id in survey_questions table
            $table->unsignedBigInteger('question_id');
            $table->foreign('question_id')->references('question_id')->on('survey_questions')->onDelete('cascade');

            // Explicitly reference option_id in survey_options table (nullable)
            $table->unsignedBigInteger('option_id')->nullable();
            $table->foreign('option_id')->references('option_id')->on('survey_options')->onDelete('cascade');

            // Optional response text
            $table->text('response_text')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('question_responses');
    }
}
