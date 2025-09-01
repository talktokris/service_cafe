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
        Schema::create('commission_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id'); // Order that generated the commission
            $table->unsignedBigInteger('upline_user_id'); // User receiving the commission
            $table->unsignedBigInteger('downline_user_id'); // User whose purchase generated the commission
            $table->decimal('order_amount', 10, 2); // Amount of the original order
            $table->decimal('commission_rate', 5, 2); // Commission rate applied
            $table->decimal('commission_amount', 10, 2); // Actual commission amount
            $table->integer('level'); // Level in the downline (1 = direct, 2 = indirect, etc.)
            $table->enum('status', ['pending', 'approved', 'paid', 'cancelled'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('upline_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('downline_user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commission_transactions');
    }
};
