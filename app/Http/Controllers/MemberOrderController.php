<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MemberOrderController extends Controller
{
    /**
     * Display orders for free members
     */
    public function freeMemberOrders(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access orders.');
        }
        
        // Check if user is a free member
        if ($user->user_type !== 'member' || $user->member_type !== 'free') {
            return redirect()->route('login')->with('error', 'Access denied. This page is for free members only.');
        }
        
        // Get search filters
        $orderId = $request->get('order_id');
        $fromDate = $request->get('from_date');
        $toDate = $request->get('to_date');
        
        // Build query for orders where user is the member
        $query = \App\Models\Order::where('memberUserId', $user->id)
            ->where('deleteStatus', 0)
            ->with(['headOffice', 'branch', 'creator'])
            ->orderBy('created_at', 'desc');
        
        // Apply filters
        if ($orderId) {
            $query->where('id', 'like', '%' . $orderId . '%');
        }
        
        if ($fromDate) {
            $query->whereDate('created_at', '>=', $fromDate);
        }
        
        if ($toDate) {
            $query->whereDate('created_at', '<=', $toDate);
        }
        
        // If no search filters, limit to 100 latest records
        if (!$orderId && !$fromDate && !$toDate) {
            $query->limit(100);
        }
        
        $orders = $query->get();
        
        return Inertia::render('Members/FreeMember/TrackOrdersFree', [
            'auth' => ['user' => $user],
            'orders' => $orders,
            'filters' => [
                'order_id' => $orderId,
                'from_date' => $fromDate,
                'to_date' => $toDate,
            ]
        ]);
    }

    /**
     * Display orders for paid members
     */
    public function paidMemberOrders(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access orders.');
        }
        
        // Check if user is a paid member
        if ($user->user_type !== 'member' || $user->member_type !== 'paid') {
            return redirect()->route('login')->with('error', 'Access denied. This page is for paid members only.');
        }
        
        // Get search filters
        $orderId = $request->get('order_id');
        $fromDate = $request->get('from_date');
        $toDate = $request->get('to_date');
        
        // Build query for orders where user is the member
        $query = \App\Models\Order::where('memberUserId', $user->id)
            ->where('deleteStatus', 0)
            ->with(['headOffice', 'branch', 'creator'])
            ->orderBy('created_at', 'desc');
        
        // Apply filters
        if ($orderId) {
            $query->where('id', 'like', '%' . $orderId . '%');
        }
        
        if ($fromDate) {
            $query->whereDate('created_at', '>=', $fromDate);
        }
        
        if ($toDate) {
            $query->whereDate('created_at', '<=', $toDate);
        }
        
        // If no search filters, limit to 100 latest records
        if (!$orderId && !$fromDate && !$toDate) {
            $query->limit(100);
        }
        
        $orders = $query->get();
        
        return Inertia::render('Members/PaidMember/TrackOrdersPaid', [
            'auth' => ['user' => $user],
            'orders' => $orders,
            'filters' => [
                'order_id' => $orderId,
                'from_date' => $fromDate,
                'to_date' => $toDate,
            ]
        ]);
    }
}
