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
        Schema::table('order_items', function (Blueprint $table) {
            // Drop foreign key constraints first
            $table->dropForeign(['order_id']);
            
            // Drop existing columns (except id and timestamps)
            $table->dropColumn([
                'order_id', 'item_name', 'description', 'quantity', 'unit_price', 'total_price', 'notes'
            ]);
            
            // Add new columns
            $table->unsignedBigInteger('headOfficeId')->after('id');
            $table->unsignedBigInteger('branchId')->nullable()->after('headOfficeId');
            $table->unsignedBigInteger('createUserId')->nullable()->after('branchId');
            $table->unsignedBigInteger('tableId')->nullable()->after('createUserId');
            $table->unsignedBigInteger('orderId')->nullable()->after('tableId');
            $table->unsignedBigInteger('menuId')->nullable()->after('orderId');
            $table->decimal('buyingPrice', 10, 2)->default(0)->after('menuId');
            $table->decimal('sellingPrice', 10, 2)->default(0)->after('buyingPrice');
            $table->decimal('taxAmount', 10, 2)->default(0)->after('sellingPrice');
            $table->decimal('adminProfitAmount', 10, 2)->default(0)->after('taxAmount');
            $table->decimal('adminNetProfitAmount', 10, 2)->default(0)->after('adminProfitAmount');
            $table->decimal('userCommissionAmount', 10, 2)->default(0)->after('adminNetProfitAmount');
            $table->tinyInteger('deleteStatus')->default(0)->after('userCommissionAmount');
            
            // Add foreign key constraints
            $table->foreign('headOfficeId')->references('id')->on('office_profiles')->onDelete('cascade');
            $table->foreign('branchId')->references('id')->on('office_profiles')->onDelete('set null');
            $table->foreign('createUserId')->references('id')->on('users')->onDelete('set null');
            $table->foreign('tableId')->references('id')->on('restaurant_tables')->onDelete('set null');
            $table->foreign('orderId')->references('id')->on('orders')->onDelete('set null');
            $table->foreign('menuId')->references('id')->on('menu_items')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            // Drop foreign key constraints
            $table->dropForeign(['headOfficeId']);
            $table->dropForeign(['branchId']);
            $table->dropForeign(['createUserId']);
            $table->dropForeign(['tableId']);
            $table->dropForeign(['orderId']);
            $table->dropForeign(['menuId']);
            
            // Drop new columns
            $table->dropColumn([
                'headOfficeId', 'branchId', 'createUserId', 'tableId', 'orderId', 'menuId',
                'buyingPrice', 'sellingPrice', 'taxAmount', 'adminProfitAmount',
                'adminNetProfitAmount', 'userCommissionAmount', 'deleteStatus'
            ]);
            
            // Restore original columns
            $table->unsignedBigInteger('order_id');
            $table->string('item_name');
            $table->text('description')->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_price', 10, 2);
            $table->text('notes')->nullable();
            
            // Restore foreign key constraints
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });
    }
};
