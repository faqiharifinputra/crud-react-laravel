<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::table('items', function (Blueprint $table) {
        $table->string('status')->default('Belum');
    });
}

public function down()
{
    Schema::table('items', function (Blueprint $table) {
        $table->dropColumn('status');
    });
}

};
