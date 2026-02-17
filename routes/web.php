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
use App\Http\Controllers\CronLeadershipChaqueMatchController;
use App\Http\Controllers\CronMemberActivationController;
use App\Http\Controllers\CronDistributionController;
use App\Http\Controllers\PrivacyPolicyController;
use App\Http\Controllers\TermsOfServiceController;
use App\Http\Controllers\OtpOrderController;
use App\Http\Controllers\EarningsController;
use App\Http\Controllers\CashWalletController;
use App\Http\Controllers\CashOutManagementController;
use App\Http\Controllers\CronGlobalPoolDistributionController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    // Fetch real data from database
    $paidUsersCount = \App\Models\User::where('user_type', 'member')
        ->where('member_type', 'paid')
        ->where('activeStatus', 1)
        ->count();
    
    $activeBranchesCount = \App\Models\Branch::where('is_active', 1)->count() + 1;
    
    $ordersCount = \App\Models\Order::count();
    
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'stats' => [
            'paidUsers' => $paidUsersCount,
            'activeBranches' => $activeBranchesCount,
            'ordersCount' => $ordersCount,
        ]
    ]);
});

// Public Pages Routes
Route::get('/about', function () {
    // Fetch real data from database
    $paidUsersCount = \App\Models\User::where('user_type', 'member')
        ->where('member_type', 'paid')
        ->where('activeStatus', 1)
        ->count();
    
    $activeBranchesCount = \App\Models\Branch::where('is_active', 1)->count() + 1;
    
    $ordersCount = \App\Models\Order::count();
    
    return Inertia::render('About', [
        'stats' => [
            'paidUsers' => $paidUsersCount,
            'activeBranches' => $activeBranchesCount,
            'ordersCount' => $ordersCount,
        ]
    ]);
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

Route::post('/contact', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|string|max:20',
        'subject' => 'required|string|max:255',
        'message' => 'required|string|max:1000',
        'inquiry_type' => 'required|string|in:general,support,business,partnership'
    ]);

    try {
        // Send email to info@servecafe.com
        \Mail::raw(
            "Name: {$request->name}\n" .
            "Email: {$request->email}\n" .
            "Phone: {$request->phone}\n" .
            "Subject: {$request->subject}\n" .
            "Inquiry Type: {$request->inquiry_type}\n\n" .
            "Message:\n{$request->message}",
            function ($message) use ($request) {
                $message->to('info@servecafe.com')
                        ->subject('New Contact Form Submission: ' . $request->subject)
                        ->from($request->email, $request->name);
            }
        );

        return response()->json([
            'success' => true,
            'message' => 'Thank you for your message! We\'ll get back to you soon.'
        ]);
    } catch (\Exception $e) {
        \Log::error('Contact form error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Sorry, there was an error sending your message. Please try again later.'
        ], 500);
    }
})->name('contact.submit');

// Test Users Page (Admin Only)
Route::get('/test-users', [UserController::class, 'testUsers'])
    ->middleware(['auth', 'verified', 'user.type:headoffice', 'role:super_user,admin_user'])
    ->name('test-users');

// Create Test Users (for development) (Admin Only)
Route::post('/create-test-users', [UserController::class, 'createTestUsers'])
    ->middleware(['auth', 'verified', 'user.type:headoffice', 'role:super_user,admin_user'])
    ->name('create-test-users');

// Dashboard with role-based routing - PROTECTED (Super Users Only)
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'user.type:headoffice', 'role:super_user,admin_user'])
    ->name('dashboard');

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
                        'tax_status' => 1, // Tax amount included
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
    
    // Today OTP - Table view (active unpaid orders by table, no date filter)
    Route::get('/today-otp', function (Request $request) {
        try {
            $restaurantTables = \App\Models\RestaurantTable::where('deleteStatus', 0)
                ->with(['headOffice', 'branch'])
                ->orderBy('created_at', 'desc')
                ->get();

            $orders = \App\Models\Order::where('deleteStatus', 0)
                ->where('tableOccupiedStatus', 1)
                ->where('paymentStatus', 0)
                ->with([
                    'memberUser:id,first_name,last_name,email,phone,referral_code,user_type,member_type',
                    'table',
                    'headOffice',
                    'branch'
                ])
                ->orderBy('created_at', 'desc')
                ->get();

            $orderIds = $orders->pluck('id')->toArray();
            $orderItems = [];
            if (!empty($orderIds)) {
                $orderItems = \App\Models\OrderItem::whereIn('orderId', $orderIds)
                    ->where('deleteStatus', 0)
                    ->with(['headOffice', 'branch', 'table', 'order', 'menuItem'])
                    ->get();
            }

            return Inertia::render('HeadOffice/Super/TodayOTPView', [
                'restaurantTables' => $restaurantTables,
                'orders' => $orders,
                'orderItems' => $orderItems,
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Today OTP Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return Inertia::render('HeadOffice/Super/TodayOTPView', [
                'restaurantTables' => collect([]),
                'orders' => collect([]),
                'orderItems' => collect([]),
            ]);
        }
    })->name('today-otp');
    
    // Test route to create sample OTP orders for different dates (for testing only)
    Route::get('/test-otp-data', function () {
        // Create test orders for different dates
        $dates = [
            now()->format('Y-m-d'), // Today
            now()->subDay()->format('Y-m-d'), // Yesterday
            now()->subDays(2)->format('Y-m-d'), // 2 days ago
        ];
        
        foreach ($dates as $date) {
            $order = \App\Models\Order::create([
                'headOfficeId' => 1,
                'tableId' => 1,
                'memberUserId' => 1,
                'menuName' => 'Test Order for ' . $date,
                'menuType' => 'food',
                'drinkAmount' => 0,
                'buyingPrice' => 100,
                'adminProfitPercentage' => 10,
                'adminProfitAmount' => 10,
                'userCommissionPercentage' => 5,
                'userCommissionAmount' => 5,
                'sellingPrice' => 110,
                'govTaxPercentage' => 13,
                'govTaxAmount' => 14.3,
                'sellingWithTaxPrice' => 124.3,
                'activeStatus' => 1,
                'deleteStatus' => 0,
                'free_paid_member_status' => 1,
                'txn_otp' => sprintf('%06d', mt_rand(100000, 999999)),
                'created_at' => $date . ' ' . mt_rand(10, 18) . ':' . sprintf('%02d', mt_rand(0, 59)) . ':' . sprintf('%02d', mt_rand(0, 59)),
                'updated_at' => now(),
            ]);
        }
        
        return response()->json([
            'message' => 'Test OTP orders created for dates: ' . implode(', ', $dates),
            'orders_created' => count($dates)
        ]);
    })->name('test-otp-data');
    
    
    
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

            // Send OTP email to member
            try {
                \Mail::to($member->email)->send(new \App\Mail\OtpEmail(
                    $otp,
                    $member->name,
                    $order->id,
                    now()->format('Y-m-d H:i:s'),
                    $member->email
                ));
                
                \Illuminate\Support\Facades\Log::info('OTP email sent successfully to member: ' . $member->email);
            } catch (\Exception $emailException) {
                \Illuminate\Support\Facades\Log::error('Failed to send OTP email to member: ' . $emailException->getMessage());
                
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send OTP email. Please try again.'
                ], 500);
            }

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

    // Cash Out Management Routes (Super Users Only)
    Route::get('/cash-out-management', [CashOutManagementController::class, 'index'])
        ->middleware(['auth', 'verified', 'user.type:headoffice', 'role:super_user,admin_user'])
        ->name('cash.out.management');
    Route::post('/cash-out/payout', [CashOutManagementController::class, 'processPayout'])
        ->middleware(['auth', 'verified', 'user.type:headoffice', 'role:super_user,admin_user'])
        ->name('cash.out.payout');
    Route::get('/api/cash-out-transaction/{id}', [CashOutManagementController::class, 'getTransactionDetails'])
        ->middleware(['auth', 'verified', 'user.type:headoffice', 'role:super_user,admin_user'])
        ->name('api.cash.out.transaction');
});

// Simple test route to bypass any redirect issues
Route::get('/test-login', function () {
    return Inertia::render('Auth/Login', [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
    ]);
});

// Member Dashboard Routes - PROTECTED
// Free Member Dashboard Route
Route::get('/member-f-dashboard', [MemberDashboardController::class, 'freeMemberDashboard'])
    ->middleware(['auth', 'free.member'])
    ->name('member.f.dashboard');

// Paid Member Dashboard Route
Route::get('/member-p-dashboard', [MemberDashboardController::class, 'paidMemberDashboard'])
    ->middleware(['auth', 'paid.member'])
    ->name('member.p.dashboard');

// Paid Member Routes - PROTECTED
Route::middleware(['auth', 'paid.member'])->group(function () {
    // Member Badges Route (Paid Members Only)
    Route::get('/member-badges', [MemberDashboardController::class, 'memberBadges'])
        ->name('member.badges');

    // Earnings Routes (Paid Members Only)
    Route::get('/member-earnings', [EarningsController::class, 'index'])
        ->name('member.earnings');
    Route::post('/withdrawal/create', [EarningsController::class, 'createWithdrawal'])
        ->name('withdrawal.create');
    Route::get('/api/member-earnings', [EarningsController::class, 'getEarnings'])
        ->name('api.member.earnings');

    // Cash Wallet Routes (Paid Members Only)
    Route::get('/cash-wallet', [CashWalletController::class, 'index'])
        ->name('cash.wallet');
    Route::post('/cash-out/create', [CashWalletController::class, 'createCashOut'])
        ->name('cash.out.create');
    Route::post('/transfer-purchase-balance', [CashWalletController::class, 'transferToPurchaseBalance'])
        ->name('transfer.purchase.balance');
    Route::get('/api/cash-wallet', [CashWalletController::class, 'getCashWalletData'])
        ->name('api.cash.wallet');

    // Transactions Route (Paid Members Only)
    Route::get('/transactions', [TransactionController::class, 'paidMemberTransactions'])
        ->name('transactions');

    // Paid Member Orders Route (Paid Members Only)
    Route::get('/paid-orders', [MemberOrderController::class, 'paidMemberOrders'])
        ->name('paid.orders');
});

// Free Member Routes - PROTECTED
Route::middleware(['auth', 'free.member'])->group(function () {
    // Free Member Transactions Route (Free Members Only)
    Route::get('/free-transactions', [TransactionController::class, 'freeMemberTransactions'])
        ->name('free.transactions');

    // Free Member Orders Route (Free Members Only)
    Route::get('/free-orders', [MemberOrderController::class, 'freeMemberOrders'])
        ->name('free.orders');
});

// Common Member Routes - PROTECTED (Both Free and Paid Members)
Route::middleware(['auth', 'user.type:member'])->group(function () {
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

// Test routes for middleware verification
Route::get('/test-paid-access', function () {
    $user = Auth::user();
    return response()->json([
        'message' => 'Paid member access granted!',
        'user_id' => $user->id,
        'user_type' => $user->user_type,
        'member_type' => $user->member_type
    ]);
})->middleware(['auth', 'paid.member']);

Route::get('/test-free-access', function () {
    $user = Auth::user();
    return response()->json([
        'message' => 'Free member access granted!',
        'user_id' => $user->id,
        'user_type' => $user->user_type,
        'member_type' => $user->member_type
    ]);
})->middleware(['auth', 'free.member']);

// Debug middleware test
Route::get('/debug-middleware', function () {
    $user = Auth::user();
    return response()->json([
        'authenticated' => $user ? true : false,
        'user_id' => $user ? $user->id : null,
        'user_type' => $user ? $user->user_type : null,
        'member_type' => $user ? $user->member_type : null,
        'primary_role' => $user && $user->primary_role ? $user->primary_role->name : null,
    ]);
})->middleware(['auth']);

// Profile Routes (Common for all members)
Route::middleware(['auth'])->group(function () {
    // Profile hub and sub-pages (with Profile Categories sidebar)
    Route::get('/profile', [ProfileController::class, 'profileIndex'])->name('profile.index');
    Route::get('/profile/password', [ProfileController::class, 'changePassword'])->name('profile.password');
    Route::get('/profile/referral', [ProfileController::class, 'changeReferral'])->name('profile.referral');

    // POST handlers (keep existing URLs for form actions)
    Route::post('/profile-settings', [ProfileController::class, 'updateProfile'])->name('profile.update-settings');
    Route::post('/change-password', [ProfileController::class, 'updatePassword'])->name('profile.update-password');
    Route::post('/change-referral', [ProfileController::class, 'updateReferral'])->name('profile.update-referral');

    // Redirects for old profile URLs
    Route::get('/profile-settings', fn () => redirect()->route('profile.index'))->name('profile.settings');
    Route::get('/change-password', fn () => redirect()->route('profile.password'))->name('profile.change-password');
    Route::get('/change-referral', fn () => redirect()->route('profile.referral'));
});

// Registration with referral code support
Route::get('/join/{referral_code}', [RegisterController::class, 'showRegistrationForm'])->name('register.with.referral');
Route::post('/join/{referral_code}', [RegisterController::class, 'register'])->name('register.submit');

// Cron Routes
Route::get('/cron/activate-member-package', [CronMemberActivationController::class, 'activateMemberPackage'])->name('cron.activate.member.package');
Route::get('/cron/leadership-chaque-match', [CronLeadershipChaqueMatchController::class, 'cronLeadershipChaqueMatch'])->name('cron.leadership.chaque.match');
Route::get('/cron/redistribution-distribution', [CronDistributionController::class, 'redistributionDistribution'])->name('cron.redistribution.distribution');
Route::get('/cron/global-pool-distribution', [CronGlobalPoolDistributionController::class, 'handle'])->name('cron.global.pool.distribution');

// Test route for debugging chaqueMatchDistribution
Route::get('/test-chaque-match', [CronLeadershipChaqueMatchController::class, 'testChaqueMatchDistribution'])->name('test.chaque.match');
Route::get('/api/latest-active-package', [CronMemberActivationController::class, 'getLatestActivePackage'])->name('api.latest.active.package');
Route::get('/api/check-badges', [CronMemberActivationController::class, 'checkBadges'])->name('api.check.badges');

// Debug route for checking specific user's Three Star eligibility
Route::get('/api/debug-user-three-star/{userId}', [CronMemberActivationController::class, 'debugUserThreeStarEligibility'])->name('api.debug.user-three-star');

// Manual promotion trigger route (use with caution)
Route::post('/api/manual-promotion-trigger', [CronMemberActivationController::class, 'manualPromotionTrigger'])->name('api.manual.promotion.trigger');

// Simulate user upgrade route
Route::get('/api/simulate-user-upgrade/{userId}', [CronMemberActivationController::class, 'simulateUserUpgrade'])->name('api.simulate.user.upgrade');

// Deployment info route
Route::get('/deployment-info', function() {
    $gitHash = trim(shell_exec('cd /home4/servi5ne/repositories/service_cafe && git rev-parse --short HEAD 2>/dev/null') ?? 'unknown');
    $gitBranch = trim(shell_exec('cd /home4/servi5ne/repositories/service_cafe && git rev-parse --abbrev-ref HEAD 2>/dev/null') ?? 'unknown');
    $lastCommit = trim(shell_exec('cd /home4/servi5ne/repositories/service_cafe && git log -1 --pretty=format:"%h - %s (%ci)" 2>/dev/null') ?? 'unknown');

    return response()->json([
        'current_hash' => $gitHash,
        'branch' => $gitBranch,
        'last_commit' => $lastCommit,
        'expected_hash' => '40a435b',
        'is_latest' => ($gitHash === '40a435b'),
        'server_time' => date('Y-m-d H:i:s'),
    ], JSON_PRETTY_PRINT);
})->name('deployment.info');

// CSRF token refresh route
Route::get('/refresh-csrf', function() {
    session()->regenerateToken();
    return response()->json([
        'success' => true,
        'csrf_token' => csrf_token(),
        'message' => 'CSRF token refreshed successfully'
    ]);
})->name('refresh.csrf');

// Login fix route - ensures fresh CSRF token for login
Route::get('/login-fix', function() {
    session()->regenerate();
    session()->regenerateToken();
    return redirect()->route('login')->with('success', 'Login page refreshed with new session.');
})->name('login.fix');

// Session test route - check if session is working
Route::get('/session-test', function() {
    return response()->json([
        'session_id' => session()->getId(),
        'csrf_token' => csrf_token(),
        'session_data' => session()->all(),
        'timestamp' => now()
    ]);
})->name('session.test');

// Complete session reset route
Route::get('/reset-session', function() {
    session()->flush();
    session()->regenerate();
    session()->regenerateToken();
    
    return redirect()->route('login')->with('success', 'Session completely reset. Please try logging in again.');
})->name('reset.session');

// Simple login test route
Route::post('/test-login', function(\Illuminate\Http\Request $request) {
    $email = $request->input('email');
    $password = $request->input('password');
    
    \Log::info('Test login attempt', [
        'email' => $email,
        'session_id' => session()->getId(),
        'csrf_token' => $request->input('_token'),
        'all_input' => $request->all()
    ]);
    
    if (\Illuminate\Support\Facades\Auth::attempt(['email' => $email, 'password' => $password])) {
        $request->session()->regenerate();
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => \Illuminate\Support\Facades\Auth::user(),
            'session_id' => session()->getId()
        ]);
    }
    
    return response()->json([
        'success' => false,
        'message' => 'Invalid credentials'
    ], 401);
})->name('test.login');

// Debug route to check what's happening
Route::get('/debug-login', function() {
    return response()->json([
        'session_id' => session()->getId(),
        'csrf_token' => csrf_token(),
        'auth_check' => \Illuminate\Support\Facades\Auth::check(),
        'auth_user' => \Illuminate\Support\Facades\Auth::user(),
        'session_data' => session()->all()
    ]);
})->name('debug.login');

require __DIR__.'/auth.php';
