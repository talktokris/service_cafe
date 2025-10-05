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
        Schema::create('cash_wallets_transactions', function (Blueprint $table) {
            $table->id(); // Big integer auto increment
            
            // Relationships
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('trigger_id')->nullable();
            $table->unsignedBigInteger('create_user_id')->nullable();
            
            // Transaction details
            $table->string('name', 255)->nullable();
            $table->string('type', 255)->nullable();
            
            // Amount
            $table->decimal('amount', 8, 2)->default(0);
            
            // Transaction date (defaults to current timestamp)
            $table->timestamp('transaction_date')->useCurrent();
            
            // Status fields
            $table->tinyInteger('cash_out_status')->default(0)->comment('0 - no, 1 - yes');
            $table->tinyInteger('status')->default(0)->comment('0 - not active, 1 - active');
            $table->tinyInteger('deleteStatus')->default(0)->comment('0 - not deleted, 1 - deleted');
            
            $table->timestamps();
            
            // Foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('create_user_id')->references('id')->on('users')->onDelete('set null');
            
            // Indexes for better performance
            $table->index('user_id');
            $table->index('trigger_id');
            $table->index('create_user_id');
            $table->index('cash_out_status');
            $table->index('status');
            $table->index('deleteStatus');
            $table->index('transaction_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cash_wallets_transactions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['create_user_id']);
        });
        
        Schema::dropIfExists('cash_wallets_transactions');
    }
};
