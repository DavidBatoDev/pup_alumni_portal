<?php

// database/migrations/xxxx_xx_xx_create_alumni_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAlumniTable extends Migration
{
    public function up()
    {
        Schema::create('alumni', function (Blueprint $table) {
            // Explicitly specify the primary key as alumni_id
            $table->id('alumni_id'); 
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('password'); 
            $table->string('phone')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable();
            $table->integer('graduation_year');
            $table->string('degree')->nullable();
            $table->string('major')->nullable();
            $table->string('current_job_title')->nullable();
            $table->string('current_employer')->nullable();
            $table->string('linkedin_profile')->nullable();
            $table->string('profile_picture')->nullable()->default('default-profile.png');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('alumni');
    }
}
