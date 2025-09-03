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
        Schema::table('menu_items', function (Blueprint $table) {
            $table->decimal('govTaxPercentage', 5, 2)->default(0)->after('userCommissionAmount');
            $table->decimal('govTaxAmount', 10, 2)->default(0)->after('govTaxPercentage');
            $table->decimal('sellingWithTaxPrice', 10, 2)->default(0)->after('govTaxAmount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn(['govTaxPercentage', 'govTaxAmount', 'sellingWithTaxPrice']);
        });
    }
};