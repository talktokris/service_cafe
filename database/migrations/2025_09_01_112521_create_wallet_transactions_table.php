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
        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->enum('type', ['deposit', 'withdrawal', 'payment', 'refund', 'commission']); // Transaction type
            $table->decimal('amount', 10, 2);
            $table->decimal('balance_before', 10, 2); // Balance before transaction
            $table->decimal('balance_after', 10, 2); // Balance after transaction
            $table->string('reference_type')->nullable(); // Model type (Order, CommissionTransaction, etc.)
            $table->unsignedBigInteger('reference_id')->nullable(); // ID of the related model
            $table->text('description')->nullable();
            $table->enum('status', ['pending', 'completed', 'failed', 'cancelled'])->default('completed');
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallet_transactions');
    }
};
