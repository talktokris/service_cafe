import React from "react";
import { Head, Link } from "@inertiajs/react";
import { AdminDashboardLayout } from "../AdminComponents";

export default function Settings({ user }) {
    return (
        <AdminDashboardLayout title="Settings - Serve Cafe" user={user}>
            <Head title="Settings" />

            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Settings
                        </h1>
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                <li className="inline-flex items-center">
                                    <Link
                                        href="/dashboard"
                                        className="text-gray-700 hover:text-red-600"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <svg
                                            className="w-6 h-6 text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span className="ml-1 text-gray-500 md:ml-2">
                                            Settings
                                        </span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Settings Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Settings Categories
                        </h3>
                        <div className="space-y-2">
                            <button className="w-full text-left px-3 py-2 rounded-lg bg-red-50 text-red-700 font-medium">
                                General Settings
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                                User Management
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                                Payment Settings
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                                Notification Settings
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                                Security Settings
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                                System Settings
                            </button>
                        </div>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-2">
                    <div className="space-y-6">
                        {/* General Settings */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                General Settings
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Restaurant Name
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        defaultValue="Serve Cafe"
                                        placeholder="Enter restaurant name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Restaurant Address
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered w-full"
                                        rows="3"
                                        placeholder="Enter restaurant address"
                                        defaultValue="123 Main Street, Downtown, City - 12345"
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            className="input input-bordered w-full"
                                            defaultValue="+1 (555) 123-4567"
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="input input-bordered w-full"
                                            defaultValue="info@servecafe.com"
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Time Zone
                                    </label>
                                    <select className="select select-bordered w-full">
                                        <option>
                                            UTC-05:00 (Eastern Time)
                                        </option>
                                        <option>
                                            UTC-06:00 (Central Time)
                                        </option>
                                        <option>
                                            UTC-07:00 (Mountain Time)
                                        </option>
                                        <option>
                                            UTC-08:00 (Pacific Time)
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Currency
                                    </label>
                                    <select className="select select-bordered w-full">
                                        <option>Indian Rupee (₹)</option>
                                        <option>US Dollar ($)</option>
                                        <option>Euro (€)</option>
                                        <option>British Pound (£)</option>
                                    </select>
                                </div>
                                <div className="flex justify-end">
                                    <button className="btn bg-red-600 hover:bg-red-700 text-white">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Business Hours
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Day
                                        </label>
                                        <select className="select select-bordered w-full">
                                            <option>Monday</option>
                                            <option>Tuesday</option>
                                            <option>Wednesday</option>
                                            <option>Thursday</option>
                                            <option>Friday</option>
                                            <option>Saturday</option>
                                            <option>Sunday</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Opening Time
                                        </label>
                                        <input
                                            type="time"
                                            className="input input-bordered w-full"
                                            defaultValue="08:00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Closing Time
                                        </label>
                                        <input
                                            type="time"
                                            className="input input-bordered w-full"
                                            defaultValue="22:00"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        defaultChecked
                                    />
                                    <span className="text-sm text-gray-700">
                                        Open 24/7
                                    </span>
                                </div>
                                <div className="flex justify-end">
                                    <button className="btn bg-red-600 hover:bg-red-700 text-white">
                                        Update Hours
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* System Preferences */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                System Preferences
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            Email Notifications
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Receive email notifications for
                                            important events
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        defaultChecked
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            SMS Notifications
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Receive SMS notifications for urgent
                                            matters
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            Auto Backup
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Automatically backup data daily
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        defaultChecked
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            Maintenance Mode
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Enable maintenance mode for system
                                            updates
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button className="btn bg-red-600 hover:bg-red-700 text-white">
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
