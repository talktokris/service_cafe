<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->tinyInteger('rankFindStatus')->default(0)->comment('0 = Rank Find Not Done, 1 = Rank Find Done');
            $table->tinyInteger('promotionRunStatus')->default(0)->comment('0 = Promotion Run Not Done, 1 = Promotion Run Done');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['rankFindStatus', 'promotionRunStatus']);
        });
    }
};
