<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSurveyQuestionsTable extends Migration
{
    public function up()
    {
        Schema::create('survey_questions', function (Blueprint $table) {
            $table->id('question_id');
            
            // Correctly reference survey_id in surveys table
            $table->unsignedBigInteger('survey_id'); 
            $table->foreign('survey_id')->references('survey_id')->on('surveys')->onDelete('cascade');

            $table->text('question_text');
            $table->string('question_type'); // "Multiple Choice", "Open-ended", "Rating", etc.
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('survey_questions');
    }
}
