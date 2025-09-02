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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('headOfficeId')->nullable()->constrained('office_profiles')->onDelete('set null');
            $table->foreignId('branchId')->nullable()->constrained('office_profiles')->onDelete('set null');
            $table->foreignId('createUserId')->nullable()->constrained('users')->onDelete('set null');
            $table->tinyInteger('activeStatus')->default(0);
            $table->tinyInteger('deleteStatus')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['headOfficeId']);
            $table->dropForeign(['branchId']);
            $table->dropForeign(['createUserId']);
            $table->dropColumn(['headOfficeId', 'branchId', 'createUserId', 'activeStatus', 'deleteStatus']);
        });
    }
};
