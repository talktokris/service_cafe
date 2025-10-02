import React from "react";
import { Link } from "@inertiajs/react";

export default function Header({ user = null }) {
    return (
        <div className="bg-white shadow shadow-slate-200 drop-shadow-lg">
            <div className="container mx-auto px-4">
                <div className="navbar min-h-20">
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost lg:hidden text-gray-700 hover:bg-gray-100"
                            >
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
                                        d="M4 6h16M4 12h8m-8 6h16"
                                    />
                                </svg>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-white rounded-box w-52"
                            >
                                <li>
                                    <Link
                                        href="/"
                                        className="text-gray-700 hover:bg-red-50 hover:text-red-600"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/about"
                                        className="text-gray-700 hover:bg-red-50 hover:text-red-600"
                                    >
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/services"
                                        className="text-gray-700 hover:bg-red-50 hover:text-red-600"
                                    >
                                        Services
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/faq"
                                        className="text-gray-700 hover:bg-red-50 hover:text-red-600"
                                    >
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="text-gray-700 hover:bg-red-50 hover:text-red-600"
                                    >
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <Link
                            href="/"
                            className="btn btn-ghost text-xl hover:bg-gray-50"
                        >
                            <div className="flex items-center space-x-3">
                                <img
                                    src="/assets/logo.png"
                                    alt="Serve Cafe Logo"
                                    className="w-12 h-12 object-contain"
                                />
                                <div className="text-red-800">
                                    <h1 className="text-xl font-bold">
                                        SERVE CAFE
                                    </h1>
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
                                    className="btn btn-ghost btn-circle avatar hover:bg-gray-100"
                                >
                                    <div className="w-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                                        <span className="text-sm font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-white rounded-box w-52"
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
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/contact"
                                    className="btn btn-outline border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white"
                                >
                                    Contact Us
                                </Link>
                                <Link
                                    href="/subscribe"
                                    className="btn bg-amber-800 text-white hover:bg-amber-700 font-semibold"
                                >
                                    Subscribe Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
