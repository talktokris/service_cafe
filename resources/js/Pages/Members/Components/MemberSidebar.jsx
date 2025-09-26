import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function MemberSidebar({ isOpen, onClose, user, memberType }) {
    const { url } = usePage();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const menuItems = [
        {
            title: "Dashboard",
            href:
                memberType === "free"
                    ? "/member-f-dashboard"
                    : "/member-p-dashboard",
            icon: (
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
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                    />
                </svg>
            ),
        },
        {
            title: "My Orders",
            href: "/my-orders",
            icon: (
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
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
            ),
        },
        {
            title: "Referral Network",
            href: "/referral-network",
            icon: (
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                </svg>
            ),
        },
        {
            title: "Commission History",
            href: "/commission-history",
            icon: (
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                </svg>
            ),
        },
        {
            title: "Menu",
            href: "/menu",
            icon: (
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
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            ),
        },
        {
            title: "Wallet",
            href: "/wallet",
            icon: (
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
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                </svg>
            ),
            showFor: ["paid"], // Only show for paid members
        },
        {
            title: "Support",
            href: "/support",
            icon: (
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
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
                    />
                </svg>
            ),
        },
    ];

    const filteredMenuItems = menuItems.filter(
        (item) => !item.showFor || item.showFor.includes(memberType)
    );

    return (
        <>
            {/* Mobile sidebar overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}>
                    <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
                </div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo and title */}
                    <div className="flex items-center px-6 py-4 border-b border-gray-700">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        SC
                                    </span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <h1 className="text-white font-bold text-lg">
                                    SERVE CAFE
                                </h1>
                                <p className="text-gray-300 text-xs">
                                    Member Panel
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2">
                        {filteredMenuItems.map((item) => {
                            const isActive = url === item.href;
                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                        isActive
                                            ? "bg-red-600 text-white"
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                                    onClick={onClose}
                                >
                                    <span
                                        className={`mr-3 ${
                                            isActive
                                                ? "text-white"
                                                : "text-gray-400 group-hover:text-white"
                                        }`}
                                    >
                                        {item.icon}
                                    </span>
                                    {item.title}
                                    {isActive && (
                                        <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User profile section */}
                    <div className="px-4 py-4 border-t border-gray-700">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {user?.name?.charAt(0)?.toUpperCase() ||
                                            "M"}
                                    </span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-white font-medium text-sm">
                                    {user?.name || "Member"}
                                </p>
                                <p className="text-gray-300 text-xs capitalize">
                                    {memberType} Member
                                </p>
                            </div>
                            <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
