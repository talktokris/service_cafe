import { Head, useForm } from "@inertiajs/react";
import { AdminDashboardLayout } from "../AdminComponents";
import Breadcrumb from "../../Members/Components/Breadcrumb";

export default function AdminChangePassword({ auth, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submit = async (e) => {
        e.preventDefault();
        try {
            const refreshRes = await fetch("/refresh-csrf", { method: "GET", headers: { Accept: "application/json" }, credentials: "same-origin" });
            if (refreshRes.ok) {
                const data = await refreshRes.json();
                if (data.csrf_token) {
                    const meta = document.querySelector('meta[name="csrf-token"]');
                    if (meta) meta.setAttribute("content", data.csrf_token);
                    if (window.axios) window.axios.defaults.headers.common["X-CSRF-TOKEN"] = data.csrf_token;
                }
            }
        } catch (_) {}
        post(route("profile.update-password"), {
            onSuccess: () => {
                setData("password", "");
                setData("password_confirmation", "");
            },
        });
    };

    return (
        <AdminDashboardLayout title="Change Password - Serve Cafe" user={auth.user}>
            <Head title="Change Password" />

            <div className="w-full lg:max-w-[50%]">
                <Breadcrumb
                    title="Change Password"
                    links={["Home", "Change Password"]}
                    icon={
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    }
                />

                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{flash.success}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Password</h3>
                    <p className="text-sm text-gray-500 mb-6">Ensure your account is using a long, random password to stay secure.</p>
                    <form onSubmit={submit} className="space-y-6 border border-gray-200 rounded-lg bg-gray-50 p-6">
                        <div>
                            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">Current Password</label>
                            <input id="current_password" type="password" value={data.current_password} onChange={(e) => setData("current_password", e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                            {errors.current_password && <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                            <input id="password" type="password" value={data.password} onChange={(e) => setData("password", e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required minLength={8} />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long.</p>
                        </div>
                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData("password_confirmation", e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                            {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" disabled={processing} className="inline-flex items-center px-4 py-2 bg-amber-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-amber-900 focus:bg-amber-900 active:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-25">
                                {processing ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
