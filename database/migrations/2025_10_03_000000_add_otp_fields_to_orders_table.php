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
            // Add OTP related fields
            $table->string('otp_code', 6)->nullable()->after('paymentReference');
            $table->timestamp('otp_sent_at')->nullable()->after('otp_code');
            $table->timestamp('otp_verified_at')->nullable()->after('otp_sent_at');
            $table->tinyInteger('otp_status')->default(0)->after('otp_verified_at')->comment('0: Not Required, 1: Sent, 2: Verified, 3: Expired');
            $table->string('otp_phone', 15)->nullable()->after('otp_status');
            $table->string('otp_email', 100)->nullable()->after('otp_phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'otp_code',
                'otp_sent_at',
                'otp_verified_at',
                'otp_status',
                'otp_phone',
                'otp_email'
            ]);
        });
    }
};