import React from "react";
import { Head, Link } from "@inertiajs/react";
import { AdminDashboardLayout } from "../AdminComponents";

export default function ReportsAnalytics({ user }) {
    return (
        <AdminDashboardLayout
            title="Reports & Analytics - Serve Cafe"
            user={user}
        >
            <Head title="Reports & Analytics" />

            {/* Page Header */}
            <div className="mb-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Reports & Analytics
                                </h1>
                                <nav className="flex items-center space-x-2 text-sm">
                                    <Link
                                        href="/dashboard"
                                        className="text-gray-600 hover:text-gray-900 font-medium"
                                    >
                                        Home
                                    </Link>
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    <span className="text-gray-700 font-medium">
                                        Reports & Analytics
                                    </span>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <select className="select select-bordered select-sm">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 3 months</option>
                            <option>Last year</option>
                        </select>
                        <button className="btn bg-green-600 hover:bg-green-700 text-white">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            Export Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Total Revenue
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹2,45,680
                            </p>
                            <p className="text-xs text-green-600">
                                +12.5% from last month
                            </p>
                        </div>
                    </div>
                </div>

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
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Total Orders
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                1,234
                            </p>
                            <p className="text-xs text-green-600">
                                +8.2% from last month
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
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Active Customers
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                456
                            </p>
                            <p className="text-xs text-green-600">
                                +15.3% from last month
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
                                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Average Order Value
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹199
                            </p>
                            <p className="text-xs text-red-600">
                                -2.1% from last month
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Revenue Trend
                    </h3>
                    <div className="h-64 flex items-end justify-between space-x-2">
                        <div className="flex flex-col items-center">
                            <div
                                className="w-8 bg-blue-500 rounded-t"
                                style={{ height: "60%" }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-2">
                                Mon
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div
                                className="w-8 bg-blue-500 rounded-t"
                                style={{ height: "80%" }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-2">
                                Tue
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div
                                className="w-8 bg-blue-500 rounded-t"
                                style={{ height: "45%" }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-2">
                                Wed
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div
                                className="w-8 bg-blue-500 rounded-t"
                                style={{ height: "90%" }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-2">
                                Thu
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div
                                className="w-8 bg-blue-500 rounded-t"
                                style={{ height: "100%" }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-2">
                                Fri
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div
                                className="w-8 bg-blue-500 rounded-t"
                                style={{ height: "75%" }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-2">
                                Sat
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div
                                className="w-8 bg-blue-500 rounded-t"
                                style={{ height: "85%" }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-2">
                                Sun
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Order Status Distribution
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                    Completed
                                </span>
                            </div>
                            <span className="text-sm font-medium">
                                75% (925)
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                    Processing
                                </span>
                            </div>
                            <span className="text-sm font-medium">
                                15% (185)
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                    Pending
                                </span>
                            </div>
                            <span className="text-sm font-medium">8% (99)</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                    Cancelled
                                </span>
                            </div>
                            <span className="text-sm font-medium">2% (25)</span>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-green-500 via-yellow-500 to-blue-500 h-3 rounded-full"
                                    style={{ width: "100%" }}
                                >
                                    <div
                                        className="bg-green-500 h-3 rounded-full"
                                        style={{ width: "75%" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Performing Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Top Performing Items
                    </h3>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Item Name</th>
                                    <th>Category</th>
                                    <th>Orders</th>
                                    <th>Revenue</th>
                                    <th>Growth</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="flex items-center">
                                            <span className="text-2xl">🥇</span>
                                            <span className="ml-2 font-bold">
                                                1
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img
                                                        src="/assets/cappuccino.jpg"
                                                        alt="Cappuccino"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">
                                                    Cappuccino
                                                </div>
                                                <div className="text-sm opacity-50">
                                                    Premium coffee
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Beverages</td>
                                    <td>234</td>
                                    <td>₹28,080</td>
                                    <td>
                                        <span className="badge badge-success">
                                            +15%
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="flex items-center">
                                            <span className="text-2xl">🥈</span>
                                            <span className="ml-2 font-bold">
                                                2
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img
                                                        src="/assets/sandwich.jpg"
                                                        alt="Sandwich"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">
                                                    Chicken Sandwich
                                                </div>
                                                <div className="text-sm opacity-50">
                                                    Fresh ingredients
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Food Items</td>
                                    <td>189</td>
                                    <td>₹34,020</td>
                                    <td>
                                        <span className="badge badge-success">
                                            +12%
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="flex items-center">
                                            <span className="text-2xl">🥉</span>
                                            <span className="ml-2 font-bold">
                                                3
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img
                                                        src="/assets/latte.jpg"
                                                        alt="Latte"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">
                                                    Vanilla Latte
                                                </div>
                                                <div className="text-sm opacity-50">
                                                    Smooth and creamy
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Beverages</td>
                                    <td>156</td>
                                    <td>₹23,400</td>
                                    <td>
                                        <span className="badge badge-success">
                                            +8%
                                        </span>
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
