<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Branch;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function createTestUsers()
    {
        // Get roles and branches
        $superUserRole = Role::where('name', 'super_user')->first();
        $adminUserRole = Role::where('name', 'admin_user')->first();
        $accountUserRole = Role::where('name', 'account_user')->first();
        $billingUserRole = Role::where('name', 'billing_user')->first();
        $branchAdminRole = Role::where('name', 'branch_admin_user')->first();
        $branchBillingRole = Role::where('name', 'branch_billing_user')->first();
        $paidMemberRole = Role::where('name', 'paid_member')->first();
        $freeMemberRole = Role::where('name', 'free_member')->first();
        
        $mainBranch = Branch::where('code', 'BR001')->first();

        // Create HeadOffice Test Users
        $superUser = User::updateOrCreate(
            ['email' => 'super@servecafe.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'phone' => '+1-555-0001',
                'address' => 'Corporate Headquarters',
                'user_type' => 'headoffice',
                'referral_code' => 'SUPER001',
                'is_active' => true,
            ]
        );
        $superUser->roles()->sync([$superUserRole->id]);

        $adminUser = User::updateOrCreate(
            ['email' => 'admin@servecafe.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password'),
                'phone' => '+1-555-0002',
                'address' => 'Corporate Headquarters',
                'user_type' => 'headoffice',
                'referral_code' => 'ADMIN001',
                'is_active' => true,
            ]
        );
        $adminUser->roles()->sync([$adminUserRole->id]);

        $accountUser = User::updateOrCreate(
            ['email' => 'account@servecafe.com'],
            [
                'name' => 'Account Manager',
                'password' => Hash::make('password'),
                'phone' => '+1-555-0003',
                'address' => 'Corporate Headquarters',
                'user_type' => 'headoffice',
                'referral_code' => 'ACCT001',
                'is_active' => true,
            ]
        );
        $accountUser->roles()->sync([$accountUserRole->id]);

        $billingUser = User::updateOrCreate(
            ['email' => 'billing@servecafe.com'],
            [
                'name' => 'Billing Manager',
                'password' => Hash::make('password'),
                'phone' => '+1-555-0004',
                'address' => 'Corporate Headquarters',
                'user_type' => 'headoffice',
                'referral_code' => 'BILL001',
                'is_active' => true,
            ]
        );
        $billingUser->roles()->sync([$billingUserRole->id]);

        // Create BrandOffice Test Users
        $branchAdmin = User::updateOrCreate(
            ['email' => 'branch.admin@servecafe.com'],
            [
                'name' => 'Branch Manager - Downtown',
                'password' => Hash::make('password'),
                'phone' => '+1-555-0101',
                'address' => '123 Main Street, Downtown',
                'user_type' => 'brandoffice',
                'branch_id' => $mainBranch->id,
                'referral_code' => 'BRADM001',
                'is_active' => true,
            ]
        );
        $branchAdmin->roles()->sync([$branchAdminRole->id]);

        $branchBilling = User::updateOrCreate(
            ['email' => 'branch.billing@servecafe.com'],
            [
                'name' => 'Branch Billing - Downtown',
                'password' => Hash::make('password'),
                'phone' => '+1-555-0102',
                'address' => '123 Main Street, Downtown',
                'user_type' => 'brandoffice',
                'branch_id' => $mainBranch->id,
                'referral_code' => 'BRBILL001',
                'is_active' => true,
            ]
        );
        $branchBilling->roles()->sync([$branchBillingRole->id]);

        // Create Member Test Users
        $paidMember1 = User::updateOrCreate(
            ['email' => 'john@example.com'],
            [
                'name' => 'John Customer',
                'password' => Hash::make('password'),
                'phone' => '+1-555-1001',
                'address' => '100 Customer Street',
                'user_type' => 'member',
                'member_type' => 'paid',
                'referral_code' => 'PAID001',
                'is_active' => true,
            ]
        );
        $paidMember1->roles()->sync([$paidMemberRole->id]);
        
        // Create wallet for paid member
        Wallet::updateOrCreate(
            ['user_id' => $paidMember1->id],
            [
                'balance' => 100.00,
                'total_deposited' => 100.00,
                'total_spent' => 0.00,
                'is_active' => true,
            ]
        );

        $paidMember2 = User::updateOrCreate(
            ['email' => 'jane@example.com'],
            [
                'name' => 'Jane Customer',
                'password' => Hash::make('password'),
                'phone' => '+1-555-1002',
                'address' => '200 Customer Avenue',
                'user_type' => 'member',
                'member_type' => 'paid',
                'referral_code' => 'PAID002',
                'referred_by' => $paidMember1->id,
                'is_active' => true,
            ]
        );
        $paidMember2->roles()->sync([$paidMemberRole->id]);
        
        // Create wallet for paid member
        Wallet::updateOrCreate(
            ['user_id' => $paidMember2->id],
            [
                'balance' => 50.00,
                'total_deposited' => 50.00,
                'total_spent' => 0.00,
                'is_active' => true,
            ]
        );

        $freeMember1 = User::updateOrCreate(
            ['email' => 'bob@example.com'],
            [
                'name' => 'Bob Walker',
                'password' => Hash::make('password'),
                'phone' => '+1-555-2001',
                'address' => '300 Walker Lane',
                'user_type' => 'member',
                'member_type' => 'free',
                'referral_code' => 'FREE001',
                'referred_by' => $paidMember1->id,
                'is_active' => true,
            ]
        );
        $freeMember1->roles()->sync([$freeMemberRole->id]);

        $freeMember2 = User::updateOrCreate(
            ['email' => 'alice@example.com'],
            [
                'name' => 'Alice Walker',
                'password' => Hash::make('password'),
                'phone' => '+1-555-2002',
                'address' => '400 Walker Street',
                'user_type' => 'member',
                'member_type' => 'free',
                'referral_code' => 'FREE002',
                'referred_by' => $paidMember2->id,
                'is_active' => true,
            ]
        );
        $freeMember2->roles()->sync([$freeMemberRole->id]);

        return response()->json([
            'message' => 'Test users created successfully!',
            'users' => [
                'HeadOffice' => [
                    'Super User' => 'super@servecafe.com',
                    'Admin User' => 'admin@servecafe.com',
                    'Account User' => 'account@servecafe.com',
                    'Billing User' => 'billing@servecafe.com',
                ],
                'BrandOffice' => [
                    'Branch Admin' => 'branch.admin@servecafe.com',
                    'Branch Billing' => 'branch.billing@servecafe.com',
                ],
                'Members' => [
                    'Paid Member 1' => 'john@example.com',
                    'Paid Member 2' => 'jane@example.com',
                    'Free Member 1' => 'bob@example.com',
                    'Free Member 2' => 'alice@example.com',
                ]
            ],
            'password' => 'password (for all users)'
        ]);
    }

    public function testUsers()
    {
        return Inertia::render('TestUsers', [
            'users' => [
                'HeadOffice' => [
                    ['name' => 'Super User', 'email' => 'super@servecafe.com', 'role' => 'Super User'],
                    ['name' => 'Admin User', 'email' => 'admin@servecafe.com', 'role' => 'Admin User'],
                    ['name' => 'Account User', 'email' => 'account@servecafe.com', 'role' => 'Account User'],
                    ['name' => 'Billing User', 'email' => 'billing@servecafe.com', 'role' => 'Billing User'],
                ],
                'BrandOffice' => [
                    ['name' => 'Branch Admin', 'email' => 'branch.admin@servecafe.com', 'role' => 'Branch Admin'],
                    ['name' => 'Branch Billing', 'email' => 'branch.billing@servecafe.com', 'role' => 'Branch Billing'],
                ],
                'Members' => [
                    ['name' => 'John Customer', 'email' => 'john@example.com', 'role' => 'Paid Member'],
                    ['name' => 'Jane Customer', 'email' => 'jane@example.com', 'role' => 'Paid Member'],
                    ['name' => 'Bob Walker', 'email' => 'bob@example.com', 'role' => 'Free Member'],
                    ['name' => 'Alice Walker', 'email' => 'alice@example.com', 'role' => 'Free Member'],
                ]
            ]
        ]);
    }
}