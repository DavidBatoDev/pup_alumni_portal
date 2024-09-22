<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('alumni', function (Blueprint $table) {
            $table->string('password')->nullable(false)->change(); // Remove NULL and set NOT NULL
        });
    }
    
    public function down()
    {
        Schema::table('alumni', function (Blueprint $table) {
            $table->string('password')->nullable()->change(); // Revert to allow NULL (if needed)
        });
    }
};
