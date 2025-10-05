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
        Schema::table('cash_wallets_transactions', function (Blueprint $table) {
            $table->tinyInteger('debit_credit')->default(0)->comment('1 - debit, 2 - credit')->after('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cash_wallets_transactions', function (Blueprint $table) {
            $table->dropColumn('debit_credit');
        });
    }
};
