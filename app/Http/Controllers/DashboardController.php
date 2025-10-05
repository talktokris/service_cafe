<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // This controller is now only for headoffice users (enforced by middleware)
        // Get user's primary role
        $primaryRole = $user->primary_role;
        
        if (!$primaryRole) {
            return redirect()->route('login')->with('error', 'No role assigned to user.');
        }

        // Only handle headoffice users (middleware ensures this)
        if ($user->user_type === 'headoffice') {
            return $this->handleHeadOfficeDashboard($user, $primaryRole);
        }
        
        // This should never be reached due to middleware, but just in case
        return redirect()->route('login')->with('error', 'Access denied. This dashboard is for admin users only.');
    }

    private function handleHeadOfficeDashboard($user, $role)
    {
        $stats = $this->getHeadOfficeStats();
        
        switch ($role->name) {
            case 'super_user':
                return Inertia::render('HeadOffice/Super/SuperUserDashboard', [
                    'auth' => ['user' => $user],
                    'stats' => $stats
                ]);
            case 'admin_user':
                return Inertia::render('HeadOffice/Admin/AdminUserDashboard', [
                    'auth' => ['user' => $user],
                    'stats' => $stats
                ]);
            case 'account_user':
                return Inertia::render('HeadOffice/Account/AccountUserDashboard', [
                    'auth' => ['user' => $user],
                    'stats' => $stats
                ]);
            case 'billing_user':
                return Inertia::render('HeadOffice/Billing/BillingUserDashboard', [
                    'auth' => ['user' => $user],
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
        
        // Route based on member_type instead of role
        switch ($user->member_type) {
            case 'paid':
                return Inertia::render('Members/PaidMember/PaidMemberDashboard', [
                    'auth' => ['user' => $user],
                    'stats' => $stats,
                    'wallet' => $wallet,
                    'walletBalance' => $user->getCurrentWalletBalance(),
                    'referrals' => $referrals
                ]);
            case 'free':
                return Inertia::render('Members/FreeMember/FreeMemberDashboard', [
                    'auth' => ['user' => $user],
                    'stats' => $stats,
                    'walletBalance' => $user->getCurrentWalletBalance(),
                    'referrals' => $referrals
                ]);
            default:
                return redirect()->route('login')->with('error', 'Invalid member type.');
        }
    }

    private function getHeadOfficeStats()
    {
        return [
            'totalBranches' => \App\Models\OfficeProfile::where('profileType', 'BranchOffice')->where('deleteStatus', 0)->count(),
            'activeBranches' => \App\Models\OfficeProfile::where('profileType', 'BranchOffice')->where('activeStatus', 1)->where('deleteStatus', 0)->count(),
            'totalUsers' => \App\Models\User::where('deleteStatus', 0)->count(),
            'totalOrders' => \App\Models\Order::where('deleteStatus', 0)->count(),
            'totalRevenue' => \App\Models\Order::where('deleteStatus', 0)->sum('sellingPrice') ?: 0,
            'pendingOrders' => \App\Models\Order::where('paymentStatus', 0)->where('deleteStatus', 0)->count(),
            'completedOrders' => \App\Models\Order::where('paymentStatus', 1)->where('deleteStatus', 0)->count(),
            'commissionsPaid' => \App\Models\Order::where('deleteStatus', 0)->sum('userCommissionAmount') ?: 0,
            'pendingCommissions' => \App\Models\Order::where('paymentStatus', 0)->where('deleteStatus', 0)->sum('userCommissionAmount') ?: 0,
            'totalWalletBalance' => \App\Models\Wallet::sum('balance') ?: 0,
            'todayRevenue' => \App\Models\Order::whereDate('created_at', today())->where('deleteStatus', 0)->sum('sellingPrice') ?: 0,
            'pendingPayments' => \App\Models\Order::where('paymentStatus', 0)->where('deleteStatus', 0)->count(),
            'invoicesGenerated' => \App\Models\Order::whereDate('created_at', today())->where('deleteStatus', 0)->count(),
            'paymentSuccessRate' => 95, // Mock data
        ];
    }

    private function getBrandOfficeStats($user)
    {
        $branchId = $user->branchId;
        
        return [
            'todayRevenue' => \App\Models\Order::where('branchId', $branchId)
                ->whereDate('created_at', today())
                ->where('deleteStatus', 0)
                ->sum('sellingPrice'),
            'pendingOrders' => \App\Models\Order::where('branchId', $branchId)
                ->where('paymentStatus', 0)
                ->where('deleteStatus', 0)
                ->count(),
            'walletPayments' => \App\Models\Order::where('branchId', $branchId)
                ->where('paymentType', 'online')
                ->whereDate('created_at', today())
                ->where('deleteStatus', 0)
                ->count(),
            'cashPayments' => \App\Models\Order::where('branchId', $branchId)
                ->where('paymentType', 'cash')
                ->whereDate('created_at', today())
                ->where('deleteStatus', 0)
                ->count(),
        ];
    }

    private function getMemberStats($user)
    {
        return [
            'totalReferrals' => $user->referrals()->count(),
            'totalCommissions' => \App\Models\Order::where('memberUserId', $user->id)
                ->where('paymentStatus', 1)
                ->where('deleteStatus', 0)
                ->sum('userCommissionAmount'),
            'monthlyOrders' => \App\Models\Order::where('memberUserId', $user->id)
                ->whereMonth('created_at', now()->month)
                ->where('deleteStatus', 0)
                ->count(),
        ];
    }
}