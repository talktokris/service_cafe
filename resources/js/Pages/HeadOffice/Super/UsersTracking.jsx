import React from "react";
import { Head, Link } from "@inertiajs/react";
import { AdminDashboardLayout } from "../AdminComponents";

export default function UsersTracking({ user }) {
    return (
        <AdminDashboardLayout title="Users Tracking - Serve Cafe" user={user}>
            <Head title="Users Tracking" />

            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Users Tracking
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
                                            Users Tracking
                                        </span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Total Users
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                156
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Active Users
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                142
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Paid Members
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                89
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-yellow-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                New This Month
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                23
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Activity Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        User Activity (Last 7 Days)
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Monday
                            </span>
                            <div className="flex items-center space-x-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: "75%" }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium">75%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Tuesday
                            </span>
                            <div className="flex items-center space-x-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: "60%" }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium">60%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Wednesday
                            </span>
                            <div className="flex items-center space-x-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: "85%" }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium">85%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Thursday
                            </span>
                            <div className="flex items-center space-x-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: "70%" }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium">70%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Friday
                            </span>
                            <div className="flex items-center space-x-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: "90%" }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium">90%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        User Types Distribution
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                    Paid Members
                                </span>
                            </div>
                            <span className="text-sm font-medium">
                                89 (57%)
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                    Free Members
                                </span>
                            </div>
                            <span className="text-sm font-medium">
                                67 (43%)
                            </span>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                                    style={{ width: "100%" }}
                                >
                                    <div
                                        className="bg-green-500 h-3 rounded-full"
                                        style={{ width: "57%" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Recent User Activity
                        </h3>
                        <div className="flex space-x-2">
                            <select className="select select-bordered select-sm">
                                <option>All Users</option>
                                <option>Paid Members</option>
                                <option>Free Members</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="input input-bordered input-sm w-64"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Type</th>
                                    <th>Last Activity</th>
                                    <th>Total Orders</th>
                                    <th>Wallet Balance</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center rounded-full">
                                                        <span className="text-sm font-semibold">
                                                            JD
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">
                                                    John Doe
                                                </div>
                                                <div className="text-sm opacity-50">
                                                    john@example.com
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-success">
                                            Paid Member
                                        </span>
                                    </td>
                                    <td>2 hours ago</td>
                                    <td>15</td>
                                    <td>₹1,250</td>
                                    <td>
                                        <span className="badge badge-success">
                                            Active
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <button className="btn btn-ghost btn-xs">
                                                View
                                            </button>
                                            <button className="btn btn-ghost btn-xs">
                                                Edit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
                                                        <span className="text-sm font-semibold">
                                                            JS
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">
                                                    Jane Smith
                                                </div>
                                                <div className="text-sm opacity-50">
                                                    jane@example.com
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-info">
                                            Free Member
                                        </span>
                                    </td>
                                    <td>5 hours ago</td>
                                    <td>8</td>
                                    <td>₹0</td>
                                    <td>
                                        <span className="badge badge-success">
                                            Active
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <button className="btn btn-ghost btn-xs">
                                                View
                                            </button>
                                            <button className="btn btn-ghost btn-xs">
                                                Edit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <div className="w-12 h-12 bg-green-600 text-white flex items-center justify-center rounded-full">
                                                        <span className="text-sm font-semibold">
                                                            MJ
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">
                                                    Mike Johnson
                                                </div>
                                                <div className="text-sm opacity-50">
                                                    mike@example.com
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-success">
                                            Paid Member
                                        </span>
                                    </td>
                                    <td>1 day ago</td>
                                    <td>23</td>
                                    <td>₹2,100</td>
                                    <td>
                                        <span className="badge badge-warning">
                                            Inactive
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <button className="btn btn-ghost btn-xs">
                                                View
                                            </button>
                                            <button className="btn btn-ghost btn-xs">
                                                Edit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
