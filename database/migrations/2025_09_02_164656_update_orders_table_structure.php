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
        Schema::table('orders', function (Blueprint $table) {
            // Drop foreign key constraints first
            $table->dropForeign(['user_id']);
            $table->dropForeign(['branch_id']);
            
            // Drop existing columns (except id and timestamps)
            $table->dropColumn([
                'order_number', 'user_id', 'branch_id', 'order_type', 'payment_method', 
                'subtotal', 'tax_amount', 'discount_amount', 'total_amount', 'status', 'notes'
            ]);
            
            // Add new columns
            $table->unsignedBigInteger('headOfficeId')->after('id');
            $table->unsignedBigInteger('branchId')->nullable()->after('headOfficeId');
            $table->unsignedBigInteger('createUserId')->nullable()->after('branchId');
            $table->unsignedBigInteger('tableId')->nullable()->after('createUserId');
            $table->tinyInteger('tableOccupiedStatus')->default(0)->after('tableId');
            $table->decimal('buyingPrice', 10, 2)->default(0)->after('tableOccupiedStatus');
            $table->decimal('sellingPrice', 10, 2)->default(0)->after('buyingPrice');
            $table->decimal('discountAmount', 10, 2)->default(0)->after('sellingPrice');
            $table->decimal('taxAmount', 10, 2)->default(0)->after('discountAmount');
            $table->decimal('adminProfitAmount', 10, 2)->default(0)->after('taxAmount');
            $table->decimal('adminNetProfitAmount', 10, 2)->default(0)->after('adminProfitAmount');
            $table->decimal('userCommissionAmount', 10, 2)->default(0)->after('adminNetProfitAmount');
            $table->enum('customerType', ['member', 'walking'])->after('userCommissionAmount');
            $table->unsignedBigInteger('memberUserId')->nullable()->after('customerType');
            $table->timestamp('orderStaredDateTime')->nullable()->after('memberUserId');
            $table->timestamp('orderEndDateTime')->nullable()->after('orderStaredDateTime');
            $table->enum('paymentType', ['cash', 'online'])->after('orderEndDateTime');
            $table->string('paymentReference', 30)->nullable()->after('paymentType');
            $table->string('notes', 250)->nullable()->after('paymentReference');
            $table->tinyInteger('paymentStatus')->default(0)->after('notes');
            $table->tinyInteger('deleteStatus')->default(0)->after('paymentStatus');
            
            // Add foreign key constraints
            $table->foreign('headOfficeId')->references('id')->on('office_profiles')->onDelete('cascade');
            $table->foreign('branchId')->references('id')->on('office_profiles')->onDelete('set null');
            $table->foreign('createUserId')->references('id')->on('users')->onDelete('set null');
            $table->foreign('tableId')->references('id')->on('restaurant_tables')->onDelete('set null');
            $table->foreign('memberUserId')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Drop foreign key constraints
            $table->dropForeign(['headOfficeId']);
            $table->dropForeign(['branchId']);
            $table->dropForeign(['createUserId']);
            $table->dropForeign(['tableId']);
            $table->dropForeign(['memberUserId']);
            
            // Drop new columns
            $table->dropColumn([
                'headOfficeId', 'branchId', 'createUserId', 'tableId', 'tableOccupiedStatus',
                'buyingPrice', 'sellingPrice', 'discountAmount', 'taxAmount', 'adminProfitAmount',
                'adminNetProfitAmount', 'userCommissionAmount', 'customerType', 'memberUserId',
                'orderStaredDateTime', 'orderEndDateTime', 'paymentType', 'paymentReference',
                'notes', 'paymentStatus', 'deleteStatus'
            ]);
            
            // Restore original columns
            $table->string('order_number')->unique();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('branch_id')->nullable();
            $table->string('order_type')->default('dine_in');
            $table->string('payment_method')->nullable();
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->string('status')->default('pending');
            $table->text('notes')->nullable();
            
            // Restore foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('branch_id')->references('id')->on('office_profiles')->onDelete('set null');
        });
    }
};
