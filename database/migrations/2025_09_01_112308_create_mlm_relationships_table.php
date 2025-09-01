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
        Schema::create('mlm_relationships', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('downline_user_id'); // Member who was referred
            $table->unsignedBigInteger('upline_user_id'); // Member who referred
            $table->integer('level')->default(1); // Level in the downline (1 = direct, 2 = indirect, etc.)
            $table->decimal('commission_rate', 5, 2)->default(0.00); // Commission rate for this level
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('downline_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('upline_user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Ensure unique relationships
            $table->unique(['downline_user_id', 'upline_user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mlm_relationships');
    }
};
