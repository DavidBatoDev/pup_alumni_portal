<?php

// database/migrations/xxxx_xx_xx_create_address_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAddressTable extends Migration
{
    public function up()
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id('address_id');
            
            // Explicitly specify alumni_id as the foreign key
            $table->unsignedBigInteger('alumni_id'); 
            $table->foreign('alumni_id')->references('alumni_id')->on('alumni')->onDelete('cascade');
            
            $table->string('street');
            $table->string('city');
            $table->string('state');
            $table->string('postal_code');
            $table->string('country');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('addresses');
    }
}
