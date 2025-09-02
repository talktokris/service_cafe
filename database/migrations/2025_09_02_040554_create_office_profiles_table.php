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
        Schema::create('office_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('companyName')->nullable();
            $table->enum('profileType', ['HeadOffice', 'BranchOffice'])->default('BranchOffice');
            $table->string('regNo')->nullable();
            $table->text('address')->nullable();
            $table->string('phoneNo')->nullable();
            $table->string('contactFirstName')->nullable();
            $table->string('contactLastName')->nullable();
            $table->string('contactEmail')->nullable();
            $table->string('contactMobileNo')->nullable();
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
        Schema::dropIfExists('office_profiles');
    }
};
