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
        Schema::create('stock_item_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('headOfficeId')->constrained('office_profiles')->onDelete('cascade');
            $table->foreignId('branchId')->nullable()->constrained('office_profiles')->onDelete('set null');
            $table->foreignId('createUserId')->nullable()->constrained('users')->onDelete('set null');
            $table->string('itemName')->nullable();
            $table->enum('itemType', ['food', 'drink'])->default('food');
            $table->tinyInteger('activeStatus')->default(0);
            $table->tinyInteger('deleteStatus')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_item_settings');
    }
};
