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
        Schema::table('earnings', function (Blueprint $table) {
            $table->tinyInteger('debit_credit')->default(0)->comment('1 - debit, 2 - credit')->after('ammout');
            $table->tinyInteger('transation_type')->default(0)->comment('1 - earning, 2 - withdrawal, 3 - redistribution')->after('debit_credit');
            $table->tinyInteger('withdrawal_status')->default(0)->comment('0 - pending, 1 - done')->after('transation_type');
            $table->tinyInteger('redistribution_status')->default(0)->comment('0 - not distributed, 1 - distributed')->after('withdrawal_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('earnings', function (Blueprint $table) {
            $table->dropColumn([
                'debit_credit',
                'transation_type', 
                'withdrawal_status',
                'redistribution_status'
            ]);
        });
    }
};