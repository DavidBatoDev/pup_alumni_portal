<?php
// File: server/database/migrations/2024_11_19_151415_create_notifications_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id('notification_id'); // Primary key
            $table->string('type'); // Type of notification
            $table->string('alert'); // Short alert message
            $table->string('title'); // Notification title
            $table->text('message'); // Full notification message
            $table->string('link')->nullable(); // Optional link
            $table->timestamps(); // Timestamps
        });
    
        Schema::create('alumni_notifications', function (Blueprint $table) {
            $table->id('alumni_notification_id'); // Primary key
            $table->unsignedBigInteger('alumni_id'); // Foreign key for alumni
            $table->unsignedBigInteger('notification_id'); // Foreign key for notifications
            $table->boolean('is_read')->default(false); // Read status
            $table->timestamps();
    
            // Foreign key constraints
            $table->foreign('alumni_id')->references('alumni_id')->on('alumni')->onDelete('cascade');
            $table->foreign('notification_id')->references('notification_id')->on('notifications')->onDelete('cascade');
        });
    }
    

    public function down()
    {
        Schema::dropIfExists('alumni_notifications');
        Schema::dropIfExists('notifications');
    }
}
