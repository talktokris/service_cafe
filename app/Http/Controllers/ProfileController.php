<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Show change password page
     */
    public function changePassword()
    {
        return Inertia::render('Members/Profile/ChangePassword', [
            'auth' => ['user' => auth()->user()]
        ]);
    }

    /**
     * Update user password
     */
    public function updatePassword(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'current_password.required' => 'Current password is required.',
            'password.required' => 'New password is required.',
            'password.min' => 'New password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Check if current password is correct
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Current password is incorrect.'])->withInput();
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return back()->with('success', 'Password updated successfully!');
    }

    /**
     * Show profile settings page
     */
    public function profileSettings()
    {
        $user = auth()->user();
        
        return Inertia::render('Members/Profile/ProfileSettings', [
            'auth' => ['user' => $user],
            'user' => $user
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            'country' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
        ], [
            'email.required' => 'Email is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already taken.',
            'first_name.max' => 'First name cannot exceed 255 characters.',
            'last_name.max' => 'Last name cannot exceed 255 characters.',
            'gender.in' => 'Please select a valid gender.',
            'country.max' => 'Country cannot exceed 255 characters.',
            'phone.max' => 'Phone number cannot exceed 20 characters.',
            'address.max' => 'Address cannot exceed 500 characters.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Sanitize input data
        $sanitizedData = [
            'first_name' => $request->first_name ? strip_tags(trim($request->first_name)) : null,
            'last_name' => $request->last_name ? strip_tags(trim($request->last_name)) : null,
            'gender' => $request->gender ? strip_tags(trim($request->gender)) : null,
            'country' => $request->country ? strip_tags(trim($request->country)) : null,
            'email' => strtolower(trim($request->email)),
            'phone' => $request->phone ? strip_tags(trim($request->phone)) : null,
            'address' => $request->address ? strip_tags(trim($request->address)) : null,
        ];

        // Update user profile
        $user->update($sanitizedData);

        return back()->with('success', 'Profile updated successfully!');
    }

    /**
     * Show change referral code page
     */
    public function changeReferral()
    {
        $user = auth()->user();
        
        return Inertia::render('Members/Profile/ChangeReferral', [
            'auth' => ['user' => $user],
            'user' => $user
        ]);
    }

    /**
     * Update user referral code
     */
    public function updateReferral(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'referral_code' => [
                'required',
                'string',
                'min:3',
                'max:20',
                'regex:/^[A-Z0-9]+$/',
                Rule::unique('users')->ignore($user->id)
            ],
        ], [
            'referral_code.required' => 'Referral code is required.',
            'referral_code.min' => 'Referral code must be at least 3 characters.',
            'referral_code.max' => 'Referral code cannot exceed 20 characters.',
            'referral_code.regex' => 'Referral code can only contain uppercase letters and numbers.',
            'referral_code.unique' => 'This referral code is already taken.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Sanitize and format referral code
        $referralCode = strtoupper(trim(strip_tags($request->referral_code)));

        // Update referral code
        $user->update([
            'referral_code' => $referralCode
        ]);

        return back()->with('success', 'Referral code updated successfully!');
    }
}