<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Branch;
use App\Models\Wallet;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get roles
        $superUserRole = Role::where('name', 'super_user')->first();
        $adminUserRole = Role::where('name', 'admin_user')->first();
        $accountUserRole = Role::where('name', 'account_user')->first();
        $billingUserRole = Role::where('name', 'billing_user')->first();
        $branchAdminRole = Role::where('name', 'branch_admin_user')->first();
        $branchBillingRole = Role::where('name', 'branch_billing_user')->first();
        $paidMemberRole = Role::where('name', 'paid_member')->first();
        $freeMemberRole = Role::where('name', 'free_member')->first();

        // Get branches
        $mainBranch = Branch::where('code', 'BR001')->first();
        $mallBranch = Branch::where('code', 'BR002')->first();

        // HeadOffice Users
        $superUser = User::create([
            'name' => 'Super Admin',
            'email' => 'super@servecafe.com',
            'password' => Hash::make('password'),
            'phone' => '+1-555-0001',
            'address' => 'Corporate Headquarters',
            'user_type' => 'headoffice',
            'referral_code' => 'SUPER001',
            'is_active' => true,
        ]);
        $superUser->roles()->attach($superUserRole);

        $adminUser = User::create([
            'name' => 'System Admin',
            'email' => 'admin@servecafe.com',
            'password' => Hash::make('password'),
            'phone' => '+1-555-0002',
            'address' => 'Corporate Headquarters',
            'user_type' => 'headoffice',
            'referral_code' => 'ADMIN001',
            'is_active' => true,
        ]);
        $adminUser->roles()->attach($adminUserRole);

        $accountUser = User::create([
            'name' => 'Account Manager',
            'email' => 'account@servecafe.com',
            'password' => Hash::make('password'),
            'phone' => '+1-555-0003',
            'address' => 'Corporate Headquarters',
            'user_type' => 'headoffice',
            'referral_code' => 'ACCT001',
            'is_active' => true,
        ]);
        $accountUser->roles()->attach($accountUserRole);

        // BrandOffice Users
        $branchAdmin = User::create([
            'name' => 'Branch Manager - Downtown',
            'email' => 'branch.admin@servecafe.com',
            'password' => Hash::make('password'),
            'phone' => '+1-555-0101',
            'address' => '123 Main Street, Downtown',
            'user_type' => 'brandoffice',
            'branch_id' => $mainBranch->id,
            'referral_code' => 'BRADM001',
            'is_active' => true,
        ]);
        $branchAdmin->roles()->attach($branchAdminRole);

        $branchBilling = User::create([
            'name' => 'Branch Billing - Mall',
            'email' => 'branch.billing@servecafe.com',
            'password' => Hash::make('password'),
            'phone' => '+1-555-0102',
            'address' => '456 Shopping Mall, West Side',
            'user_type' => 'brandoffice',
            'branch_id' => $mallBranch->id,
            'referral_code' => 'BRBIL001',
            'is_active' => true,
        ]);
        $branchBilling->roles()->attach($branchBillingRole);

        // Paid Members (with wallets)
        $paidMember1 = User::create([
            'name' => 'John Customer',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
            'phone' => '+1-555-1001',
            'address' => '100 Customer Street',
            'user_type' => 'member',
            'member_type' => 'paid',
            'referral_code' => 'PAID001',
            'is_active' => true,
        ]);
        $paidMember1->roles()->attach($paidMemberRole);
        
        // Create wallet for paid member
        Wallet::create([
            'user_id' => $paidMember1->id,
            'balance' => 100.00,
            'total_deposited' => 100.00,
            'total_spent' => 0.00,
        ]);

        $paidMember2 = User::create([
            'name' => 'Jane Customer',
            'email' => 'jane@example.com',
            'password' => Hash::make('password'),
            'phone' => '+1-555-1002',
            'address' => '200 Customer Avenue',
            'user_type' => 'member',
            'member_type' => 'paid',
            'referral_code' => 'PAID002',
            'referred_by' => $paidMember1->id, // Referred by John
            'is_active' => true,
        ]);
        $paidMember2->roles()->attach($paidMemberRole);
        
        // Create wallet for paid member
        Wallet::create([
            'user_id' => $paidMember2->id,
            'balance' => 50.00,
            'total_deposited' => 50.00,
            'total_spent' => 0.00,
        ]);

        // Free Members
        $freeMember1 = User::create([
            'name' => 'Bob Walker',
            'email' => 'bob@example.com',
            'password' => Hash::make('password'),
            'phone' => '+1-555-2001',
            'address' => '300 Walker Lane',
            'user_type' => 'member',
            'member_type' => 'free',
            'referral_code' => 'FREE001',
            'referred_by' => $paidMember1->id, // Referred by John
            'is_active' => true,
        ]);
        $freeMember1->roles()->attach($freeMemberRole);

        $freeMember2 = User::create([
            'name' => 'Alice Walker',
            'email' => 'alice@example.com',
            'password' => Hash::make('password'),
            'phone' => '+1-555-2002',
            'address' => '400 Walker Street',
            'user_type' => 'member',
            'member_type' => 'free',
            'referral_code' => 'FREE002',
            'referred_by' => $paidMember2->id, // Referred by Jane
            'is_active' => true,
        ]);
        $freeMember2->roles()->attach($freeMemberRole);
    }
}
