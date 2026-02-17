import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function Register({ referral_code, referrer_name, flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = async (e) => {
        e.preventDefault();
        // Refresh CSRF token before submit to avoid session expired when form was open a while
        try {
            const refreshRes = await fetch("/refresh-csrf", {
                method: "GET",
                headers: { Accept: "application/json" },
                credentials: "same-origin",
            });
            if (refreshRes.ok) {
                const resData = await refreshRes.json();
                if (resData.csrf_token) {
                    const meta = document.querySelector('meta[name="csrf-token"]');
                    if (meta) meta.setAttribute("content", resData.csrf_token);
                    if (window.axios) window.axios.defaults.headers.common["X-CSRF-TOKEN"] = resData.csrf_token;
                }
            }
        } catch (_) {
            // Continue with existing token if refresh fails
        }
        post(route("register.submit", { referral_code: referral_code }), {
            onSuccess: () => {
                // Clear password fields after successful registration
                setData("password", "");
                setData("password_confirmation", "");
            },
        });
    };

    return (
        <PublicLayout
            title="Join Serve Cafe - Register with Referral Code | Best Cafe in Kathmandu"
            description="Join Serve Cafe with referral code {referral_code}. Create your account and start enjoying the best cafe experience in Kathmandu with digital wallet services and exclusive benefits."
            keywords="join serve cafe, register serve cafe, referral code, cafe kathmandu, restaurant khumaltar, digital wallet, serve cafe membership"
            canonical="https://servecafe.com/join/serveteam"
        >
            <Head title="Join Serve Cafe - Register with Referral" />

            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center mb-8">
                        <img
                            src="/assets/logo.png"
                            alt="Serve Cafe Logo"
                            className="h-16 w-16 object-contain"
                        />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Join Serve Cafe
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        You're joining through {referrer_name}'s referral
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        {/* Success Message */}
                        {flash.success && (
                            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-5 w-5 text-green-400"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">
                                            {flash.success}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {flash.error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-5 w-5 text-red-400"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-red-800">
                                            {flash.error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form className="space-y-6 mb-8" onSubmit={submit}>
                            {/* First Name and Last Name Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* First Name */}
                                <div>
                                    <label
                                        htmlFor="first_name"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        First Name *
                                    </label>
                                    <input
                                        id="first_name"
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData(
                                                "first_name",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
                                        placeholder="Enter your first name"
                                        required
                                        maxLength={255}
                                    />
                                    {errors.first_name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.first_name}
                                        </p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label
                                        htmlFor="last_name"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Last Name *
                                    </label>
                                    <input
                                        id="last_name"
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData("last_name", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
                                        placeholder="Enter your last name"
                                        required
                                        maxLength={255}
                                    />
                                    {errors.last_name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.last_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Referral */}
                            <div>
                                <label
                                    htmlFor="referral"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Referral
                                </label>
                                <input
                                    id="referral"
                                    type="text"
                                    value={`${referrer_name} (${referral_code})`}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-600 text-sm cursor-not-allowed"
                                    readOnly
                                />
                                <div className="mt-1 text-xs text-gray-500">
                                    You're joining through this referral
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email Address *
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
                                    placeholder="Enter your email address"
                                    required
                                    maxLength={255}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password and Confirm Password Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Password *
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
                                        placeholder="Enter your password"
                                        required
                                        minLength={8}
                                    />
                                    <div className="mt-1 text-xs text-gray-500">
                                        Must be at least 8 characters
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Confirm Password *
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
                                        placeholder="Confirm your password"
                                        required
                                        minLength={8}
                                    />
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 transition-colors duration-200"
                                >
                                    {processing
                                        ? "Creating Account..."
                                        : "Create Account"}
                                </button>
                            </div>

                            {/* Login Link */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{" "}
                                    <a
                                        href="/login"
                                        className="font-medium text-amber-600 hover:text-amber-500"
                                    >
                                        Sign in
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
