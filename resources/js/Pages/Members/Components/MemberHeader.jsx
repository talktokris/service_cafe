import React, { useState, useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";

export default function MemberHeader({
    user,
    onMenuToggle,
    memberType,
    walletBalance = 0,
}) {
    const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const walletRef = useRef(null);
    const accountRef = useRef(null);

    // Submit POST form to /logout (Laravel expects POST)
    function submitLogoutForm() {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/logout";
        const token = document.querySelector('meta[name="csrf-token"]');
        if (token) {
            const csrfInput = document.createElement("input");
            csrfInput.type = "hidden";
            csrfInput.name = "_token";
            csrfInput.value = token.getAttribute("content");
            form.appendChild(csrfInput);
        }
        document.body.appendChild(form);
        form.submit();
    }

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                walletRef.current &&
                !walletRef.current.contains(event.target)
            ) {
                setWalletDropdownOpen(false);
            }
            if (
                accountRef.current &&
                !accountRef.current.contains(event.target)
            ) {
                setAccountDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-3 sm:px-4 lg:px-8">
                {/* Mobile Layout */}
                <div className="lg:hidden">
                    <div className="flex items-center justify-between h-16 px-2">
                        {/* Left side - Menu button and Logo */}
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <button
                                type="button"
                                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 touch-manipulation"
                                onClick={onMenuToggle}
                            >
                                <span className="sr-only">Open sidebar</span>
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>

                            <Link
                                href={
                                    memberType === "free"
                                        ? "/member-f-dashboard"
                                        : "/member-p-dashboard"
                                }
                                className="cursor-pointer min-w-0 flex-1"
                            >
                                <div className="flex items-center space-x-2 min-w-0">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                        <img
                                            src="/assets/art-logo.png"
                                            alt="Serve Cafe Logo"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h1
                                            className="text-sm sm:text-lg font-bold truncate"
                                            style={{ color: "#531414" }}
                                        >
                                            SERVE CAFE
                                        </h1>
                                        <p
                                            className="text-xs font-medium hidden sm:block"
                                            style={{ color: "#DE3032" }}
                                        >
                                            Member Panel
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Right side - User profile only on mobile */}
                        <div className="flex items-center space-x-2">
                            {/* Wallet - Compact on mobile */}
                            <div className="relative" ref={walletRef}>
                                <button
                                    type="button"
                                    className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 focus:outline-none p-1 rounded"
                                    onClick={() =>
                                        setWalletDropdownOpen(
                                            !walletDropdownOpen
                                        )
                                    }
                                >
                                    <svg
                                        className="h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
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
                                    <span className="text-xs font-bold text-green-600">
                                        ₹{walletBalance.toFixed(2)}
                                    </span>
                                </button>

                                {/* Wallet Dropdown Menu */}
                                {walletDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                                        <Link
                                            href={
                                                memberType === "free"
                                                    ? "/free-transactions"
                                                    : "/transactions"
                                            }
                                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() =>
                                                setWalletDropdownOpen(false)
                                            }
                                        >
                                            View Balance
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* User Account Dropdown - Compact on mobile */}
                            <div className="relative" ref={accountRef}>
                                <button
                                    type="button"
                                    className="flex items-center space-x-2 hover:bg-gray-50 px-1 py-1 rounded-md focus:outline-none"
                                    onClick={() =>
                                        setAccountDropdownOpen(
                                            !accountDropdownOpen
                                        )
                                    }
                                >
                                    <div className="relative">
                                        <div className="bg-red-600 text-white rounded-full h-7 w-7 flex items-center justify-center text-xs font-medium">
                                            {user?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "M"}
                                        </div>
                                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-medium text-gray-900 truncate max-w-20">
                                            {user?.name || "Member"}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">
                                            {memberType} Member
                                        </p>
                                    </div>
                                </button>

                                {/* Account Dropdown Menu */}
                                {accountDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <Link
                                            href={
                                                memberType === "free"
                                                    ? "/member-f-dashboard"
                                                    : "/member-p-dashboard"
                                            }
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/profile/password"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Change Password
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Profile Settings
                                        </Link>
                                        <Link
                                            href="/profile/referral"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Change Referral
                                        </Link>
                                        <div className="border-t border-gray-100"></div>
                                        <button
                                            type="button"
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 min-h-[44px] touch-manipulation"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setAccountDropdownOpen(false);
                                                submitLogoutForm();
                                            }}
                                            onTouchEnd={(e) => {
                                                e.preventDefault();
                                                setAccountDropdownOpen(false);
                                                submitLogoutForm();
                                            }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:block">
                    <div className="flex items-center justify-between h-16">
                        {/* Left side - Logo */}
                        <div className="flex items-center">
                            <Link
                                href={
                                    memberType === "free"
                                        ? "/member-f-dashboard"
                                        : "/member-p-dashboard"
                                }
                                className="cursor-pointer"
                            >
                                <div className="flex items-center space-x-3 mr-6">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
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
                                            className="text-xs font-medium hidden sm:block"
                                            style={{ color: "#DE3032" }}
                                        >
                                            Member Panel
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Right side - Wallet, User menu */}
                        <div className="flex items-center space-x-4 ml-auto">
                            {/* Wallet Dropdown */}
                            <div className="relative" ref={walletRef}>
                                <button
                                    type="button"
                                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                                    onClick={() =>
                                        setWalletDropdownOpen(
                                            !walletDropdownOpen
                                        )
                                    }
                                >
                                    <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
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
                                    <span className="text-sm font-medium">
                                        Wallet
                                    </span>
                                    <span className="text-sm font-bold text-green-600">
                                        ₹{walletBalance.toFixed(2)}
                                    </span>
                                    <svg
                                        className="h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
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
                                </button>

                                {/* Wallet Dropdown Menu */}
                                {walletDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <Link
                                            href={
                                                memberType === "free"
                                                    ? "/free-transactions"
                                                    : "/transactions"
                                            }
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() =>
                                                setWalletDropdownOpen(false)
                                            }
                                        >
                                            View Balance
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* User Account Dropdown */}
                            <div className="relative" ref={accountRef}>
                                <button
                                    type="button"
                                    className="flex items-center space-x-3 hover:bg-gray-50 px-2 py-1 rounded-md focus:outline-none"
                                    onClick={() =>
                                        setAccountDropdownOpen(
                                            !accountDropdownOpen
                                        )
                                    }
                                >
                                    <div className="relative">
                                        <div className="bg-red-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                            {user?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "M"}
                                        </div>
                                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user?.name || "Member"}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">
                                            {memberType} Member
                                        </p>
                                    </div>
                                    <svg
                                        className="h-4 w-4 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
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
                                </button>

                                {/* Account Dropdown Menu */}
                                {accountDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <Link
                                            href={
                                                memberType === "free"
                                                    ? "/member-f-dashboard"
                                                    : "/member-p-dashboard"
                                            }
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/profile/password"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Change Password
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Profile Settings
                                        </Link>
                                        <Link
                                            href="/profile/referral"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Change Referral
                                        </Link>
                                        <div className="border-t border-gray-100"></div>
                                        <button
                                            type="button"
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setAccountDropdownOpen(false);
                                                submitLogoutForm();
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
