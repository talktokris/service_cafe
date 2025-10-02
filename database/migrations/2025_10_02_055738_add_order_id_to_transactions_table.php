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
        Schema::table('transactions', function (Blueprint $table) {
            $table->unsignedBigInteger('order_id')->nullable()->after('trigger_id');
            
            // Add foreign key constraint (optional relationship)
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('set null');
            
            // Add index for better query performance
            $table->index('order_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropIndex(['order_id']);
            $table->dropColumn('order_id');
        });
    }
};