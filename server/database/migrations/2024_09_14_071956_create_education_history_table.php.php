<?php

// database/migrations/xxxx_xx_xx_create_education_history_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEducationHistoryTable extends Migration
{
    public function up()
    {
        Schema::create('education_history', function (Blueprint $table) {
            $table->id('education_id');
            
            // Use unsignedBigInteger and reference alumni_id, not id
            $table->unsignedBigInteger('alumni_id');
            $table->foreign('alumni_id')->references('alumni_id')->on('alumni')->onDelete('cascade');
            
            $table->string('institution');
            $table->string('degree');
            $table->string('field_of_study');
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('education_history');
    }
}
