import React from "react";
import { Head, Link } from "@inertiajs/react";
import { AdminDashboardLayout } from "../AdminComponents";

export default function AdminUserDashboard({ user, stats }) {
    const dashboardStats = stats || {
        totalBranches: 4,
        totalUsers: 15,
        totalOrders: 35,
        totalRevenue: 840507.52,
        pendingOrders: 14,
        completedOrders: 21,
    };

    const recentOrders = [
        {
            id: 1,
            customer: "John Doe",
            items: "Coffee + Sandwich",
            amount: "₹374",
            status: "PENDING",
            time: "2 min ago",
        },
        {
            id: 2,
            customer: "Jane Smith",
            items: "Cappuccino + Muffin",
            amount: "₹245",
            status: "COMPLETED",
            time: "5 min ago",
        },
        {
            id: 3,
            customer: "Mike Johnson",
            items: "Latte + Croissant",
            amount: "₹298",
            status: "PENDING",
            time: "8 min ago",
        },
    ];

    const recentTransactions = [
        {
            id: 1,
            type: "Wallet_Topup",
            customer: "Krishna Jha",
            amount: "₹435.77",
            status: "COMPLETED",
            date: "31/05/2025",
        },
        {
            id: 2,
            type: "Cash_Payment",
            customer: "Sarah Wilson",
            amount: "₹645.65",
            status: "COMPLETED",
            date: "30/05/2025",
        },
        {
            id: 3,
            type: "Card_Payment",
            customer: "David Brown",
            amount: "₹233.40",
            status: "CANCELLED",
            date: "30/05/2025",
        },
    ];

    return (
        <AdminDashboardLayout title="Admin Dashboard - Serve Cafe" user={user}>
            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Admin Dashboard
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
                                            Admin Dashboard
                                        </span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Branches */}
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
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Total Branches
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {dashboardStats.totalBranches}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Total Users */}
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
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Total Users
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {dashboardStats.totalUsers}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Today's Orders */}
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
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Today's Orders
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {dashboardStats.totalOrders}
                            </p>
                            <p className="text-xs text-gray-500">
                                Pending: {dashboardStats.pendingOrders}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Total Revenue */}
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
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Total Revenue
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹{dashboardStats.totalRevenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                                Completed: ₹
                                {Math.floor(
                                    dashboardStats.totalRevenue * 0.7
                                ).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Recent Orders
                            </h3>
                            <Link
                                href="/orders"
                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                                View All
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {order.customer}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {order.items}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {order.amount}
                                        </p>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                order.status === "PENDING"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-green-100 text-green-800"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Recent Transactions
                            </h3>
                            <Link
                                href="/transactions"
                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                                View All
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`w-2 h-2 rounded-full ${
                                                    transaction.status ===
                                                    "COMPLETED"
                                                        ? "bg-green-500"
                                                        : transaction.status ===
                                                          "CANCELLED"
                                                        ? "bg-red-500"
                                                        : "bg-yellow-500"
                                                }`}
                                            ></div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {transaction.type}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {transaction.customer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {transaction.amount}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {transaction.date}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
