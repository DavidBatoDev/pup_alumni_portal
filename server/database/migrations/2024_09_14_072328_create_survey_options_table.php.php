<?php

// database/migrations/xxxx_xx_xx_create_survey_options_table.ph
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSurveyOptionsTable extends Migration
{
    public function up()
    {
        Schema::create('survey_options', function (Blueprint $table) {
            $table->id('option_id');
            // $table->foreignId('question_id')->constrained('survey_questions')->onDelete('cascade');
            $table->unsignedBigInteger('question_id'); 
            $table->foreign('question_id')->references('question_id')->on('survey_questions')->onDelete('cascade');

            $table->string('option_text');
            $table->integer('option_value')->nullable(); // For ratings or scoring
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('survey_options');
    }
}