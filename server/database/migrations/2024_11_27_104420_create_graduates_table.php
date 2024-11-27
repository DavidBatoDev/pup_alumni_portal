<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGraduatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('graduates', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('lastname', 255);
            $table->string('firstname', 255);
            $table->string('middlename', 255)->nullable();
            $table->string('student_number', 50)->unique();
            $table->string('program', 100);
            $table->date('graduation_date');
            $table->string('email_address', 255)->unique();
            $table->string('contact_number', 20)->nullable();
            $table->timestamp('verified_at')->nullable(); // For email verification
            $table->timestamps(); // Adds `created_at` and `updated_at`
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('graduates');
    }
}
