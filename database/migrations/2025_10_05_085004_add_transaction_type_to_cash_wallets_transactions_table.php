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
            $table->tinyInteger('transaction_type')->default(0)->comment('1 - cashIn, 2 - tax, 3 - withdrawal, 4 - transferCredit')->after('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cash_wallets_transactions', function (Blueprint $table) {
            $table->dropColumn('transaction_type');
        });
    }
};
