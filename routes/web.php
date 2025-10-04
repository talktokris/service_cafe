<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\MemberDashboardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\MemberOrderController;
use App\Http\Controllers\ShareReferralController;
use App\Http\Controllers\TreeViewController;
use App\Http\Controllers\CronController;
use App\Http\Controllers\LeadershipChaqueMatchController;
use App\Http\Controllers\MemberActivationController;
use App\Http\Controllers\PrivacyPolicyController;
use App\Http\Controllers\TermsOfServiceController;
use App\Http\Controllers\OtpOrderController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Public Pages Routes
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/services', function () {
    return Inertia::render('Services');
})->name('services');

Route::get('/faq', function () {
    return Inertia::render('FAQ');
})->name('faq');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

// Test Users Page
Route::get('/test-users', [UserController::class, 'testUsers'])->name('test-users');

// Create Test Users (for development)
Route::post('/create-test-users', [UserController::class, 'createTestUsers'])->name('create-test-users');

// Dashboard with role-based routing
Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

// Head Office Super User Routes - PROTECTED
Route::middleware(['auth', 'verified', 'user.type:headoffice', 'role:super_user,admin_user'])->group(function () {
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
        $orders = \App\Models\Order::where('deleteStatus', 0)
            ->with([
                'headOffice', 
                'branch', 
                'table', 
                'memberUser:id,first_name,last_name,email,phone,referral_code,user_type,member_type',
                'creator'
            ])
            ->orderBy('created_at', 'desc')
            ->get();
        
        $officeProfiles = \App\Models\OfficeProfile::where('deleteStatus', 0)
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Manually build the orders data to ensure memberUser is properly included
        $ordersData = $orders->map(function ($order) {
            $orderData = $order->toArray();
            if ($order->memberUser) {
                $orderData['memberUser'] = [
                    'id' => $order->memberUser->id,
                    'first_name' => $order->memberUser->first_name,
                    'last_name' => $order->memberUser->last_name,
                    'email' => $order->memberUser->email,
                    'phone' => $order->memberUser->phone,
                    'referral_code' => $order->memberUser->referral_code,
                    'user_type' => $order->memberUser->user_type,
                    'member_type' => $order->memberUser->member_type,
                ];
            }
            return $orderData;
        });
        
        return Inertia::render('HeadOffice/Super/OrderManagement', [
            'orders' => $ordersData,
            'officeProfiles' => $officeProfiles
        ]);
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
            
            Log::info('Bill Payment Route - RestaurantTables count: ' . $restaurantTables->count());
            Log::info('Bill Payment Route - MenuItems count: ' . $menuItems->count());
            Log::info('Bill Payment Route - Orders count: ' . $orders->count());
            Log::info('Bill Payment Route - OrderItems count: ' . $orderItems->count());
            
            return Inertia::render('HeadOffice/Super/BillPayment', [
                'restaurantTables' => $restaurantTables,
                'menuItems' => $menuItems,
                'orders' => $orders,
                'orderItems' => $orderItems
            ]);
        } catch (\Exception $e) {
            Log::error('Bill Payment Route Error: ' . $e->getMessage());
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
            
            Log::info('Order created successfully:', ['order_id' => $order->id]);
            
            return response()->json([
                'success' => true,
                'order' => $order,
                'message' => 'Order created successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error creating order:', ['error' => $e->getMessage()]);
            
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
            
            Log::info('Order item created successfully:', [
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
            Log::error('Error creating order item:', ['error' => $e->getMessage()]);
            
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
            Log::info('Fetching order items with params:', [
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

            Log::info('Found order items:', ['count' => $orderItems->count()]);

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
            Log::error('Error fetching order items: ' . $e->getMessage());
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
            Log::error('Error updating order item: ' . $e->getMessage());
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
            Log::error('Error deleting order item: ' . $e->getMessage());
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
                'selectedMember.id' => 'nullable|integer|exists:users,id',
                'paymentOtp' => 'nullable|string|size:6'
            ]);

            $user = Auth::user();
            
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

            // OTP validation only for wallet payments with member billing
            if ($validated['paymentMethod'] === 'wallet' && 
                $validated['billingType'] === 'member' && 
                isset($validated['selectedMember']['id'])) {
                
                $member = \App\Models\User::find($validated['selectedMember']['id']);
                
                if ($member) {
                    // OTP is required for wallet payments
                    if (!isset($validated['paymentOtp']) || empty($validated['paymentOtp'])) {
                        return response()->json([
                            'success' => false,
                            'message' => 'OTP is required for wallet payments'
                        ], 422);
                    }
                    
                    // Validate OTP matches the one stored in order
                    if ($order->txn_otp !== $validated['paymentOtp']) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Invalid OTP. Please check and try again.'
                        ], 422);
                    }
                }
            }

            // Calculate sums from order_items table (considering quantity)
            $orderItems = \App\Models\OrderItem::where('orderId', $order->id)
                ->where('deleteStatus', 0)
                ->get();

            $buyingPrice = $orderItems->sum(function ($item) {
                return ($item->buyingPrice * $item->quantity);
            });
            $sellingPrice = $orderItems->sum(function ($item) {
                return ($item->sellingPrice * $item->quantity);
            });
            $taxAmount = $orderItems->sum('taxAmount');
            $adminProfitAmount = $orderItems->sum(function ($item) {
                return ($item->adminProfitAmount * $item->quantity);
            });
            $adminNetProfitAmount = $orderItems->sum(function ($item) {
                return ($item->adminNetProfitAmount * $item->quantity);
            });
            $userCommissionAmount = $orderItems->sum(function ($item) {
                return ($item->userCommissionAmount * $item->quantity);
            });

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

            // Create transaction record for paid member wallet payments
            if ($validated['paymentMethod'] === 'wallet' && 
                $validated['billingType'] === 'member' && 
                isset($validated['selectedMember']['id'])) {
                
                $member = \App\Models\User::find($validated['selectedMember']['id']);
                
                if ($member && $member->member_type === 'paid') {
                    // Calculate final amount including tax, then subtract discount
                    $finalAmount = ($sellingPrice + $taxAmount) - $validated['discountAmount'];
                    
                    \App\Models\Transaction::create([
                        'transaction_nature' => 'Bill Payment',
                        'transaction_type' => (string) $order->id,
                        'matching_date' => now()->toDateString(),
                        'transaction_from_id' => $member->id,
                        'transaction_to_id' => $member->id,
                        'trigger_id' => $member->id,
                        'order_id' => $order->id,
                        'created_user_id' => $user->id,
                        'amount' => $finalAmount,
                        'transaction_date' => now(),
                        'status' => 1,
                        'countStatus' => 0,
                        'debit_credit' => 1, // Debit transaction
                    ]);
                    
                    Log::info('Transaction record created for paid member payment', [
                        'order_id' => $order->id,
                        'member_id' => $member->id,
                        'amount' => $finalAmount,
                        'transaction_nature' => 'Bill Payment'
                    ]);
                }
            }

            Log::info('Payment processed successfully', [
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
                'finalTotal' => ($sellingPrice + $taxAmount) - $validated['discountAmount']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment processed successfully!',
                'orderId' => $order->id,
                'finalTotal' => ($sellingPrice + $taxAmount) - $validated['discountAmount'],
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
            Log::error('Payment processing failed', [
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
    
    // Today OTP with comprehensive date filtering
    Route::get('/today-otp', function (Request $request) {
        $dateFilter = $request->get('date_filter', 'today'); // 'all', 'today', or specific date (Y-m-d format)
        $search = $request->get('search', '');
        
        // Build base query for OTP orders
        $query = \App\Models\Order::where('deleteStatus', 0)
            ->whereNotNull('txn_otp') // Orders with OTP
            ->where('txn_otp', '!=', '') // Ensure txn_otp is not empty
            ->with([
                'memberUser:id,first_name,last_name,email,phone,referral_code,user_type,member_type',
                'table', 
                'headOffice', 
                'branch'
            ])
            ->orderBy('created_at', 'desc');
        
        // Apply date filtering
        if ($dateFilter === 'today') {
            $query->whereDate('created_at', today());
        } elseif ($dateFilter === 'all') {
            // No additional date filtering - show all OTP orders
        } elseif (\Carbon\Carbon::canBeCreatedFromFormat($dateFilter, 'Y-m-d')) {
            // Specific date filtering
            $query->whereDate('created_at', $dateFilter);
        }
        
        // Apply search filtering
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', '%' . $search . '%')
                  ->orWhere('txn_otp', 'like', '%' . $search . '%')
                  ->orWhereHas('memberUser', function ($memberQuery) use ($search) {
                      $memberQuery->where('first_name', 'like', '%' . $search . '%')
                                  ->orWhere('last_name', 'like', '%' . $search . '%')
                                  ->orWhere('email', 'like', '%' . $search . '%')
                                  ->orWhere('phone', 'like', '%' . $search . '%');
                  });
            });
        }
        
        $orders = $query->get();
        
        // Generate available date tabs (last 7 days including today)
        $availableDates = [];
        for ($i = 0; $i < 7; $i++) {
            $date = \Carbon\Carbon::now()->subDays($i);
            $availableDates[] = [
                'value' => $date->format('Y-m-d'),
                'label' => $i === 0 ? 'Today' : $date->format('jS M'),
                'is_today' => $i === 0
            ];
        }
        
        return Inertia::render('HeadOffice/Super/TodayOTPView', [
            'todayOrders' => $orders,
            'filters' => [
                'date_filter' => $dateFilter,
                'search' => $search,
            ],
            'availableDates' => $availableDates
        ]);
    })->name('today-otp');
    
    
    
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
    
    // OTP Orders Management
    Route::get('/otp-orders', [OtpOrderController::class, 'index'])->name('otp-orders');
    Route::post('/otp-orders/{orderId}/send-otp', [OtpOrderController::class, 'sendOtp'])->name('otp-orders.send-otp');
    Route::post('/otp-orders/{orderId}/verify-otp', [OtpOrderController::class, 'verifyOtp'])->name('otp-orders.verify-otp');
    
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
    
    // Package Setup
    Route::get('/package-setup', function () {
        $packages = \App\Models\PackageOffer::orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('HeadOffice/Super/ManagePackageSettings', [
            'packages' => $packages
        ]);
    })->name('package-setup');
    
    // API route to get latest active package
    Route::get('/api/latest-active-package', function () {
        try {
            $latestPackage = \App\Models\PackageOffer::where('status', 1)
                ->orderBy('id', 'desc')
                ->first();
            
            if ($latestPackage) {
                return response()->json([
                    'success' => true,
                    'package' => [
                        'id' => $latestPackage->id,
                        'package_name' => $latestPackage->package_name,
                        'package_amount' => $latestPackage->package_amount,
                        'valid_from_date' => $latestPackage->valid_from_date,
                        'valid_to_date' => $latestPackage->valid_to_date,
                        'status' => $latestPackage->status,
                        'created_at' => $latestPackage->created_at,
                    ]
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No active packages found',
                    'package' => null
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error fetching latest active package: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error fetching package data',
                'package' => null
            ], 500);
        }
    })->name('api.latest-active-package');
    
    // Latest Package Demo
    Route::get('/latest-package-demo', function () {
        return Inertia::render('HeadOffice/Super/LatestPackageDemo');
    })->name('latest-package-demo');
    
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
    
    // Package Management Routes
    Route::post('/package-offers', function (\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'package_name' => 'nullable|string|max:250',
            'package_amount' => 'required|integer|min:0|max:999999',
            'valid_from_date' => 'nullable|date',
            'valid_to_date' => 'nullable|date|after_or_equal:valid_from_date',
            'status' => 'required|integer|in:0,1',
        ], [
            'package_name.max' => 'Package name cannot exceed 250 characters.',
            'package_amount.required' => 'Package amount is required.',
            'package_amount.integer' => 'Package amount must be a valid number.',
            'package_amount.min' => 'Package amount must be at least 0.',
            'package_amount.max' => 'Package amount cannot exceed 999,999.',
            'valid_from_date.date' => 'Valid from date must be a valid date.',
            'valid_to_date.date' => 'Valid to date must be a valid date.',
            'valid_to_date.after_or_equal' => 'Valid to date must be after or equal to valid from date.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be either 0 (Not Active) or 1 (Active).',
        ]);

        try {
            $package = \App\Models\PackageOffer::create($validated);
            
            Log::info('Package created successfully', [
                'package_id' => $package->id,
                'package_name' => $package->package_name,
                'package_amount' => $package->package_amount
            ]);
            
            return back()->with('success', 'Package created successfully!');
        } catch (\Exception $e) {
            Log::error('Package creation failed', [
                'error' => $e->getMessage(),
                'data' => $validated
            ]);
            
            return back()->withErrors(['error' => 'Failed to create package. Please try again.']);
        }
    })->name('package-offers.store');
    
    Route::put('/package-offers/{package}', function (\Illuminate\Http\Request $request, $package) {
        $packageModel = \App\Models\PackageOffer::findOrFail($package);
        
        $validated = $request->validate([
            'package_name' => 'nullable|string|max:250',
            'package_amount' => 'required|integer|min:0|max:999999',
            'valid_from_date' => 'nullable|date',
            'valid_to_date' => 'nullable|date|after_or_equal:valid_from_date',
            'status' => 'required|integer|in:0,1',
        ], [
            'package_name.max' => 'Package name cannot exceed 250 characters.',
            'package_amount.required' => 'Package amount is required.',
            'package_amount.integer' => 'Package amount must be a valid number.',
            'package_amount.min' => 'Package amount must be at least 0.',
            'package_amount.max' => 'Package amount cannot exceed 999,999.',
            'valid_from_date.date' => 'Valid from date must be a valid date.',
            'valid_to_date.date' => 'Valid to date must be a valid date.',
            'valid_to_date.after_or_equal' => 'Valid to date must be after or equal to valid from date.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be either 0 (Not Active) or 1 (Active).',
        ]);

        try {
            $packageModel->update($validated);
            
            Log::info('Package updated successfully', [
                'package_id' => $packageModel->id,
                'package_name' => $packageModel->package_name,
                'package_amount' => $packageModel->package_amount
            ]);
            
            return back()->with('success', 'Package updated successfully!');
        } catch (\Exception $e) {
            Log::error('Package update failed', [
                'error' => $e->getMessage(),
                'package_id' => $package,
                'data' => $validated
            ]);
            
            return back()->withErrors(['error' => 'Failed to update package. Please try again.']);
        }
    })->name('package-offers.update');
    
    Route::delete('/package-offers/{package}', function ($package) {
        try {
            $packageModel = \App\Models\PackageOffer::findOrFail($package);
            $packageName = $packageModel->package_name;
            
            $packageModel->delete();
            
            Log::info('Package deleted successfully', [
                'package_id' => $package,
                'package_name' => $packageName
            ]);
            
            return back()->with('success', 'Package deleted successfully!');
        } catch (\Exception $e) {
            Log::error('Package deletion failed', [
                'error' => $e->getMessage(),
                'package_id' => $package
            ]);
            
            return back()->withErrors(['error' => 'Failed to delete package. Please try again.']);
        }
    })->name('package-offers.destroy');
    
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
            Log::error('Error fetching members: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch members',
                'members' => []
            ], 500);
        }
    })->name('api.members');
});

// Debug route for CSRF testing
Route::get('/debug-csrf', function () {
    return response()->json([
        'csrf_token' => csrf_token(),
        'session_id' => session()->getId(),
        'app_key' => config('app.key'),
        'session_driver' => config('session.driver'),
    ]);
});

// API Routes - PROTECTED (accessible to authenticated users only)
Route::middleware(['auth'])->group(function () {
    // API endpoint to search for members
    Route::get('/api/search-members', function (\Illuminate\Http\Request $request) {
        try {
            $term = $request->get('term');
            
            if (!$term || strlen($term) < 2) {
                return response()->json([
                    'success' => false,
                    'message' => 'Search term must be at least 2 characters',
                    'members' => []
                ]);
            }
            
            // Simple search query - just get all members matching the search term
            $members = \App\Models\User::where('user_type', 'member')
                ->where(function ($query) use ($term) {
                    $query->where('name', 'like', '%' . $term . '%')
                        ->orWhere('email', 'like', '%' . $term . '%')
                        ->orWhere('phone', 'like', '%' . $term . '%')
                        ->orWhere('referral_code', 'like', '%' . $term . '%');
                })
                ->select(['id', 'name', 'email', 'phone', 'member_type', 'referral_code', 'created_at', 'user_type'])
                ->orderByRaw("
                    CASE 
                        WHEN member_type = 'paid' THEN 1 
                        WHEN member_type = 'free' THEN 2
                        ELSE 3
                    END, 
                    name ASC
                ")
                ->limit(20)
                ->get();
            
            return response()->json([
                'success' => true,
                'members' => $members,
                'total' => $members->count(),
                'breakdown' => [
                    'paid' => $members->where('member_type', 'paid')->count(),
                    'free' => $members->where('member_type', 'free')->count(),
                ]
            ]);
            
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Member search API error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while searching for members',
                'members' => []
            ], 500);
        }
    })->name('api.search-members');
    
    // API endpoint to get all members (for modal component)
    Route::get('/api/members', function () {
        try {
            // Get all members for the modal component  
            $members = \App\Models\User::where('user_type', 'member')
                ->select([
                    'id', 'name', 'email', 'phone', 'member_type', 'referral_code', 
                    'created_at', 'user_type'
                ])
                ->orderByRaw("
                    CASE 
                        WHEN member_type = 'paid' THEN 1 
                        WHEN member_type = 'free' THEN 2
                        ELSE 3
                    END, 
                    name ASC
                ")
                ->get()
                ->map(function ($member) {
                    // Add first_name and last_name fields for compatibility with modal component
                    $member->first_name = $member->name;
                    $member->last_name = '';
                    return $member;
                });
            
            return response()->json([
                'success' => true,
                'members' => $members,
                'total' => $members->count(),
                'breakdown' => [
                    'paid' => $members->where('member_type', 'paid')->count(),
                    'free' => $members->where('member_type', 'free')->count(),
                ]
            ]);
            
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Members API error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching members',
                'members' => []
            ], 500);
        }
    })->name('api.members');
    
    // API endpoint to request OTP for order
    Route::post('/api/request-otp', function (\Illuminate\Http\Request $request) {
        try {
            $validated = $request->validate([
                'tableId' => 'required|integer|exists:restaurant_tables,id',
                'memberId' => 'required|integer|exists:users,id'
            ]);

            // Find the order for this table
            $order = \App\Models\Order::where('tableId', $validated['tableId'])
                ->where('tableOccupiedStatus', 1)
                ->where('deleteStatus', 0)
                ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active order found for this table'
                ], 404);
            }

            // Find the member
            $member = \App\Models\User::find($validated['memberId']);
            if (!$member) {
                return response()->json([
                    'success' => false,
                    'message' => 'Member not found'
                ], 404);
            }

            // Generate 6-digit OTP
            $otp = sprintf('%06d', mt_rand(0, 999999));

            // Update order with OTP and member info
            $order->update([
                'txn_otp' => $otp,
                'memberUserId' => $member->id,
                'free_paid_member_status' => $member->member_type === 'paid' ? 1 : 0
            ]);

            // Email data for member
            $memberEmailData = [
                'to' => $member->email,
                'subject' => 'Transaction OTP - Serve Cafe',
                'otp' => $otp,
                'order_id' => $order->id,
                'date' => now()->format('Y-m-d H:i:s'),
                'member_name' => $member->name
            ];

            // Email data for admin
            $adminEmail = env('ADMIN_EMAIL', 'admin@servecafe.com');
            $adminEmailData = [
                'to' => $adminEmail,
                'subject' => 'New OTP Generated - Order #' . $order->id,
                'otp' => $otp,
                'order_id' => $order->id,
                'date' => now()->format('Y-m-d H:i:s'),
                'member_name' => $member->name,
                'member_email' => $member->email
            ];

            // Log emails for now (implement actual email sending later)
            \Illuminate\Support\Facades\Log::info('OTP Email to Member', $memberEmailData);
            \Illuminate\Support\Facades\Log::info('OTP Email to Admin', $adminEmailData);

            return response()->json([
                'success' => true,
                'message' => 'OTP generated and sent successfully',
                'orderId' => $order->id
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('OTP request error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while generating OTP'
            ], 500);
        }
    })->name('api.request-otp');
    
    // API endpoint to get member transactions for balance calculation
    Route::get('/api/member-transactions/{memberId}', function ($memberId) {
        try {
            $member = \App\Models\User::find($memberId);
            if (!$member) {
                return response()->json([
                    'success' => false,
                    'message' => 'Member not found',
                    'transactions' => []
                ], 404);
            }

            // Get transactions where user is either sender or receiver
            $transactions = \App\Models\Transaction::where(function($query) use ($memberId) {
                    $query->where('transaction_to_id', $memberId)
                          ->orWhere('transaction_from_id', $memberId);
                })
                ->select(['id', 'amount', 'debit_credit', 'transaction_to_id', 'transaction_from_id', 'transaction_nature', 'created_at'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'transactions' => $transactions,
                'member' => [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email
                ]
            ]);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Member transactions API error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching member transactions',
                'transactions' => []
            ], 500);
        }
    })->name('api.member-transactions');
    
    // API endpoint to get member balance
    Route::get('/api/member-balance/{memberId}', function ($memberId) {
        try {
            $member = \App\Models\User::find($memberId);
            if (!$member) {
                return response()->json([
                    'success' => false,
                    'message' => 'Member not found',
                    'balance' => 0
                ], 404);
            }

            // Use the existing User model method to get wallet balance
            $balance = $member->getCurrentWalletBalance();

            return response()->json([
                'success' => true,
                'balance' => $balance,
                'member' => [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email
                ]
            ]);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Member balance API error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching member balance',
                'balance' => 0
            ], 500);
        }
    })->name('api.member-balance');
});

// Simple test route to bypass any redirect issues
Route::get('/test-login', function () {
    return Inertia::render('Auth/Login', [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
    ]);
});

// Member Dashboard Routes - PROTECTED
Route::middleware(['auth', 'user.type:member'])->group(function () {
    // Free Member Dashboard Route
    Route::get('/member-f-dashboard', [MemberDashboardController::class, 'freeMemberDashboard'])
        ->name('member.f.dashboard');

    // Paid Member Dashboard Route
    Route::get('/member-p-dashboard', [MemberDashboardController::class, 'paidMemberDashboard'])
        ->name('member.p.dashboard');
});

// Member-Only Routes - PROTECTED
Route::middleware(['auth', 'user.type:member'])->group(function () {
    // Member Badges Route (Paid Members Only)
    Route::get('/member-badges', [MemberDashboardController::class, 'memberBadges'])
        ->name('member.badges');

    // Support Routes
    Route::get('/support', [SupportController::class, 'index'])->name('support');

    // Privacy Policy and Terms Routes
    Route::get('/privacy-policy', [PrivacyPolicyController::class, 'index'])->name('privacy.policy');
    Route::get('/terms-of-service', [TermsOfServiceController::class, 'index'])->name('terms.service');

    // Share Referral Routes
    Route::get('/share-referral', [ShareReferralController::class, 'index'])->name('share.referral');

    // Tree View Routes
    Route::get('/tree-view', [TreeViewController::class, 'index'])->name('tree.view');
    Route::post('/api/tree-view/get-children', [TreeViewController::class, 'getChildren'])->name('tree.view.get.children');

    // Transactions Route (Paid Members Only)
    Route::get('/transactions', [TransactionController::class, 'paidMemberTransactions'])
        ->name('transactions');

    // Free Member Transactions Route (Free Members Only)
    Route::get('/free-transactions', [TransactionController::class, 'freeMemberTransactions'])
        ->name('free.transactions');

    // Free Member Orders Route (Free Members Only)
    Route::get('/free-orders', [MemberOrderController::class, 'freeMemberOrders'])
        ->name('free.orders');

    // Paid Member Orders Route (Paid Members Only)
    Route::get('/paid-orders', [MemberOrderController::class, 'paidMemberOrders'])
        ->name('paid.orders');
});

// Member Transactions Route (Super Admin Only) - PROTECTED
Route::get('/member-transactions/{encodedUserId}', [TransactionController::class, 'memberTransactions'])
    ->middleware(['auth', 'user.type:headoffice', 'role:super_user,admin_user'])
    ->name('member.transactions');

// Fund Topup Route (Super Admin Only) - PROTECTED
Route::post('/fund-topup/{encodedUserId}', [TransactionController::class, 'fundTopup'])
    ->middleware(['auth', 'user.type:headoffice', 'role:super_user,admin_user'])
    ->name('fund.topup');

// Test dashboard route with proper Inertia response (keeping for backward compatibility)
Route::get('/test-dashboard', function () {
    $user = Auth::user();
    
    if (!$user) {
        return redirect()->route('login')->with('error', 'Please log in to access the dashboard.');
    }
    
    // Route based on user type
    switch ($user->user_type) {
        case 'headoffice':
            return Inertia::render('HeadOffice/Super/SuperUserDashboard', [
                'auth' => ['user' => $user],
                'stats' => []
            ]);
        case 'brandoffice':
            return Inertia::render('HeadOffice/Admin/AdminUserDashboard', [
                'auth' => ['user' => $user],
                'stats' => []
            ]);
        case 'member':
            // Route based on member_type
            switch ($user->member_type) {
                case 'paid':
                    return redirect()->route('member.p.dashboard');
                case 'free':
                    return redirect()->route('member.f.dashboard');
                default:
                    return redirect()->route('login')->with('error', 'Invalid member type.');
            }
        default:
            return redirect()->route('login')->with('error', 'Invalid user type.');
    }
});

// Debug route for JSON response (for testing only)
Route::get('/debug-user', function () {
    $user = Auth::user();
    
    if (!$user) {
        return response()->json(['error' => 'Not authenticated'], 401);
    }
    
    return response()->json([
        'user' => $user,
        'user_type' => $user->user_type,
        'member_type' => $user->member_type ?? 'N/A',
        'primary_role' => $user->primary_role ?? 'N/A'
    ]);
});

// Profile Routes (Common for all members)
Route::middleware(['auth'])->group(function () {
    // Change Password
    Route::get('/change-password', [ProfileController::class, 'changePassword'])->name('profile.change-password');
    Route::post('/change-password', [ProfileController::class, 'updatePassword'])->name('profile.update-password');
    
    // Profile Settings
    Route::get('/profile-settings', [ProfileController::class, 'profileSettings'])->name('profile.settings');
    Route::post('/profile-settings', [ProfileController::class, 'updateProfile'])->name('profile.update');
    
    // Change Referral Code
    Route::get('/change-referral', [ProfileController::class, 'changeReferral'])->name('profile.change-referral');
    Route::post('/change-referral', [ProfileController::class, 'updateReferral'])->name('profile.update-referral');
});

// Registration with referral code support
Route::get('/join/{referral_code}', [RegisterController::class, 'showRegistrationForm'])->name('register.with.referral');
Route::post('/join/{referral_code}', [RegisterController::class, 'register'])->name('register.submit');

// Cron Routes
Route::get('/cron/activate-member-package', [MemberActivationController::class, 'activateMemberPackage'])->name('cron.activate.member.package');
Route::get('/cron/leadership-chaque-match', [LeadershipChaqueMatchController::class, 'cronLeadershipChaqueMatch'])->name('cron.leadership.chaque.match');
Route::get('/api/latest-active-package', [MemberActivationController::class, 'getLatestActivePackage'])->name('api.latest.active.package');

require __DIR__.'/auth.php';
