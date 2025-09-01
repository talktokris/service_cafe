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
            $table->string('phone')->nullable()->after('email');
            $table->string('address')->nullable()->after('phone');
            $table->enum('user_type', ['headoffice', 'brandoffice', 'member'])->default('member')->after('address');
            $table->enum('member_type', ['paid', 'free'])->nullable()->after('user_type');
            $table->string('referral_code')->unique()->nullable()->after('member_type');
            $table->unsignedBigInteger('referred_by')->nullable()->after('referral_code');
            $table->unsignedBigInteger('branch_id')->nullable()->after('referred_by');
            $table->boolean('is_active')->default(true)->after('branch_id');
            
            // Foreign keys
            $table->foreign('referred_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['referred_by']);
            $table->dropForeign(['branch_id']);
            $table->dropColumn([
                'phone', 'address', 'user_type', 'member_type', 
                'referral_code', 'referred_by', 'branch_id', 'is_active'
            ]);
        });
    }
};
