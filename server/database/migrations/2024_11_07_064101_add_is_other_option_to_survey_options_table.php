<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsOtherOptionToSurveyOptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('survey_options', function (Blueprint $table) {
            $table->boolean('is_other_option')->default(false)->after('option_value'); // New column to flag "Others" option
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('survey_options', function (Blueprint $table) {
            $table->dropColumn('is_other_option');
        });
    }
}
