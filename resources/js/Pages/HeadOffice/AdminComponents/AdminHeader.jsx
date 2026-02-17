import React from "react";
import { Link } from "@inertiajs/react";

export default function AdminHeader({
    user = null,
    onMenuToggle,
    walletBalance = 0,
}) {
    return (
        <div
            className="bg-white shadow-lg border-b"
            style={{ borderColor: "#e9ecef" }}
        >
            <div className="max-w-full mx-auto px-6">
                <div className="navbar min-h-20">
                    {/* Left side - Logo and Menu Toggle */}
                    <div className="navbar-start">
                        <div className="flex items-center space-x-4">
                            {/* Menu Toggle Button for Mobile */}
                            <button
                                onClick={onMenuToggle}
                                className="btn btn-ghost btn-square lg:hidden hover:bg-gray-100 transition-colors duration-200"
                                style={{ color: "#531414" }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h8m-8 6h16"
                                    />
                                </svg>
                            </button>

                            {/* Logo */}
                            <Link href="/dashboard" className="cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center  overflow-hidden">
                                        <img
                                            src="/assets/art-logo.png"
                                            alt="Serve Cafe Logo"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h1
                                            className="text-xl font-bold"
                                            style={{ color: "#531414" }}
                                        >
                                            SERVE CAFE
                                        </h1>
                                        <p
                                            className="text-xs font-medium"
                                            style={{ color: "#DE3032" }}
                                        >
                                            Admin Panel
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Center - Search Bar */}
                    <div className="navbar-center hidden lg:flex">
                        <div className="form-control">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search orders, customers, products..."
                                    className="input input-bordered w-96 pl-12 pr-4 py-3 rounded-xl border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-200"
                                    style={{
                                        backgroundColor: "#f8f9fa",
                                        borderColor: "#e9ecef",
                                    }}
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        style={{ color: "#DE3032" }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - User Info and Actions */}
                    <div className="navbar-end">
                        <div className="flex items-center space-x-4">
                            {/* Wallet Balance */}
                            <div className="dropdown dropdown-end">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="btn btn-ghost hover:bg-gray-50 transition-colors duration-200 rounded-xl px-4 py-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{
                                                backgroundColor: "#f8f9fa",
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                style={{ color: "#DE3032" }}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                                />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div
                                                className="text-xs font-medium"
                                                style={{ color: "#531414" }}
                                            >
                                                Wallet
                                            </div>
                                            <div
                                                className="text-sm font-bold"
                                                style={{ color: "#DE3032" }}
                                            >
                                                ₹
                                                {walletBalance?.toFixed(2) ||
                                                    "0.00"}
                                            </div>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            style={{ color: "#531414" }}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-[1] menu p-2 shadow-xl bg-white rounded-xl w-56 border"
                                    style={{ borderColor: "#e9ecef" }}
                                >
                                    <li>
                                        <Link
                                            href="/wallet"
                                            className="text-sm hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                            style={{ color: "#531414" }}
                                        >
                                            View Wallet Details
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/wallet/transactions"
                                            className="text-sm hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                            style={{ color: "#531414" }}
                                        >
                                            Transaction History
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* User Profile */}
                            <div className="dropdown dropdown-end">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="btn btn-ghost hover:bg-gray-50 transition-colors duration-200 rounded-xl px-4 py-2"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-10 h-10 rounded-full text-white flex items-center justify-center shadow-lg"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #531414, #DE3032)",
                                            }}
                                        >
                                            <span className="text-sm font-bold">
                                                {user?.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "U"}
                                            </span>
                                        </div>
                                        <div className="text-left hidden sm:block">
                                            <div
                                                className="text-sm font-semibold"
                                                style={{ color: "#531414" }}
                                            >
                                                {user?.name || "User"}
                                            </div>
                                            <div
                                                className="text-xs font-medium"
                                                style={{ color: "#DE3032" }}
                                            >
                                                {user?.primary_role?.name ||
                                                    "Admin"}
                                            </div>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            style={{ color: "#531414" }}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-[1] menu p-2 shadow-xl bg-white rounded-xl w-56 border"
                                    style={{ borderColor: "#e9ecef" }}
                                >
                                    <li>
                                        <Link
                                            href="/profile"
                                            className="text-sm hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                            style={{ color: "#531414" }}
                                        >
                                            Profile Settings
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/profile/password"
                                            className="text-sm hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                            style={{ color: "#531414" }}
                                        >
                                            Change Password
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/profile/referral"
                                            className="text-sm hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                            style={{ color: "#531414" }}
                                        >
                                            Change Referral
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/settings"
                                            className="text-sm hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                            style={{ color: "#531414" }}
                                        >
                                            Account Settings
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/notifications"
                                            className="text-sm hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                            style={{ color: "#531414" }}
                                        >
                                            Notifications
                                        </Link>
                                    </li>
                                    <div
                                        className="divider my-1"
                                        style={{ borderColor: "#e9ecef" }}
                                    ></div>
                                    <li>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="text-sm hover:bg-red-50 rounded-lg transition-colors duration-200"
                                            style={{ color: "#DE3032" }}
                                        >
                                            Logout
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
