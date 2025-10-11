import React from "react";
import { Link } from "@inertiajs/react";
import Breadcrumb from "./Breadcrumb";

export default function MemberDashboardComponent({ user, stats, memberType }) {
    const currentHour = new Date().getHours();
    const greeting =
        currentHour < 12
            ? "Good Morning"
            : currentHour < 18
            ? "Good Afternoon"
            : "Good Evening";

    const quickActions = [
        {
            title: "Place Order",
            description: "Browse menu and place new order",
            href: memberType === "paid" ? "/paid-orders" : "/free-orders",
            icon: (
                <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            ),
            color: "bg-blue-600 hover:bg-blue-700",
        },
        {
            title: "Share Referral",
            description: "Share your referral code with friends",
            href: "/share-referral",
            icon: (
                <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                </svg>
            ),
            color: "bg-green-600 hover:bg-green-700",
        },
        {
            title: "View Orders",
            description: "Track your order history",
            href: memberType === "paid" ? "/paid-orders" : "/free-orders",
            icon: (
                <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
            ),
            color: "bg-purple-600 hover:bg-purple-700",
        },
    ];

    const systemStatus = [
        { name: "Order System", status: "Online", color: "green" },
        { name: "Payment Gateway", status: "Active", color: "green" },
        { name: "Referral System", status: "Running", color: "green" },
        { name: "Support", status: "Available", color: "green" },
    ];

    return (
        <div>
            {/* Breadcrumb */}
            <Breadcrumb
                title={
                    memberType === "free"
                        ? "Free Member Dashboard"
                        : "Paid Member Dashboard"
                }
                links={["Home", "Dashboard"]}
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
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                        />
                    </svg>
                }
            />

            {/* Main Content */}
            <div className="p-6 space-y-6">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">
                                {greeting}, {user?.name || "Member"}!
                            </h2>
                            <p className="text-purple-100">
                                Welcome to your{" "}
                                {memberType === "free" ? "Free" : "Paid"} Member
                                Dashboard. Here's what's happening with your
                                account today.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <svg
                                className="h-12 w-12 text-white opacity-80"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
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

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Referrals */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="h-5 w-5 text-green-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
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
                                    Total Referrals
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    0
                                </p>
                                <p className="text-xs text-green-600">
                                    +0% from last month
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Commissions */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="h-5 w-5 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
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
                                    Total Commissions
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    ₹0
                                </p>
                                <p className="text-xs text-blue-600">
                                    +0% from last month
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* This Month's Orders */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="h-5 w-5 text-purple-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
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
                                    This Month's Orders
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    0
                                </p>
                                <p className="text-xs text-purple-600">
                                    +0% from last month
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Wallet Balance (for paid members) */}
                    {memberType === "paid" ? (
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="h-5 w-5 text-orange-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        Wallet Balance
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        ₹0.00
                                    </p>
                                    <p className="text-xs text-orange-600">
                                        Available balance
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="h-5 w-5 text-yellow-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
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
                                        Member Level
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        Free
                                    </p>
                                    <p className="text-xs text-yellow-600">
                                        Upgrade available
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions and System Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {quickActions.map((action, index) => (
                                <Link
                                    key={index}
                                    href={action.href}
                                    className={`${action.color} text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200`}
                                >
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            {action.icon}
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium">
                                                {action.title}
                                            </p>
                                            <p className="text-xs opacity-90">
                                                {action.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            System Status
                        </h3>
                        <div className="space-y-3">
                            {systemStatus.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    <span className="text-sm text-gray-600">
                                        {item.name}
                                    </span>
                                    <div className="flex items-center">
                                        <div
                                            className={`w-2 h-2 rounded-full mr-2 ${
                                                item.color === "green"
                                                    ? "bg-green-500"
                                                    : item.color === "yellow"
                                                    ? "bg-yellow-500"
                                                    : "bg-red-500"
                                            }`}
                                        ></div>
                                        <span className="text-sm text-gray-900">
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Recent Activity
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            <span className="text-sm text-gray-600">
                                Welcome to Serve Cafe! Start by exploring the
                                menu.
                            </span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <span className="text-sm text-gray-600">
                                Your referral code is ready:{" "}
                                <span className="font-mono font-semibold">
                                    {user?.referral_code || "N/A"}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
