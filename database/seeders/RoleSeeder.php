<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            // HeadOffice Roles
            [
                'name' => 'super_user',
                'display_name' => 'Super User',
                'description' => 'Full system access with all permissions',
                'permissions' => json_encode(['*']),
                'user_type' => 'headoffice',
            ],
            [
                'name' => 'admin_user',
                'display_name' => 'Admin User',
                'description' => 'Administrative access to manage system settings',
                'permissions' => json_encode(['users.manage', 'branches.manage', 'reports.view', 'settings.manage']),
                'user_type' => 'headoffice',
            ],
            [
                'name' => 'account_user',
                'display_name' => 'Account User',
                'description' => 'Financial and accounting access',
                'permissions' => json_encode(['reports.view', 'transactions.view', 'commissions.manage', 'wallets.manage']),
                'user_type' => 'headoffice',
            ],
            [
                'name' => 'billing_user',
                'display_name' => 'Billing User',
                'description' => 'Billing and payment processing access',
                'permissions' => json_encode(['billing.manage', 'payments.process', 'invoices.create']),
                'user_type' => 'headoffice',
            ],
            
            // BrandOffice Roles
            [
                'name' => 'branch_admin_user',
                'display_name' => 'Branch Admin User',
                'description' => 'Branch management and operations',
                'permissions' => json_encode(['orders.manage', 'staff.manage', 'inventory.manage', 'reports.view']),
                'user_type' => 'brandoffice',
            ],
            [
                'name' => 'branch_billing_user',
                'display_name' => 'Branch Billing User',
                'description' => 'Branch billing and payment processing',
                'permissions' => json_encode(['orders.manage', 'payments.process', 'billing.manage']),
                'user_type' => 'brandoffice',
            ],
            
            // Member Roles
            [
                'name' => 'paid_member',
                'display_name' => 'Paid Member',
                'description' => 'Paid member with wallet and MLM benefits',
                'permissions' => json_encode(['orders.create', 'wallet.use', 'referrals.manage', 'commissions.view']),
                'user_type' => 'member',
            ],
            [
                'name' => 'free_member',
                'display_name' => 'Free Member',
                'description' => 'Free member with MLM tracking',
                'permissions' => json_encode(['orders.create', 'referrals.manage', 'commissions.view']),
                'user_type' => 'member',
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
