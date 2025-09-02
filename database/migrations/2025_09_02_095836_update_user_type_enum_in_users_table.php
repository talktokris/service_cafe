<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, modify the column to include the new enum value
        DB::statement("ALTER TABLE users MODIFY COLUMN user_type ENUM('headoffice', 'brandoffice', 'branchOffice', 'member') DEFAULT 'member'");
        
        // Then update existing data
        DB::table('users')->where('user_type', 'brandoffice')->update(['user_type' => 'branchOffice']);
        
        // Finally, remove the old enum value
        DB::statement("ALTER TABLE users MODIFY COLUMN user_type ENUM('headoffice', 'branchOffice', 'member') DEFAULT 'member'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // First, modify the column to include the old enum value
        DB::statement("ALTER TABLE users MODIFY COLUMN user_type ENUM('headoffice', 'brandoffice', 'branchOffice', 'member') DEFAULT 'member'");
        
        // Then update existing data back
        DB::table('users')->where('user_type', 'branchOffice')->update(['user_type' => 'brandoffice']);
        
        // Finally, remove the new enum value
        DB::statement("ALTER TABLE users MODIFY COLUMN user_type ENUM('headoffice', 'brandoffice', 'member') DEFAULT 'member'");
    }
};