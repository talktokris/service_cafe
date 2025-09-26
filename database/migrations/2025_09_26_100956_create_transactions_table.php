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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_nature', 255)->nullable();
            $table->string('transaction_type', 255)->nullable();
            $table->tinyInteger('debit_credit')->default(0)->comment('1 debit, 2 credit');
            $table->date('matching_date')->nullable();
            $table->unsignedBigInteger('transaction_from_id')->nullable();
            $table->unsignedBigInteger('transaction_to_id')->nullable();
            $table->unsignedBigInteger('trigger_id')->nullable();
            $table->decimal('amount', 8, 2)->default(0);
            $table->timestamp('transaction_date')->nullable();
            $table->tinyInteger('status')->default(0);
            $table->tinyInteger('countStatus')->default(0);
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('transaction_from_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('transaction_to_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('trigger_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
