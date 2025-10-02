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
            $table->tinyInteger('leadership_status')->default(0)->comment('1 - done, 0 - not done')->after('free_paid_member_status');
            $table->tinyInteger('chaque_match_status')->default(0)->comment('1 - done, 0 - not done')->after('leadership_status');
            $table->tinyInteger('tax_status')->default(0)->comment('1 - done, 0 - not done')->after('chaque_match_status');
            
            // Add indexes for better query performance
            $table->index('leadership_status');
            $table->index('chaque_match_status'); 
            $table->index('tax_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['leadership_status']);
            $table->dropIndex(['chaque_match_status']);
            $table->dropIndex(['tax_status']);
            
            $table->dropColumn(['leadership_status', 'chaque_match_status', 'tax_status']);
        });
    }
};
