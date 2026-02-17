<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Profile index (hub): profile information form with Profile Categories sidebar.
     */
    public function profileIndex()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $isAdmin = in_array($user->user_type ?? '', ['headoffice', 'brandoffice', 'branchOffice']);

        if ($isAdmin) {
            return Inertia::render('HeadOffice/Profile/Index', [
                'auth' => ['user' => $user],
                'user' => $user,
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
            ]);
        }

        return Inertia::render('Members/Profile/Index', [
            'auth' => ['user' => $user],
            'user' => $user,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Show change password page
     */
    public function changePassword()
    {
        $user = Auth::user();
        $isAdmin = in_array($user->user_type ?? '', ['headoffice', 'brandoffice', 'branchOffice']);

        if ($isAdmin) {
            return Inertia::render('HeadOffice/Profile/ChangePassword', [
                'auth' => ['user' => $user],
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
            ]);
        }

        return Inertia::render('Members/Profile/ChangePassword', [
            'auth' => ['user' => Auth::user()],
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Update user password
     */
    public function updatePassword(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

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
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        return Inertia::render('Members/Profile/ProfileSettings', [
            'auth' => ['user' => $user],
            'user' => $user,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            'country' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'regex:/^\+977[0-9]{9,10}$/', 'min:13', 'max:14'],
            'address' => ['nullable', 'string', 'max:500'],
        ], [
            'email.required' => 'Email is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already taken.',
            'first_name.max' => 'First name cannot exceed 255 characters.',
            'last_name.max' => 'Last name cannot exceed 255 characters.',
            'gender.in' => 'Please select a valid gender.',
            'country.max' => 'Country cannot exceed 255 characters.',
            'phone.regex' => 'Phone number must start with +977 followed by 9-10 digits.',
            'phone.min' => 'Phone number must be at least 13 characters (+977 + 9 digits).',
            'phone.max' => 'Phone number cannot exceed 14 characters (+977 + 10 digits).',
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
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $isAdmin = in_array($user->user_type ?? '', ['headoffice', 'brandoffice', 'branchOffice']);

        if ($isAdmin) {
            return Inertia::render('HeadOffice/Profile/ChangeReferral', [
                'auth' => ['user' => $user],
                'user' => $user,
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
            ]);
        }

        return Inertia::render('Members/Profile/ChangeReferral', [
            'auth' => ['user' => $user],
            'user' => $user,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Update user referral code
     */
    public function updateReferral(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'referral_code' => [
                'required',
                'string',
                'min:3',
                'max:60',
                'regex:/^[a-z0-9]+$/',
                Rule::unique('users')->ignore($user->id)
            ],
        ], [
            'referral_code.required' => 'Referral address is required.',
            'referral_code.min' => 'Referral address must be at least 3 characters.',
            'referral_code.max' => 'Referral address cannot exceed 60 characters.',
            'referral_code.regex' => 'Referral address can only contain lowercase letters and numbers.',
            'referral_code.unique' => 'This referral address is already taken.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Sanitize and format referral address
        $referralCode = strtolower(trim(strip_tags($request->referral_code)));

        // Update referral address
        $user->update([
            'referral_code' => $referralCode
        ]);

        return back()->with('success', 'Referral address updated successfully!');
    }
}