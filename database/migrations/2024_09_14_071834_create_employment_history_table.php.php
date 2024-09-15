<?php

// database/migrations/xxxx_xx_xx_create_employment_history_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmploymentHistoryTable extends Migration
{
    public function up()
    {
        Schema::create('employment_history', function (Blueprint $table) {
            $table->id('employment_id');
            
            // Use unsignedBigInteger and reference alumni_id, not id
            $table->unsignedBigInteger('alumni_id');
            $table->foreign('alumni_id')->references('alumni_id')->on('alumni')->onDelete('cascade');
            
            $table->string('company');
            $table->string('job_title');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('employment_history');
    }
}
