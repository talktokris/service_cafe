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
        Schema::table('menu_items', function (Blueprint $table) {
            // Change adminProfitPercentage from tinyInteger to decimal(5,2)
            $table->decimal('adminProfitPercentage', 5, 2)->default(0)->change();
            
            // Change userCommissionPercentage from tinyInteger to decimal(5,2)
            $table->decimal('userCommissionPercentage', 5, 2)->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            // Revert back to tinyInteger
            $table->tinyInteger('adminProfitPercentage')->default(0)->change();
            $table->tinyInteger('userCommissionPercentage')->default(0)->change();
        });
    }
};
