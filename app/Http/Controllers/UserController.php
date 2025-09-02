<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\OfficeProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::where('deleteStatus', 0)
            ->where('user_type', '!=', 'member')
            ->with(['headOffice', 'branchOffice', 'creator', 'roles'])
            ->orderBy('created_at', 'desc')
            ->get();

        $officeProfiles = OfficeProfile::where('deleteStatus', 0)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('HeadOffice/Super/UsersTracking', [
            'users' => $users,
            'officeProfiles' => $officeProfiles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'gender' => 'nullable|in:male,female,other',
            'country' => 'nullable|string|max:100',
            'headOfficeId' => 'required|exists:office_profiles,id',
            'branchId' => 'nullable|exists:office_profiles,id',
            'role' => 'required|string',
            'activeStatus' => 'boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Add the logged-in user's ID to the request data
        $data = $request->all();
        $data['createUserId'] = Auth::id();

        // Hash the password
        $data['password'] = Hash::make($data['password']);

        // Create the user
        $user = User::create($data);

        // Assign role
        $this->assignRole($user, $data['role']);

        // Load the created user with relationships
        $user = User::with(['headOffice', 'branchOffice', 'creator', 'roles'])
            ->find($user->id);

        return back()->with([
            'success' => 'User created successfully!',
            'user' => $user
        ])->withInput();
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user = User::with(['headOffice', 'branchOffice', 'creator', 'roles'])
            ->find($user->id);

        return response()->json($user);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'gender' => 'nullable|in:male,female,other',
            'country' => 'nullable|string|max:100',
            'headOfficeId' => 'required|exists:office_profiles,id',
            'branchId' => 'nullable|exists:office_profiles,id',
            'activeStatus' => 'boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $user->update($request->all());

        // Reload the updated user with relationships
        $user = User::with(['headOffice', 'branchOffice', 'creator', 'roles'])
            ->find($user->id);

        return back()->with([
            'success' => 'User updated successfully!',
            'user' => $user
        ])->withInput();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->update(['deleteStatus' => 1]);

        return back()->with([
            'success' => 'User deleted successfully!'
        ])->withInput();
    }

    /**
     * Reset user password
     */
    public function resetPassword(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return back()->with([
            'success' => 'Password reset successfully!'
        ])->withInput();
    }

    /**
     * Change user role
     */
    public function changeRole(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|string',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Assign new role
        $this->assignRole($user, $request->role);

        // Reload the updated user with relationships
        $user = User::with(['headOffice', 'branchOffice', 'creator', 'roles'])
            ->find($user->id);

        return back()->with([
            'success' => 'Role changed successfully!',
            'user' => $user
        ])->withInput();
    }

    /**
     * Get users for API
     */
    public function getUsers()
    {
        $users = User::where('deleteStatus', 0)
            ->where('user_type', '!=', 'member')
            ->with(['headOffice', 'branchOffice', 'creator', 'roles'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }

    /**
     * Assign role to user
     */
    private function assignRole(User $user, string $roleName)
    {
        // Map role names to role IDs
        $roleMap = [
            'Super User' => 'super_user',
            'Admin User' => 'admin_user',
            'Account User' => 'account_user',
            'Billing User' => 'billing_user',
            'Branch Admin User' => 'branch_admin_user',
            'Branch Billing User' => 'branch_billing_user',
        ];

        $roleSlug = $roleMap[$roleName] ?? null;
        
        if ($roleSlug) {
            $role = Role::where('name', $roleSlug)->first();
            if ($role) {
                $user->roles()->sync([$role->id]);
            }
        }
    }

    // Legacy methods for test users (keeping for backward compatibility)
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

        // Create HeadOffice Test Users
        $superUser = User::updateOrCreate(
            ['email' => 'super@servecafe.com'],
            [
                'name' => 'Super Admin',
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'password' => Hash::make('password'),
                'phone' => '+1-555-0001',
                'address' => 'Corporate Headquarters',
                'user_type' => 'headoffice',
                'referral_code' => 'SUPER001',
                'is_active' => true,
                'activeStatus' => 1,
                'deleteStatus' => 0,
            ]
        );
        $superUser->roles()->sync([$superUserRole->id]);

        $adminUser = User::updateOrCreate(
            ['email' => 'admin@servecafe.com'],
            [
                'name' => 'System Admin',
                'first_name' => 'System',
                'last_name' => 'Admin',
                'password' => Hash::make('password'),
                'phone' => '+1-555-0002',
                'address' => 'Corporate Headquarters',
                'user_type' => 'headoffice',
                'referral_code' => 'ADMIN001',
                'is_active' => true,
                'activeStatus' => 1,
                'deleteStatus' => 0,
            ]
        );
        $adminUser->roles()->sync([$adminUserRole->id]);

        $accountUser = User::updateOrCreate(
            ['email' => 'account@servecafe.com'],
            [
                'name' => 'Account Manager',
                'first_name' => 'Account',
                'last_name' => 'Manager',
                'password' => Hash::make('password'),
                'phone' => '+1-555-0003',
                'address' => 'Corporate Headquarters',
                'user_type' => 'headoffice',
                'referral_code' => 'ACCT001',
                'is_active' => true,
                'activeStatus' => 1,
                'deleteStatus' => 0,
            ]
        );
        $accountUser->roles()->sync([$accountUserRole->id]);

        $billingUser = User::updateOrCreate(
            ['email' => 'billing@servecafe.com'],
            [
                'name' => 'Billing Manager',
                'first_name' => 'Billing',
                'last_name' => 'Manager',
                'password' => Hash::make('password'),
                'phone' => '+1-555-0004',
                'address' => 'Corporate Headquarters',
                'user_type' => 'headoffice',
                'referral_code' => 'BILL001',
                'is_active' => true,
                'activeStatus' => 1,
                'deleteStatus' => 0,
            ]
        );
        $billingUser->roles()->sync([$billingUserRole->id]);

        return response()->json([
            'message' => 'Test users created successfully!',
            'users' => [
                'HeadOffice' => [
                    'Super User' => 'super@servecafe.com',
                    'Admin User' => 'admin@servecafe.com',
                    'Account User' => 'account@servecafe.com',
                    'Billing User' => 'billing@servecafe.com',
                ],
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
            ]
        ]);
    }
}