import { Head, useForm } from "@inertiajs/react";
import MemberDashboardLayout from "../Components/MemberDashboardLayout";
import Breadcrumb from "../Components/Breadcrumb";

export default function ChangePassword({ auth }) {
    const memberType = auth.user.member_type || "free";
    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("profile.update-password"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <MemberDashboardLayout
            title="Change Password - Serve Cafe"
            user={auth.user}
            memberType={memberType}
        >
            <Head title="Change Password" />

            <div>
                {/* Breadcrumb */}
                <Breadcrumb
                    title="Change Password"
                    links={["Home", "Change Password"]}
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
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                        </svg>
                    }
                />

                {/* Main Content */}
                <div className="py-12">
                    <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-8 text-gray-900">
                                <form
                                    onSubmit={submit}
                                    className="space-y-6 border border-gray-200 rounded-lg bg-gray-50 p-6"
                                >
                                    {/* Current Password */}
                                    <div>
                                        <label
                                            htmlFor="current_password"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Current Password
                                        </label>
                                        <input
                                            id="current_password"
                                            type="password"
                                            value={data.current_password}
                                            onChange={(e) =>
                                                setData(
                                                    "current_password",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.current_password && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.current_password}
                                            </p>
                                        )}
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            New Password
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                            minLength={8}
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.password}
                                            </p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            Password must be at least 8
                                            characters long.
                                        </p>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label
                                            htmlFor="password_confirmation"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Confirm New Password
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
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.password_confirmation && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.password_confirmation}
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex items-center justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center px-4 py-2 bg-amber-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-amber-900 focus:bg-amber-900 active:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-25"
                                        >
                                            {processing
                                                ? "Updating..."
                                                : "Update Password"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MemberDashboardLayout>
    );
}
