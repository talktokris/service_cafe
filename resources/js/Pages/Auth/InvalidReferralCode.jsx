import React from "react";
import { Head, Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";

export default function InvalidReferralCode({ referral_code, error }) {
    const { data, setData, post, processing, errors } = useForm({
        referral_code: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.referral_code) {
            window.location.href = `/join/${data.referral_code}`;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Invalid Referral Code" />

            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100">
                        <svg
                            className="h-8 w-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Invalid Referral Code
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        The referral link you used is not valid
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow rounded-lg">
                    {/* Error Message */}
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-red-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Referral Code Not Found
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Try Different Code Form */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Try a Different Referral Code
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="referral_code"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Enter Referral Code
                                </label>
                                <input
                                    type="text"
                                    id="referral_code"
                                    value={data.referral_code}
                                    onChange={(e) =>
                                        setData("referral_code", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                                    placeholder="Enter referral code"
                                    pattern="[a-z0-9]+"
                                    title="Referral code should contain only lowercase letters and numbers"
                                    required
                                />
                                {errors.referral_code && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.referral_code}
                                    </p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={processing || !data.referral_code}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing
                                    ? "Processing..."
                                    : "Continue with Referral Code"}
                            </button>
                        </form>
                    </div>

                    {/* Alternative Options */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Other Options
                        </h3>
                        <div className="space-y-3">
                            <Link
                                href="/login"
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                            >
                                Already have an account? Sign in
                            </Link>
                            <Link
                                href="/"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                            >
                                Go to Homepage
                            </Link>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-blue-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    Need Help?
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <p>
                                        If you believe this is an error, please
                                        contact the person who shared this link
                                        with you or contact our support team.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
