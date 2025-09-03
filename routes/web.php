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
            // Use tax amount and subTotalAmount calculated in frontend
            // Frontend now calculates tax using govTaxPercentage from menu item
            $taxAmount = floatval($request->taxAmount ?? 0);
            $subTotalAmount = floatval($request->subTotalAmount ?? 0);
            
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
                'quantity' => $request->quantity ?? 1,
                'subTotalAmount' => round($subTotalAmount, 2),
                'deleteStatus' => 0,
            ]);
            
            \Log::info('Order item created successfully:', [
                'order_item_id' => $orderItem->id,
                'order_id' => $orderItem->orderId,
                'menu_id' => $orderItem->menuId,
                'tax_amount' => $orderItem->taxAmount,
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
    
    // Get order items for a specific order
    Route::get('/order-items', function (\Illuminate\Http\Request $request) {
        try {
            // Debug logging
            \Log::info('Fetching order items with params:', [
                'orderId' => $request->orderId,
                'headOfficeId' => $request->headOfficeId,
                'branchId' => $request->branchId,
                'tableId' => $request->tableId
            ]);
            
            $query = \App\Models\OrderItem::with('menuItem')
                ->where('orderId', $request->orderId)
                ->where('headOfficeId', $request->headOfficeId)
                ->where('tableId', $request->tableId)
                ->where('deleteStatus', 0);
            
            // Handle branchId - it can be null or empty
            if ($request->branchId && $request->branchId !== 'null') {
                $query->where('branchId', $request->branchId);
            } else {
                $query->whereNull('branchId');
            }
            
            $orderItems = $query->get();

            \Log::info('Found order items:', ['count' => $orderItems->count()]);

            return response()->json([
                'success' => true,
                'orderItems' => $orderItems->map(function($item) {
                    return [
                        'id' => $item->id,
                        'headOfficeId' => $item->headOfficeId,
                        'branchId' => $item->branchId,
                        'createUserId' => $item->createUserId,
                        'tableId' => $item->tableId,
                        'orderId' => $item->orderId,
                        'menuId' => $item->menuId,
                        'quantity' => $item->quantity,
                        'buyingPrice' => $item->buyingPrice,
                        'sellingPrice' => $item->sellingPrice,
                        'taxAmount' => $item->taxAmount,
                        'adminProfitAmount' => $item->adminProfitAmount,
                        'adminNetProfitAmount' => $item->adminNetProfitAmount,
                        'userCommissionAmount' => $item->userCommissionAmount,
                        'subTotalAmount' => $item->subTotalAmount,
                        'deleteStatus' => $item->deleteStatus,
                        'menuItem' => $item->menuItem ? [
                            'id' => $item->menuItem->id,
                            'menuName' => $item->menuItem->menuName,
                            'menuType' => $item->menuItem->menuType,
                            'drinkAmount' => $item->menuItem->drinkAmount,
                            'buyingPrice' => $item->menuItem->buyingPrice,
                            'sellingPrice' => $item->menuItem->sellingPrice,
                            'adminProfitPercentage' => $item->menuItem->adminProfitPercentage,
                            'adminProfitAmount' => $item->menuItem->adminProfitAmount,
                            'userCommissionPercentage' => $item->menuItem->userCommissionPercentage,
                            'userCommissionAmount' => $item->menuItem->userCommissionAmount,
                            'govTaxPercentage' => $item->menuItem->govTaxPercentage,
                            'govTaxAmount' => $item->menuItem->govTaxAmount,
                            'sellingWithTaxPrice' => $item->menuItem->sellingWithTaxPrice,
                            'activeStatus' => $item->menuItem->activeStatus,
                            'deleteStatus' => $item->menuItem->deleteStatus,
                        ] : null
                    ];
                }),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching order items: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch order items',
            ], 500);
        }
    })->name('order-items.index');

    // Update order item
    Route::put('/order-items/{id}', function (\Illuminate\Http\Request $request, $id) {
        try {
            $orderItem = \App\Models\OrderItem::findOrFail($id);
            
            $orderItem->update([
                'quantity' => $request->quantity,
                'subTotalAmount' => $request->subTotalAmount,
                'taxAmount' => $request->taxAmount,
            ]);

            return response()->json([
                'success' => true,
                'orderItem' => $orderItem,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating order item: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order item',
            ], 500);
        }
    })->name('order-items.update');

    // Delete order item (soft delete)
    Route::delete('/order-items/{id}', function (\Illuminate\Http\Request $request, $id) {
        try {
            $orderItem = \App\Models\OrderItem::findOrFail($id);
            
            $orderItem->update([
                'deleteStatus' => 1,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Order item deleted successfully',
            ]);
        } catch (\Exception $e) {
            \Log::error('Error deleting order item: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete order item',
            ], 500);
        }
    })->name('order-items.delete');
    
    // Process Payment
    Route::post('/process-payment', function (\Illuminate\Http\Request $request) {
        try {
            $validated = $request->validate([
                'tableId' => 'required|integer|exists:restaurant_tables,id',
                'paymentMethod' => 'required|in:cash,online,wallet',
                'billingType' => 'required|in:walking,member',
                'orderTotal' => 'required|numeric|min:0',
                'discountAmount' => 'required|numeric|min:0',
                'finalTotal' => 'required|numeric|min:0',
                'paymentReference' => 'nullable|string|max:30',
                'notes' => 'nullable|string|max:250',
                'selectedMember' => 'nullable|array',
                'selectedMember.id' => 'nullable|integer|exists:users,id'
            ]);

            $user = auth()->user();
            
            // Find the active order for this table
            $order = \App\Models\Order::where('tableId', $validated['tableId'])
                ->where('headOfficeId', $user->headOfficeId)
                ->where('branchId', $user->branchId)
                ->where('tableOccupiedStatus', 1)
                ->where('paymentStatus', 0)
                ->where('deleteStatus', 0)
                ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active order found for this table'
                ], 404);
            }

            // Calculate sums from order_items table
            $orderItems = \App\Models\OrderItem::where('orderId', $order->id)
                ->where('deleteStatus', 0)
                ->get();

            $buyingPrice = $orderItems->sum('buyingPrice');
            $sellingPrice = $orderItems->sum('sellingPrice');
            $taxAmount = $orderItems->sum('taxAmount');
            $adminProfitAmount = $orderItems->sum('adminProfitAmount');
            $adminNetProfitAmount = $orderItems->sum('adminNetProfitAmount');
            $userCommissionAmount = $orderItems->sum('userCommissionAmount');

            // Update the order with payment information
            $order->update([
                'paymentMethod' => $validated['paymentMethod'],
                'billingType' => $validated['billingType'],
                'buyingPrice' => $buyingPrice,
                'sellingPrice' => $sellingPrice,
                'discountAmount' => $validated['discountAmount'],
                'taxAmount' => $taxAmount,
                'adminProfitAmount' => $adminProfitAmount,
                'adminNetProfitAmount' => $adminNetProfitAmount,
                'userCommissionAmount' => $userCommissionAmount,
                'customerType' => $validated['billingType'],
                'memberUserId' => $validated['selectedMember']['id'] ?? null,
                'orderEndDateTime' => now(),
                'paymentType' => $validated['paymentMethod'],
                'paymentReference' => $validated['paymentReference'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'paymentStatus' => 1, // Mark as paid
                'tableOccupiedStatus' => 0, // Free the table
            ]);

            \Log::info('Payment processed successfully', [
                'orderId' => $order->id,
                'tableId' => $validated['tableId'],
                'paymentMethod' => $validated['paymentMethod'],
                'buyingPrice' => $buyingPrice,
                'sellingPrice' => $sellingPrice,
                'discountAmount' => $validated['discountAmount'],
                'taxAmount' => $taxAmount,
                'adminProfitAmount' => $adminProfitAmount,
                'adminNetProfitAmount' => $adminNetProfitAmount,
                'userCommissionAmount' => $userCommissionAmount,
                'finalTotal' => $sellingPrice - $validated['discountAmount']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment processed successfully!',
                'orderId' => $order->id,
                'finalTotal' => $sellingPrice - $validated['discountAmount'],
                'paymentMethod' => $validated['paymentMethod'],
                'calculatedValues' => [
                    'buyingPrice' => $buyingPrice,
                    'sellingPrice' => $sellingPrice,
                    'taxAmount' => $taxAmount,
                    'adminProfitAmount' => $adminProfitAmount,
                    'adminNetProfitAmount' => $adminNetProfitAmount,
                    'userCommissionAmount' => $userCommissionAmount,
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Payment processing failed', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Payment processing failed. Please try again.'
            ], 500);
        }
    })->name('process-payment');
    
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
    
    // API route to fetch members for bill payment
    Route::get('/api/members', function (\Illuminate\Http\Request $request) {
        try {
            $members = \App\Models\User::where('user_type', 'member')
                ->where('member_type', 'paid')
                ->where('deleteStatus', 0)
                ->where('activeStatus', 1)
                ->select([
                    'id', 'first_name', 'last_name', 'email', 'phone', 
                    'country', 'referral_code', 'member_type'
                ])
                ->orderBy('first_name', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'members' => $members,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching members: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch members',
                'members' => []
            ], 500);
        }
    })->name('api.members');
});

require __DIR__.'/auth.php';
