<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get user's primary role
        $primaryRole = $user->primary_role;
        
        if (!$primaryRole) {
            return redirect()->route('login')->with('error', 'No role assigned to user.');
        }

        // Route based on user type and role
        switch ($user->user_type) {
            case 'headoffice':
                return $this->handleHeadOfficeDashboard($user, $primaryRole);
            case 'brandoffice':
                return $this->handleBrandOfficeDashboard($user, $primaryRole);
            case 'member':
                return $this->handleMemberDashboard($user, $primaryRole);
            default:
                return redirect()->route('login')->with('error', 'Invalid user type.');
        }
    }

    private function handleHeadOfficeDashboard($user, $role)
    {
        $stats = $this->getHeadOfficeStats();
        
        switch ($role->name) {
            case 'super_user':
                return Inertia::render('HeadOffice/Super/SuperUserDashboard', [
                    'user' => $user,
                    'stats' => $stats
                ]);
            case 'admin_user':
                return Inertia::render('HeadOffice/Admin/AdminUserDashboard', [
                    'user' => $user,
                    'stats' => $stats
                ]);
            case 'account_user':
                return Inertia::render('HeadOffice/Account/AccountUserDashboard', [
                    'user' => $user,
                    'stats' => $stats
                ]);
            case 'billing_user':
                return Inertia::render('HeadOffice/Billing/BillingUserDashboard', [
                    'user' => $user,
                    'stats' => $stats
                ]);
            default:
                return redirect()->route('login')->with('error', 'Invalid HeadOffice role.');
        }
    }

    private function handleBrandOfficeDashboard($user, $role)
    {
        $stats = $this->getBrandOfficeStats($user);
        $branch = $user->branch;
        
        switch ($role->name) {
            case 'branch_admin_user':
                return Inertia::render('BrandOffice/Admin/BranchAdminDashboard', [
                    'auth' => ['user' => $user],
                    'stats' => $stats,
                    'branch' => $branch
                ]);
            case 'branch_billing_user':
                return Inertia::render('BrandOffice/Billing/BranchBillingDashboard', [
                    'auth' => ['user' => $user],
                    'stats' => $stats,
                    'branch' => $branch
                ]);
            default:
                return redirect()->route('login')->with('error', 'Invalid BrandOffice role.');
        }
    }

    private function handleMemberDashboard($user, $role)
    {
        $stats = $this->getMemberStats($user);
        $wallet = $user->wallet;
        $referrals = $user->referrals;
        
        switch ($role->name) {
            case 'paid_member':
                return Inertia::render('Members/PaidMember/PaidMemberDashboard', [
                    'auth' => ['user' => $user],
                    'stats' => $stats,
                    'wallet' => $wallet,
                    'referrals' => $referrals
                ]);
            case 'free_member':
                return Inertia::render('Members/FreeMember/FreeMemberDashboard', [
                    'auth' => ['user' => $user],
                    'stats' => $stats,
                    'referrals' => $referrals
                ]);
            default:
                return redirect()->route('login')->with('error', 'Invalid Member role.');
        }
    }

    private function getHeadOfficeStats()
    {
        return [
            'totalBranches' => \App\Models\Branch::count(),
            'activeBranches' => \App\Models\Branch::where('is_active', true)->count(),
            'totalUsers' => \App\Models\User::count(),
            'totalOrders' => \App\Models\Order::count(),
            'totalRevenue' => \App\Models\Order::sum('total_amount') ?: 0,
            'pendingOrders' => \App\Models\Order::where('status', 'pending')->count(),
            'completedOrders' => \App\Models\Order::where('status', 'completed')->count(),
            'commissionsPaid' => \App\Models\CommissionTransaction::where('status', 'paid')->sum('commission_amount') ?: 0,
            'pendingCommissions' => \App\Models\CommissionTransaction::where('status', 'pending')->sum('commission_amount') ?: 0,
            'totalWalletBalance' => \App\Models\Wallet::sum('balance') ?: 0,
            'todayRevenue' => \App\Models\Order::whereDate('created_at', today())->sum('total_amount') ?: 0,
            'pendingPayments' => \App\Models\Order::where('status', 'pending')->count(),
            'invoicesGenerated' => \App\Models\Order::whereDate('created_at', today())->count(),
            'paymentSuccessRate' => 95, // Mock data
        ];
    }

    private function getBrandOfficeStats($user)
    {
        $branchId = $user->branch_id;
        
        return [
            'todayRevenue' => \App\Models\Order::where('branch_id', $branchId)
                ->whereDate('created_at', today())
                ->sum('total_amount'),
            'pendingOrders' => \App\Models\Order::where('branch_id', $branchId)
                ->where('status', 'pending')
                ->count(),
            'walletPayments' => \App\Models\Order::where('branch_id', $branchId)
                ->where('payment_method', 'wallet')
                ->whereDate('created_at', today())
                ->count(),
            'cashPayments' => \App\Models\Order::where('branch_id', $branchId)
                ->where('payment_method', 'cash')
                ->whereDate('created_at', today())
                ->count(),
        ];
    }

    private function getMemberStats($user)
    {
        return [
            'totalReferrals' => $user->referrals()->count(),
            'totalCommissions' => \App\Models\CommissionTransaction::where('upline_user_id', $user->id)
                ->where('status', 'paid')
                ->sum('commission_amount'),
            'monthlyOrders' => $user->orders()
                ->whereMonth('created_at', now()->month)
                ->count(),
        ];
    }
}