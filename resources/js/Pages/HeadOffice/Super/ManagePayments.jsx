import React from "react";
import { Head, Link } from "@inertiajs/react";
import { AdminDashboardLayout } from "../AdminComponents";

export default function ManagePayments({ user }) {
    return (
        <AdminDashboardLayout title="Manage Payments - Serve Cafe" user={user}>
            <Head title="Manage Payments" />

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
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Manage Payments
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
                                        Manage Payments
                                    </span>
                                </nav>
                            </div>
                        </div>
                        <Link
                            href="/manage-payments/create"
                            className="btn bg-green-600 hover:bg-green-700 text-white"
                        >
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
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        Process Payment
                    </Link>
                </div>
            </div>

            {/* Payment Stats */}
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
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Successful
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹45,230
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
                                Pending
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹3,450
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Failed
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹1,200
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
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Refunded
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹850
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Methods Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Payment Methods Status
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-4 h-4 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                        />
                                    </svg>
                                </div>
                                <span className="font-medium">
                                    Credit/Debit Card
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="badge badge-success">
                                    Active
                                </span>
                                <button className="btn btn-ghost btn-xs">
                                    Configure
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-4 h-4 text-green-600"
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
                                <span className="font-medium">
                                    UPI Payments
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="badge badge-success">
                                    Active
                                </span>
                                <button className="btn btn-ghost btn-xs">
                                    Configure
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-4 h-4 text-yellow-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                </div>
                                <span className="font-medium">
                                    Cash on Delivery
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="badge badge-warning">
                                    Limited
                                </span>
                                <button className="btn btn-ghost btn-xs">
                                    Configure
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-4 h-4 text-purple-600"
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
                                <span className="font-medium">
                                    Digital Wallet
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="badge badge-success">
                                    Active
                                </span>
                                <button className="btn btn-ghost btn-xs">
                                    Configure
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Payment Analytics
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Success Rate
                            </span>
                            <div className="flex items-center space-x-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{ width: "92%" }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium">92%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Average Processing Time
                            </span>
                            <span className="text-sm font-medium">
                                2.3 seconds
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Total Transactions Today
                            </span>
                            <span className="text-sm font-medium">156</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Failed Transactions
                            </span>
                            <span className="text-sm font-medium text-red-600">
                                12
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Recent Payment Transactions
                        </h3>
                        <div className="flex space-x-2">
                            <select className="select select-bordered select-sm">
                                <option>All Status</option>
                                <option>Successful</option>
                                <option>Pending</option>
                                <option>Failed</option>
                                <option>Refunded</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Search payments..."
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
                                    <th>Transaction ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>#PAY-001</td>
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
                                    <td>₹420</td>
                                    <td>
                                        <span className="badge badge-info">
                                            Card
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge badge-success">
                                            Successful
                                        </span>
                                    </td>
                                    <td>2024-01-15 14:30</td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <button className="btn btn-ghost btn-xs">
                                                View
                                            </button>
                                            <button className="btn btn-ghost btn-xs">
                                                Refund
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#PAY-002</td>
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
                                    <td>₹280</td>
                                    <td>
                                        <span className="badge badge-success">
                                            UPI
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge badge-warning">
                                            Pending
                                        </span>
                                    </td>
                                    <td>2024-01-15 14:15</td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <button className="btn btn-ghost btn-xs">
                                                View
                                            </button>
                                            <button className="btn btn-ghost btn-xs">
                                                Retry
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#PAY-003</td>
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
                                    <td>₹150</td>
                                    <td>
                                        <span className="badge badge-primary">
                                            Wallet
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge badge-error">
                                            Failed
                                        </span>
                                    </td>
                                    <td>2024-01-15 13:45</td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <button className="btn btn-ghost btn-xs">
                                                View
                                            </button>
                                            <button className="btn btn-ghost btn-xs">
                                                Retry
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
