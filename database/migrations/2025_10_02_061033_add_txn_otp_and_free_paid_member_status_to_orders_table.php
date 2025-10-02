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
            $table->string('txn_otp', 6)->nullable()->after('memberUserId');
            $table->tinyInteger('free_paid_member_status')->default(0)->comment('0 - free, 1 - paid')->after('txn_otp');
            
            // Add index for better query performance
            $table->index('free_paid_member_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['free_paid_member_status']);
            $table->dropColumn(['txn_otp', 'free_paid_member_status']);
        });
    }
};