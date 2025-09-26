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
        Schema::create('member_upline_rank', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('refferal_user_id')->nullable();
            $table->unsignedBigInteger('three_star_user_id')->nullable();
            $table->unsignedBigInteger('five_star_user_id')->nullable();
            $table->unsignedBigInteger('seven_star_user_id')->nullable();
            $table->unsignedBigInteger('mega_star_user_id')->nullable();
            $table->unsignedBigInteger('giga_star_user_id')->nullable();
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('refferal_user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('three_star_user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('five_star_user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('seven_star_user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('mega_star_user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('giga_star_user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_upline_rank');
    }
};
