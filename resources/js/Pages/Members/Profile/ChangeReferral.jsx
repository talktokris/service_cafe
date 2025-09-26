import { Head, useForm } from "@inertiajs/react";
import MemberDashboardLayout from "../Components/MemberDashboardLayout";
import Breadcrumb from "../Components/Breadcrumb";

export default function ChangeReferral({ auth, user, flash }) {
    const memberType = auth.user.member_type || "free";
    const { data, setData, post, processing, errors, reset } = useForm({
        referral_code: user.referral_code || "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("profile.update-referral"), {
            onSuccess: () => {
                // Don't reset the form, keep the updated value
                setData("referral_code", data.referral_code);
            },
        });
    };

    const handleReferralCodeChange = (e) => {
        // Convert to lowercase and remove special characters, allow only letters and numbers
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "");
        setData("referral_code", value);
    };

    return (
        <MemberDashboardLayout
            title="Change Referral Address - Serve Cafe"
            user={auth.user}
            memberType={memberType}
        >
            <Head title="Change Referral Address" />

            <div>
                {/* Breadcrumb */}
                <Breadcrumb
                    title="Change Referral Address"
                    links={["Home", "Change Referral"]}
                    icon={
                        <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                        </svg>
                    }
                />

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

                {/* Main Content */}
                <div className="py-12">
                    <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-8 text-gray-900">
                                {/* Current Profile Info */}
                                <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Current Profile Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Name
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {user.first_name &&
                                                user.last_name
                                                    ? `${user.first_name} ${user.last_name}`
                                                    : user.name ||
                                                      "Not provided"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Current Referral Address
                                            </label>
                                            <p className="mt-1 text-sm font-mono text-indigo-600 font-semibold">
                                                {user.referral_code ||
                                                    "Not set"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Change Referral Address Form */}
                                <form
                                    onSubmit={submit}
                                    className="space-y-6 border border-gray-200 rounded-lg bg-gray-50 p-6"
                                >
                                    <div>
                                        <label
                                            htmlFor="referral_code"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            New Referral Address *
                                        </label>
                                        <input
                                            id="referral_code"
                                            type="text"
                                            value={data.referral_code}
                                            onChange={handleReferralCodeChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                                            placeholder="Enter your desired referral address"
                                            required
                                            minLength={3}
                                            maxLength={60}
                                            pattern="[a-z0-9]+"
                                        />
                                        {errors.referral_code && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.referral_code}
                                            </p>
                                        )}
                                        <div className="mt-2 text-xs text-gray-500">
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>
                                                    Must be 3-60 characters long
                                                </li>
                                                <li>
                                                    Only lowercase letters and
                                                    numbers allowed
                                                </li>
                                                <li>
                                                    Must be unique (not already
                                                    taken by another user)
                                                </li>
                                                <li>
                                                    Current length:{" "}
                                                    {data.referral_code.length}
                                                    /60
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex items-center justify-end">
                                        <button
                                            type="submit"
                                            disabled={
                                                processing ||
                                                data.referral_code.length < 3 ||
                                                data.referral_code.length > 60
                                            }
                                            className="inline-flex items-center px-4 py-2 bg-amber-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-amber-900 focus:bg-amber-900 active:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-25"
                                        >
                                            {processing
                                                ? "Updating..."
                                                : "Update Referral Address"}
                                        </button>
                                    </div>
                                </form>

                                {/* Important Notice */}
                                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-yellow-400"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">
                                                Important Notice
                                            </h3>
                                            <div className="mt-2 text-sm text-yellow-700">
                                                <p>
                                                    Your referral code is used
                                                    by others to join under your
                                                    network. Choose a code that
                                                    is easy to remember and
                                                    share. Once changed, the old
                                                    code will no longer work for
                                                    new referrals.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MemberDashboardLayout>
    );
}
