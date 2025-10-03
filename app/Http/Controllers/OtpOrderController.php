<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Order;
use Carbon\Carbon;

class OtpOrderController extends Controller
{
    /**
     * Display OTP orders with date filtering
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access OTP orders.');
        }
        
        // Check if user has permission to view OTP orders (head office or branch office)
        if (!in_array($user->user_type, ['headoffice', 'brandoffice'])) {
            return redirect()->route('dashboard')->with('error', 'Access denied. This page is for office staff only.');
        }
        
        // Get filter parameters
        $dateFilter = $request->get('date_filter', 'today'); // 'today' or '7days'
        $search = $request->get('search', '');
        
        // Build base query for OTP orders
        $query = Order::where('deleteStatus', 0)
            ->where('otp_status', '>', 0) // Only orders with OTP (1: Sent, 2: Verified, 3: Expired)
            ->with([
                'headOffice', 
                'branch', 
                'table', 
                'memberUser:id,first_name,last_name,email,phone,referral_code,user_type,member_type',
                'creator:id,first_name,last_name'
            ])
            ->orderBy('created_at', 'desc');
        
        // Apply office filtering based on user type
        if ($user->user_type === 'headoffice') {
            $query->where('headOfficeId', $user->headOfficeId);
        } elseif ($user->user_type === 'brandoffice') {
            $query->where('headOfficeId', $user->headOfficeId)
                  ->where('branchId', $user->branchId);
        }
        
        // Apply date filtering
        if ($dateFilter === 'today') {
            $query->whereDate('created_at', Carbon::today());
        } elseif ($dateFilter === '7days') {
            $query->whereBetween('created_at', [
                Carbon::now()->subDays(7)->startOfDay(),
                Carbon::now()->endOfDay()
            ]);
        }
        
        // Apply search filtering
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', '%' . $search . '%')
                  ->orWhere('otp_code', 'like', '%' . $search . '%')
                  ->orWhere('otp_phone', 'like', '%' . $search . '%')
                  ->orWhere('otp_email', 'like', '%' . $search . '%')
                  ->orWhereHas('memberUser', function ($memberQuery) use ($search) {
                      $memberQuery->where('first_name', 'like', '%' . $search . '%')
                                  ->orWhere('last_name', 'like', '%' . $search . '%')
                                  ->orWhere('email', 'like', '%' . $search . '%')
                                  ->orWhere('phone', 'like', '%' . $search . '%');
                  });
            });
        }
        
        $orders = $query->get();
        
        // Calculate statistics
        $totalOrders = $orders->count();
        $verifiedOrders = $orders->where('otp_status', 2)->count();
        $pendingOrders = $orders->where('otp_status', 1)->count();
        $expiredOrders = $orders->where('otp_status', 3)->count();
        
        // Transform orders data to include OTP status labels
        $ordersData = $orders->map(function ($order) {
            $orderData = $order->toArray();
            
            // Add OTP status label
            $otpStatusLabels = [
                0 => 'Not Required',
                1 => 'Sent',
                2 => 'Verified',
                3 => 'Expired'
            ];
            $orderData['otp_status_label'] = $otpStatusLabels[$order->otp_status] ?? 'Unknown';
            
            // Ensure memberUser data is properly included
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
        
        return Inertia::render('HeadOffice/Super/OtpOrders', [
            'auth' => ['user' => $user],
            'orders' => $ordersData,
            'filters' => [
                'date_filter' => $dateFilter,
                'search' => $search,
            ],
            'stats' => [
                'total' => $totalOrders,
                'verified' => $verifiedOrders,
                'pending' => $pendingOrders,
                'expired' => $expiredOrders,
            ]
        ]);
    }
    
    /**
     * Send OTP for an order
     */
    public function sendOtp(Request $request, $orderId)
    {
        try {
            $validated = $request->validate([
                'phone' => 'required|string|max:15',
                'email' => 'nullable|email|max:100',
            ]);
            
            $order = Order::findOrFail($orderId);
            
            // Generate 6-digit OTP
            $otpCode = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
            
            // Update order with OTP details
            $order->update([
                'otp_code' => $otpCode,
                'otp_phone' => $validated['phone'],
                'otp_email' => $validated['email'] ?? null,
                'otp_sent_at' => now(),
                'otp_status' => 1, // Sent
            ]);
            
            // TODO: Implement actual SMS/Email sending logic here
            // For now, we'll just log the OTP (remove in production)
            Log::info('OTP sent for order', [
                'order_id' => $orderId,
                'otp_code' => $otpCode,
                'phone' => $validated['phone'],
                'email' => $validated['email'] ?? null,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'OTP sent successfully',
                'otp_code' => $otpCode, // Remove in production
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error sending OTP', [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to send OTP. Please try again.',
            ], 500);
        }
    }
    
    /**
     * Verify OTP for an order
     */
    public function verifyOtp(Request $request, $orderId)
    {
        try {
            $validated = $request->validate([
                'otp_code' => 'required|string|size:6',
            ]);
            
            $order = Order::findOrFail($orderId);
            
            // Check if OTP is valid
            if ($order->otp_code !== $validated['otp_code']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid OTP code.',
                ], 400);
            }
            
            // Check if OTP is expired (valid for 10 minutes)
            if ($order->otp_sent_at && $order->otp_sent_at->diffInMinutes(now()) > 10) {
                $order->update(['otp_status' => 3]); // Expired
                
                return response()->json([
                    'success' => false,
                    'message' => 'OTP has expired. Please request a new one.',
                ], 400);
            }
            
            // Verify OTP
            $order->update([
                'otp_verified_at' => now(),
                'otp_status' => 2, // Verified
            ]);
            
            Log::info('OTP verified for order', [
                'order_id' => $orderId,
                'verified_at' => now(),
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'OTP verified successfully',
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error verifying OTP', [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify OTP. Please try again.',
            ], 500);
        }
    }
}