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
        Schema::create('global_pools', function (Blueprint $table) {
            $table->id(); // Big integer auto increment
            
            // Relationships
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('order_id')->nullable();
            $table->unsignedBigInteger('user_trigger_id')->nullable();
            
            // Pool details
            $table->string('earning_name', 250)->nullable();
            $table->string('earning_description', 250)->nullable();
            
            // Amount
            $table->decimal('ammout', 8, 2)->default(0); // Note: keeping original typo "ammout" as specified
            
            // Status fields
            $table->tinyInteger('status')->default(0)->comment('0 - Not active, 1 - active');
            $table->tinyInteger('deleteStatus')->default(0)->comment('0 - not deleted, 1 - deleted');
            $table->tinyInteger('countStatus')->default(0)->comment('0 - not counted, 1 - counted');
            
            $table->timestamps();
            
            // Foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('set null');
            $table->foreign('user_trigger_id')->references('id')->on('users')->onDelete('set null');
            
            // Indexes for better performance
            $table->index('user_id');
            $table->index('order_id');
            $table->index('user_trigger_id');
            $table->index('status');
            $table->index('deleteStatus');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('global_pools', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['order_id']);
            $table->dropForeign(['user_trigger_id']);
        });
        
        Schema::dropIfExists('global_pools');
    }
};
