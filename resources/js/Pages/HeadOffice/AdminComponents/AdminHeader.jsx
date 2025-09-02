import React from "react";
import { Link } from "@inertiajs/react";

export default function AdminHeader({ user = null, onMenuToggle }) {
    return (
        <div className="bg-white shadow-lg border-b border-gray-200">
            <div className="div mx-auto px-4 w-full">
                <div className="navbar min-h-16">
                    {/* Left side - Logo and Menu Toggle */}
                    <div className="navbar-start">
                        <div className="flex items-center space-x-4">
                            {/* Menu Toggle Button for Mobile */}
                            <button
                                onClick={onMenuToggle}
                                className="btn btn-ghost btn-square lg:hidden"
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
                            <Link
                                href="/dashboard"
                                className="btn btn-ghost hover:bg-gray-50"
                            >
                                <div className="flex items-center space-x-3">
                                    <img
                                        src="/assets/logo.png"
                                        alt="Serve Cafe Logo"
                                        className="w-12 h-12 object-contain"
                                    />
                                    <div className="text-red-800">
                                        <h1 className="text-lg font-bold">
                                            SERVE CAFE
                                        </h1>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Center - Search Bar */}
                    <div className="navbar-center hidden md:flex">
                        <div className="form-control">
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Search orders, customers, products..."
                                    className="input input-bordered w-96"
                                />
                                <button className="btn btn-square">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </button>
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
                                    className="btn btn-ghost hover:bg-gray-50"
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-600"
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
                                        <span className="text-sm font-medium">
                                            Wallet: ₹
                                            {user?.wallet?.balance || "0.00"}
                                        </span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
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
                                    className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-box w-52"
                                >
                                    <li>
                                        <Link
                                            href="/wallet"
                                            className="text-sm"
                                        >
                                            View Wallet Details
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/wallet/transactions"
                                            className="text-sm"
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
                                    className="btn btn-ghost hover:bg-gray-50"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center">
                                            <span className="text-sm font-semibold">
                                                {user?.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "U"}
                                            </span>
                                        </div>
                                        <div className="text-left hidden sm:block">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user?.name || "User"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {user?.primary_role || "Admin"}
                                            </div>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
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
                                    className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-box w-52"
                                >
                                    <li>
                                        <Link
                                            href="/profile"
                                            className="text-sm"
                                        >
                                            Profile Settings
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/settings"
                                            className="text-sm"
                                        >
                                            Account Settings
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/notifications"
                                            className="text-sm"
                                        >
                                            Notifications
                                        </Link>
                                    </li>
                                    <div className="divider my-1"></div>
                                    <li>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="text-error text-sm"
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
