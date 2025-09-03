import React from "react";
import { Link } from "@inertiajs/react";

export default function DashboardComponent({ user, stats }) {
    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    // Format number with commas
    const formatNumber = (num) => {
        return new Intl.NumberFormat("en-IN").format(num || 0);
    };

    // Calculate percentage change (mock data for now)
    const getPercentageChange = (current, previous = 0) => {
        if (previous === 0) return 0;
        return (((current - previous) / previous) * 100).toFixed(1);
    };

    // Get current time for greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {getGreeting()}, {user?.name || "Admin"}!
                        </h1>
                        <p className="text-blue-100 text-lg">
                            Welcome to your Serve Cafe Admin Dashboard
                        </p>
                        <p className="text-blue-200 text-sm mt-1">
                            Here's what's happening with your business today
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                Total Revenue
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                                {formatCurrency(stats?.totalRevenue)}
                            </p>
                            <p className="text-sm text-green-600 mt-1">
                                <span className="inline-flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    +12.5% from last month
                                </span>
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-green-600"
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
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                Total Orders
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                                {formatNumber(stats?.totalOrders)}
                            </p>
                            <p className="text-sm text-blue-600 mt-1">
                                <span className="inline-flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    +8.2% from last month
                                </span>
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-blue-600"
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
                </div>

                {/* Active Branches */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                Active Branches
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                                {stats?.activeBranches || 0}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                of {stats?.totalBranches || 0} total branches
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Total Users */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                Total Users
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                                {formatNumber(stats?.totalUsers)}
                            </p>
                            <p className="text-sm text-green-600 mt-1">
                                <span className="inline-flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    +15.3% from last month
                                </span>
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-orange-600"
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
                </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Today's Revenue */}
                <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
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
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">
                                Today's Revenue
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                {formatCurrency(stats?.todayRevenue)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Completed Orders */}
                <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
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
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">
                                Completed Orders
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                {formatNumber(stats?.completedOrders)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pending Orders */}
                <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
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
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">
                                Pending Orders
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                {formatNumber(stats?.pendingOrders)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Commissions Paid */}
                <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
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
                                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">
                                Commissions Paid
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                {formatCurrency(stats?.commissionsPaid)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link
                                href="/bill-payment"
                                className="group p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5"
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
                                    <div className="ml-3">
                                        <p className="font-semibold">
                                            Bill Payment
                                        </p>
                                        <p className="text-blue-100 text-sm">
                                            Process customer payments
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/orders"
                                className="group p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-semibold">
                                            Order Management
                                        </p>
                                        <p className="text-green-100 text-sm">
                                            View and manage orders
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/manage-members"
                                className="group p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5"
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
                                    <div className="ml-3">
                                        <p className="font-semibold">
                                            Member Management
                                        </p>
                                        <p className="text-purple-100 text-sm">
                                            Manage member accounts
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/menu"
                                className="group p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105"
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-semibold">
                                            Menu Management
                                        </p>
                                        <p className="text-orange-100 text-sm">
                                            Update menu items
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                        System Status
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                <span className="text-sm font-medium text-gray-700">
                                    Database
                                </span>
                            </div>
                            <span className="text-sm text-green-600 font-semibold">
                                Online
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                <span className="text-sm font-medium text-gray-700">
                                    Payment Gateway
                                </span>
                            </div>
                            <span className="text-sm text-green-600 font-semibold">
                                Active
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                <span className="text-sm font-medium text-gray-700">
                                    Email Service
                                </span>
                            </div>
                            <span className="text-sm text-green-600 font-semibold">
                                Running
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                                <span className="text-sm font-medium text-gray-700">
                                    Backup System
                                </span>
                            </div>
                            <span className="text-sm text-yellow-600 font-semibold">
                                Pending
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                            Recent Activity
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="text-sm text-gray-700">
                                        New order #1234 received
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        2 minutes ago
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Payment processed for ₹850
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        5 minutes ago
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="text-sm text-gray-700">
                                        New member registered
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        10 minutes ago
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Performance Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg
                                className="w-8 h-8 text-blue-600"
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
                        <h4 className="text-lg font-semibold text-gray-900">
                            Revenue Growth
                        </h4>
                        <p className="text-3xl font-bold text-blue-600 mt-2">
                            +24.5%
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            vs last month
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg
                                className="w-8 h-8 text-green-600"
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
                        <h4 className="text-lg font-semibold text-gray-900">
                            Order Completion
                        </h4>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                            98.2%
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            success rate
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg
                                className="w-8 h-8 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">
                            Customer Satisfaction
                        </h4>
                        <p className="text-3xl font-bold text-purple-600 mt-2">
                            4.8/5
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            average rating
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
