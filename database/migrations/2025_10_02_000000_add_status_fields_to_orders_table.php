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
        Schema::table('orders', function (Blueprint $table) {
            $table->tinyInteger('leadershipStatus')->default(0)->after('deleteStatus')->comment('1 - done, 0 - not done');
            $table->tinyInteger('chaqueMatchStatus')->default(0)->after('leadershipStatus')->comment('1 - done, 0 - not done');
            $table->tinyInteger('taxStatus')->default(0)->after('chaqueMatchStatus')->comment('1 - done, 0 - not done');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['leadershipStatus', 'chaqueMatchStatus', 'taxStatus']);
        });
    }
};
