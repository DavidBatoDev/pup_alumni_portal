<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSurveySectionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('survey_sections', function (Blueprint $table) {
            $table->id('section_id'); // Primary Key
            $table->unsignedBigInteger('survey_id'); // Foreign Key to Survey
            $table->string('section_title');
            $table->text('section_description')->nullable();
            $table->timestamps();

            // Foreign Key Constraint to Surveys Table
            $table->foreign('survey_id')->references('survey_id')->on('surveys')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('survey_sections');
    }
}
