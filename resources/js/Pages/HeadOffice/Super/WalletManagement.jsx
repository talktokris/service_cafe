import React from "react";
import { Head, Link } from "@inertiajs/react";
import { AdminDashboardLayout } from "../AdminComponents";

export default function WalletManagement({ user }) {
    return (
        <AdminDashboardLayout
            title="Wallet Management - Serve Cafe"
            user={user}
        >
            <Head title="Wallet Management" />

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
                                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Wallet Management
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
                                        Wallet Management
                                    </span>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet Stats */}
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
                                Total Wallets
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
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Total Balance
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹2,45,680
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
                                Today's Top-ups
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹12,450
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
                                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Today's Spending
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹8,920
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet Transactions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Recent Wallet Transactions
                        </h3>
                        <div className="flex space-x-2">
                            <select className="select select-bordered select-sm">
                                <option>All Types</option>
                                <option>Top-up</option>
                                <option>Payment</option>
                                <option>Refund</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Search transactions..."
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
                                    <th>User</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Balance</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>#TXN-001</td>
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
                                            Top-up
                                        </span>
                                    </td>
                                    <td className="text-green-600">+₹500</td>
                                    <td>₹1,250</td>
                                    <td>2024-01-15 14:30</td>
                                    <td>
                                        <span className="badge badge-success">
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#TXN-002</td>
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
                                            Payment
                                        </span>
                                    </td>
                                    <td className="text-red-600">-₹280</td>
                                    <td>₹720</td>
                                    <td>2024-01-15 14:15</td>
                                    <td>
                                        <span className="badge badge-success">
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#TXN-003</td>
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
                                        <span className="badge badge-warning">
                                            Refund
                                        </span>
                                    </td>
                                    <td className="text-green-600">+₹150</td>
                                    <td>₹1,100</td>
                                    <td>2024-01-15 13:45</td>
                                    <td>
                                        <span className="badge badge-success">
                                            Completed
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
