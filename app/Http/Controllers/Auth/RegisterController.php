<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\WelcomeEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RegisterController extends Controller
{
    /**
     * Show the registration form with referral code
     */
    public function showRegistrationForm(Request $request, $referral_code)
    {
        // Validate referral code exists
        $referrer = User::where('referral_code', $referral_code)->first();
        
        if (!$referrer) {
            return Inertia::render('Auth/InvalidReferralCode', [
                'referral_code' => $referral_code,
                'error' => 'The referral code "' . $referral_code . '" is invalid or does not exist. Please check the link and try again.'
            ]);
        }

        return Inertia::render('Auth/Register', [
            'referral_code' => $referral_code,
            'referrer_name' => $referrer->first_name . ' ' . $referrer->last_name,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Handle registration
     */
    public function register(Request $request, $referral_code)
    {
        // Validate referral code exists
        $referrer = User::where('referral_code', $referral_code)->first();
        
        if (!$referrer) {
            return Inertia::render('Auth/InvalidReferralCode', [
                'referral_code' => $referral_code,
                'error' => 'The referral code "' . $referral_code . '" is invalid or does not exist. Please check the link and try again.'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'first_name.required' => 'First name is required.',
            'first_name.max' => 'First name cannot exceed 255 characters.',
            'last_name.required' => 'Last name is required.',
            'last_name.max' => 'Last name cannot exceed 255 characters.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already registered.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Sanitize input data
        $sanitizedData = [
            'name' => trim(strip_tags($request->first_name . ' ' . $request->last_name)),
            'first_name' => trim(strip_tags($request->first_name)),
            'last_name' => trim(strip_tags($request->last_name)),
            'email' => strtolower(trim($request->email)),
            'password' => Hash::make($request->password),
            'user_type' => 'member',
            'member_type' => 'free',
            'referral_code' => $this->generateUniqueReferralCode(),
            'referred_by' => $referrer->id,
        ];

        // Create user
        $user = User::create($sanitizedData);

        // Send welcome email
        try {
            Mail::to($user->email)->send(new WelcomeEmail($user));
        } catch (\Exception $e) {
            // Log the error but don't fail registration
            \Log::error('Failed to send welcome email: ' . $e->getMessage());
        }

        // Assign default role (if you have role system)
        // You can add role assignment logic here if needed

        return redirect()->route('register.with.referral', ['referral_code' => $referral_code])
            ->with('success', 'Registration successful! A welcome email has been sent to your inbox. You can now log in with your credentials.');
    }

    /**
     * Generate unique referral code
     */
    private function generateUniqueReferralCode()
    {
        do {
            $code = strtolower(substr(str_shuffle('abcdefghijklmnopqrstuvwxyz0123456789'), 0, 8));
        } while (User::where('referral_code', $code)->exists());

        return $code;
    }
}
