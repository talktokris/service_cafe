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
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('headOfficeId')->constrained('office_profiles')->onDelete('cascade');
            $table->foreignId('branchId')->nullable()->constrained('office_profiles')->onDelete('set null');
            $table->foreignId('createUserId')->nullable()->constrained('users')->onDelete('set null');
            $table->string('menuName')->nullable();
            $table->enum('menuType', ['food', 'drink'])->default('food');
            $table->decimal('drinkAmount', 10, 2)->default(0);
            $table->decimal('buyingPrice', 10, 2)->default(0);
            $table->tinyInteger('adminProfitPercentage')->default(0);
            $table->decimal('adminProfitAmount', 10, 2)->default(0);
            $table->tinyInteger('userCommissionPercentage')->default(0);
            $table->decimal('userCommissionAmount', 10, 2)->default(0);
            $table->decimal('sellingPrice', 10, 2)->default(0);
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
        Schema::dropIfExists('menu_items');
    }
};
