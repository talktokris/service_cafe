<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Test Users Page
Route::get('/test-users', [UserController::class, 'testUsers'])->name('test-users');

// Create Test Users (for development)
Route::post('/create-test-users', [UserController::class, 'createTestUsers'])->name('create-test-users');

// Dashboard with role-based routing
Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

// Head Office Super User Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Menu Management
    Route::get('/menu', function () {
        $menuItems = \App\Models\MenuItem::where('deleteStatus', 0)
            ->with(['headOffice', 'branch'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        $officeProfiles = \App\Models\OfficeProfile::where('deleteStatus', 0)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('HeadOffice/Super/MenuManagement', [
            'menuItems' => $menuItems,
            'officeProfiles' => $officeProfiles
        ]);
    })->name('menu');
    
    // Order Management
    Route::get('/orders', function () {
        return Inertia::render('HeadOffice/Super/OrderManagement');
    })->name('orders');
    
    // Bill Payment
    Route::get('/bill-payment', function () {
        try {
            $restaurantTables = \App\Models\RestaurantTable::where('deleteStatus', 0)
                ->with(['headOffice', 'branch'])
                ->orderBy('created_at', 'desc')
                ->get();
            
            $menuItems = \App\Models\MenuItem::where('deleteStatus', 0)
                ->with(['headOffice', 'branch'])
                ->orderBy('created_at', 'desc')
                ->get();
            
            $orders = \App\Models\Order::where('deleteStatus', 0)
                ->with(['headOffice', 'branch', 'table', 'memberUser'])
                ->orderBy('created_at', 'desc')
                ->get();
            
            $orderItems = \App\Models\OrderItem::where('deleteStatus', 0)
                ->with(['headOffice', 'branch', 'table', 'order', 'menuItem'])
                ->orderBy('created_at', 'desc')
                ->get();
            
            \Log::info('Bill Payment Route - RestaurantTables count: ' . $restaurantTables->count());
            \Log::info('Bill Payment Route - MenuItems count: ' . $menuItems->count());
            \Log::info('Bill Payment Route - Orders count: ' . $orders->count());
            \Log::info('Bill Payment Route - OrderItems count: ' . $orderItems->count());
            
            return Inertia::render('HeadOffice/Super/BillPayment', [
                'restaurantTables' => $restaurantTables,
                'menuItems' => $menuItems,
                'orders' => $orders,
                'orderItems' => $orderItems
            ]);
        } catch (\Exception $e) {
            \Log::error('Bill Payment Route Error: ' . $e->getMessage());
            return Inertia::render('HeadOffice/Super/BillPayment', [
                'restaurantTables' => [],
                'menuItems' => [],
                'orders' => [],
                'orderItems' => []
            ]);
        }
    })->name('bill-payment');
    
    // Create Order for Table
    Route::post('/orders', function (\Illuminate\Http\Request $request) {
        try {
            $order = \App\Models\Order::create([
                'headOfficeId' => $request->headOfficeId,
                'branchId' => $request->branchId,
                'createUserId' => $request->createUserId,
                'tableId' => $request->tableId,
                'tableOccupiedStatus' => $request->tableOccupiedStatus,
                'buyingPrice' => $request->buyingPrice ?? 0,
                'sellingPrice' => $request->sellingPrice ?? 0,
                'discountAmount' => $request->discountAmount ?? 0,
                'taxAmount' => $request->taxAmount ?? 0,
                'adminProfitAmount' => $request->adminProfitAmount ?? 0,
                'adminNetProfitAmount' => $request->adminNetProfitAmount ?? 0,
                'userCommissionAmount' => $request->userCommissionAmount ?? 0,
                'customerType' => $request->customerType ?? 'walking',
                'memberUserId' => $request->memberUserId,
                'orderStaredDateTime' => $request->orderStaredDateTime,
                'orderEndDateTime' => $request->orderEndDateTime,
                'paymentType' => $request->paymentType ?? 'cash',
                'paymentReference' => $request->paymentReference,
                'notes' => $request->notes,
                'paymentStatus' => $request->paymentStatus ?? 0,
                'deleteStatus' => $request->deleteStatus ?? 0,
            ]);
            
            \Log::info('Order created successfully:', ['order_id' => $order->id]);
            
            return response()->json([
                'success' => true,
                'order' => $order,
                'message' => 'Order created successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error creating order:', ['error' => $e->getMessage()]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    })->name('orders.create');
    
    // Add Menu Item to Order
    Route::post('/order-items', function (\Illuminate\Http\Request $request) {
        try {
            // Get tax percentage from environment
            $taxPercentage = env('BILLING_TAX_PERCENTAGE', 0);
            
            // Calculate tax amount
            $sellingPrice = floatval($request->sellingPrice);
            $taxAmount = ($sellingPrice * $taxPercentage) / 100;
            $subTotalAmount = $sellingPrice + $taxAmount;
            
            $orderItem = \App\Models\OrderItem::create([
                'headOfficeId' => $request->headOfficeId,
                'branchId' => $request->branchId,
                'createUserId' => $request->createUserId,
                'tableId' => $request->tableId,
                'orderId' => $request->orderId,
                'menuId' => $request->menuId,
                'buyingPrice' => $request->buyingPrice,
                'sellingPrice' => $request->sellingPrice,
                'taxAmount' => round($taxAmount, 2),
                'adminProfitAmount' => $request->adminProfitAmount,
                'adminNetProfitAmount' => $request->adminNetProfitAmount,
                'userCommissionAmount' => $request->userCommissionAmount,
                'subTotalAmount' => round($subTotalAmount, 2),
                'deleteStatus' => 0,
            ]);
            
            \Log::info('Order item created successfully:', [
                'order_item_id' => $orderItem->id,
                'order_id' => $orderItem->orderId,
                'menu_id' => $orderItem->menuId,
                'sub_total' => $orderItem->subTotalAmount
            ]);
            
            return response()->json([
                'success' => true,
                'orderItem' => $orderItem,
                'message' => 'Menu item added to order successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error creating order item:', ['error' => $e->getMessage()]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to add menu item to order: ' . $e->getMessage()
            ], 500);
        }
    })->name('order-items.create');
    
    // Branch Management
    Route::get('/branches', function () {
        $officeProfiles = \App\Models\OfficeProfile::where('deleteStatus', 0)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('HeadOffice/Super/BranchManagement', [
            'officeProfiles' => $officeProfiles
        ]);
    })->name('branches');
    
    // Wallet Management
    Route::get('/wallets', function () {
        return Inertia::render('HeadOffice/Super/WalletManagement');
    })->name('wallets');
    
    // Users Tracking
    Route::get('/users-tracking', [UserController::class, 'index'])->name('users-tracking');
    
    // Manage Payments
    Route::get('/manage-payments', function () {
        return Inertia::render('HeadOffice/Super/ManagePayments');
    })->name('manage-payments');
    
    // Stock Management
    Route::get('/stock-management', function () {
        $stockRecords = \App\Models\StockRecord::where('deleteStatus', 0)
            ->with(['headOffice', 'branch', 'stockItemSetting'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        $officeProfiles = \App\Models\OfficeProfile::where('deleteStatus', 0)
            ->orderBy('created_at', 'desc')
            ->get();
        
        $stockItemSettings = \App\Models\StockItemSetting::where('deleteStatus', 0)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('HeadOffice/Super/StockManagement', [
            'stockRecords' => $stockRecords,
            'officeProfiles' => $officeProfiles,
            'stockItemSettings' => $stockItemSettings
        ]);
    })->name('stock-management');
    
    // Reports & Analytics
    Route::get('/reports', function () {
        return Inertia::render('HeadOffice/Super/ReportsAnalytics');
    })->name('reports');
    
    // Settings
    Route::get('/settings', function () {
        return Inertia::render('HeadOffice/Super/Settings');
    })->name('settings');
    
    // Manage Tables Settings
    Route::get('/manage-tables', function () {
        $restaurantTables = \App\Models\RestaurantTable::where('deleteStatus', 0)
            ->with(['headOffice', 'branch'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        $officeProfiles = \App\Models\OfficeProfile::where('deleteStatus', 0)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('HeadOffice/Super/ManageTablesSettings', [
            'restaurantTables' => $restaurantTables,
            'officeProfiles' => $officeProfiles
        ]);
    })->name('manage-tables');
    
    // Stock Item Settings
    Route::get('/stock-item-settings-page', function () {
        $stockItemSettings = \App\Models\StockItemSetting::where('deleteStatus', 0)
            ->with(['headOffice', 'branch'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        $officeProfiles = \App\Models\OfficeProfile::where('deleteStatus', 0)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('HeadOffice/Super/StockItemSettings', [
            'stockItemSettings' => $stockItemSettings,
            'officeProfiles' => $officeProfiles
        ]);
    })->name('stock-item-settings-page');
    
    // Office Profile Management Routes
    Route::resource('office-profiles', App\Http\Controllers\OfficeProfileController::class);
    Route::get('/office-profiles-api', [App\Http\Controllers\OfficeProfileController::class, 'getOfficeProfiles'])->name('office-profiles.api');
    
    // Restaurant Table Management Routes
    Route::resource('restaurant-tables', App\Http\Controllers\RestaurantTableController::class);
    Route::get('/restaurant-tables-api', [App\Http\Controllers\RestaurantTableController::class, 'getRestaurantTables'])->name('restaurant-tables.api');
    
    // Stock Item Settings Management Routes
    Route::resource('stock-item-settings', App\Http\Controllers\StockItemSettingController::class);
    Route::get('/stock-item-settings-api', [App\Http\Controllers\StockItemSettingController::class, 'getStockItemSettings'])->name('stock-item-settings.api');
    
    // Menu Items Management Routes
    Route::resource('menu-items', App\Http\Controllers\MenuItemController::class);
    Route::get('/menu-items-api', [App\Http\Controllers\MenuItemController::class, 'getMenuItems'])->name('menu-items.api');
    
    // Stock Records Management Routes
    Route::resource('stock-records', App\Http\Controllers\StockRecordController::class);
    Route::get('/stock-records-api', [App\Http\Controllers\StockRecordController::class, 'getStockRecords'])->name('stock-records.api');
    
    // User Management Routes
    Route::resource('users', UserController::class);
    Route::get('/users-api', [UserController::class, 'getUsers'])->name('users.api');
    Route::post('/users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');
    Route::post('/users/{user}/change-role', [UserController::class, 'changeRole'])->name('users.change-role');
    
    // Member Management Routes
    Route::get('/manage-members', [UserController::class, 'manageMembers'])->name('manage-members');
    Route::put('/members/{member}', [UserController::class, 'updateMember'])->name('members.update');
    Route::post('/members/{member}/reset-password', [UserController::class, 'resetMemberPassword'])->name('members.reset-password');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
