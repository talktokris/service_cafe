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
        Schema::table('cash_wallets_transactions', function (Blueprint $table) {
            $table->string('cash_out_reference_no', 255)->nullable()->after('deleteStatus');
            $table->string('cash_out_description', 255)->nullable()->after('cash_out_reference_no');
            $table->unsignedBigInteger('cash_out_user_id')->nullable()->after('cash_out_description');
            $table->timestamp('cash_out_date')->nullable()->after('cash_out_user_id');
            
            // Add foreign key constraint
            $table->foreign('cash_out_user_id')->references('id')->on('users')->onDelete('set null');
            
            // Add index for better performance
            $table->index('cash_out_user_id');
            $table->index('cash_out_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cash_wallets_transactions', function (Blueprint $table) {
            // Drop foreign key constraint first
            $table->dropForeign(['cash_out_user_id']);
            
            // Drop indexes
            $table->dropIndex(['cash_out_user_id']);
            $table->dropIndex(['cash_out_date']);
            
            // Drop columns
            $table->dropColumn([
                'cash_out_reference_no',
                'cash_out_description', 
                'cash_out_user_id',
                'cash_out_date'
            ]);
        });
    }
};
