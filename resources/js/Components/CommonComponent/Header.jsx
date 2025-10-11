import React from "react";
import { Link } from "@inertiajs/react";

export default function Header({ user = null }) {
    return (
        <div className="bg-white shadow shadow-slate-200 drop-shadow-lg">
            <div className="container mx-auto px-3 sm:px-4">
                <div className="navbar min-h-16 sm:min-h-20">
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost lg:hidden text-gray-700 hover:bg-gray-100 p-2 touch-manipulation"
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
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-white rounded-box w-56 right-0"
                            >
                                <li>
                                    <Link
                                        href="/"
                                        className="text-gray-700 hover:bg-red-50 hover:text-red-600 py-3 px-4 touch-manipulation"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/about"
                                        className="text-gray-700 hover:bg-red-50 hover:text-red-600 py-3 px-4 touch-manipulation"
                                    >
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/services"
                                        className="text-gray-700 hover:bg-red-50 hover:text-red-600 py-3 px-4 touch-manipulation"
                                    >
                                        Services
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/faq"
                                        className="text-gray-700 hover:bg-red-50 hover:text-red-600 py-3 px-4 touch-manipulation"
                                    >
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="text-gray-700 hover:bg-red-50 hover:text-red-600 py-3 px-4 touch-manipulation"
                                    >
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <Link
                            href="/"
                            className="btn btn-ghost text-xl hover:bg-gray-50 p-1 sm:p-2"
                        >
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <img
                                    src="/assets/logo.png"
                                    alt="Serve Cafe Logo"
                                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain flex-shrink-0"
                                />
                                <div className="text-red-800 min-w-0">
                                    <h1 className="text-sm sm:text-lg md:text-xl font-bold truncate">
                                        SERVE CAFE
                                    </h1>
                                    <p className="text-xs text-red-600 hidden sm:block">
                                        Your Flavor Haven
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg px-4 py-2 transition-all duration-200"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg px-4 py-2 transition-all duration-200"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services"
                                    className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg px-4 py-2 transition-all duration-200"
                                >
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg px-4 py-2 transition-all duration-200"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg px-4 py-2 transition-all duration-200"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="navbar-end">
                        {user ? (
                            <div className="dropdown dropdown-end">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="btn btn-ghost btn-circle avatar hover:bg-gray-100 p-1 touch-manipulation"
                                >
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                                        <span className="text-xs sm:text-sm font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-white rounded-box w-56 right-0"
                                >
                                    <li>
                                        <Link
                                            href={
                                                user.user_type === "member" &&
                                                user.member_type === "free"
                                                    ? "/member-f-dashboard"
                                                    : user.user_type ===
                                                          "member" &&
                                                      user.member_type ===
                                                          "paid"
                                                    ? "/member-p-dashboard"
                                                    : "/test-dashboard"
                                            }
                                            className="justify-between"
                                        >
                                            Dashboard
                                            <span className="badge">New</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/change-password">
                                            Change Password
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/profile-settings">
                                            Profile Setting
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/change-referral">
                                            Change Referral
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="text-error"
                                        >
                                            Logout
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <Link
                                    href="/contact"
                                    className="btn btn-outline border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 touch-manipulation"
                                >
                                    <span className="hidden sm:inline">
                                        Contact Us
                                    </span>
                                    <span className="sm:hidden">Contact</span>
                                </Link>
                                <Link
                                    href="/login"
                                    className="btn bg-amber-800 text-white hover:bg-amber-700 font-semibold text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 touch-manipulation"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
