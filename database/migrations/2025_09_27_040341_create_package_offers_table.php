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
        Schema::create('package_offers', function (Blueprint $table) {
            $table->id();
            $table->string('package_name', 250)->nullable();
            $table->integer('package_amount')->default(0);
            $table->date('valid_from_date')->nullable();
            $table->date('valid_to_date')->nullable();
            $table->tinyInteger('status')->default(0)->comment('0 = Not Active, 1 = Active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_offers');
    }
};