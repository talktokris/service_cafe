import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function AdminSidebar({ isOpen, onClose, user }) {
    const { url } = usePage();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const menuItems = [
        {
            title: "Dashboard",
            href: "/dashboard",
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
            title: "Bill Payment",
            href: "/bill-payment",
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
        },
        {
            title: "Order Management",
            href: "/orders",
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
            title: "OTP Orders",
            href: "/otp-orders",
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                </svg>
            ),
        },
        {
            title: "Member Management",
            href: "/manage-members",
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
            title: "Menu Management",
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
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
            ),
        },
        {
            title: "Stock Management",
            href: "/stock-management",
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
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                </svg>
            ),
        },
        {
            title: "Users Tracking",
            href: "/users-tracking",
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
            ),
        },
        {
            title: "Branch Management",
            href: "/branches",
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                </svg>
            ),
        },
        {
            title: "Settings",
            href: "/settings",
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
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            ),
            submenu: [
                {
                    title: "Manage Tables",
                    href: "/manage-tables",
                    icon: (
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
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                    ),
                },
                {
                    title: "Stock Item Settings",
                    href: "/stock-item-settings-page",
                    icon: (
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
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                        </svg>
                    ),
                },
                {
                    title: "Package Setup",
                    href: "/package-setup",
                    icon: (
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
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                        </svg>
                    ),
                },
            ],
        },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-72 shadow-xl border-r transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:static lg:inset-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                style={{
                    background: "linear-gradient(to bottom, #f8f9fa, #ffffff)",
                    borderColor: "#e9ecef",
                }}
            >
                {/* Sidebar Header */}
                <div
                    className="p-4 border-b"
                    style={{
                        borderColor: "#e9ecef",
                        background: "linear-gradient(135deg, #f8f9fa, #ffffff)",
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{
                                    backgroundColor: "#f8f9fa",
                                    border: "2px solid #e9ecef",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                                }}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    style={{ color: "#DE3032" }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3
                                    className="text-lg font-bold"
                                    style={{ color: "#531414" }}
                                >
                                    Menu
                                </h3>
                                <p
                                    className="text-xs font-medium"
                                    style={{ color: "#DE3032" }}
                                >
                                    Quick Access
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1.5 rounded-md transition-colors duration-200"
                            style={{
                                backgroundColor: "transparent",
                                color: "#531414",
                            }}
                            onMouseEnter={(e) =>
                                (e.target.style.backgroundColor = "#e9ecef")
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = "transparent")
                            }
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="space-y-1">
                        {/* <div
                            className="text-xs font-bold uppercase tracking-wider mb-4 px-3"
                            style={{ color: "#531414" }}
                        >
                            Main Menu
                        </div> */}
                        {menuItems.map((item, index) => {
                            const isActive = url === item.href;
                            const isSettings = item.title === "Settings";

                            return (
                                <div key={index} className="mb-1">
                                    {isSettings ? (
                                        <button
                                            onClick={() =>
                                                setIsSettingsOpen(
                                                    !isSettingsOpen
                                                )
                                            }
                                            className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left ${
                                                isActive
                                                    ? "text-white shadow-lg"
                                                    : "hover:shadow-sm"
                                            }`}
                                            style={
                                                isActive
                                                    ? {
                                                          background:
                                                              "linear-gradient(135deg, #531414, #DE3032)",
                                                          boxShadow:
                                                              "0 10px 15px -3px rgba(83, 20, 20, 0.3)",
                                                      }
                                                    : {
                                                          color: "#531414",
                                                          backgroundColor:
                                                              "transparent",
                                                      }
                                            }
                                            onMouseEnter={(e) => {
                                                if (!isActive) {
                                                    e.target.style.backgroundColor =
                                                        "#f8f9fa";
                                                    e.target.style.color =
                                                        "#531414";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    e.target.style.backgroundColor =
                                                        "transparent";
                                                    e.target.style.color =
                                                        "#531414";
                                                }
                                            }}
                                        >
                                            <span
                                                className="transition-colors duration-200"
                                                style={{
                                                    color: isActive
                                                        ? "white"
                                                        : "#DE3032",
                                                }}
                                            >
                                                {item.icon}
                                            </span>
                                            <span className="flex-1">
                                                {item.title}
                                            </span>
                                            <svg
                                                className={`w-4 h-4 transition-transform duration-200 ${
                                                    isSettingsOpen
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                style={{
                                                    color: isActive
                                                        ? "white"
                                                        : "#DE3032",
                                                }}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </button>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                                isActive
                                                    ? "text-white shadow-lg"
                                                    : "hover:shadow-sm"
                                            }`}
                                            style={
                                                isActive
                                                    ? {
                                                          background:
                                                              "linear-gradient(135deg, #531414, #DE3032)",
                                                          boxShadow:
                                                              "0 10px 15px -3px rgba(83, 20, 20, 0.3)",
                                                      }
                                                    : {
                                                          color: "#531414",
                                                          backgroundColor:
                                                              "transparent",
                                                      }
                                            }
                                            onMouseEnter={(e) => {
                                                if (!isActive) {
                                                    e.target.style.backgroundColor =
                                                        "#f8f9fa";
                                                    e.target.style.color =
                                                        "#531414";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    e.target.style.backgroundColor =
                                                        "transparent";
                                                    e.target.style.color =
                                                        "#531414";
                                                }
                                            }}
                                            onClick={onClose}
                                        >
                                            <span
                                                className="transition-colors duration-200"
                                                style={{
                                                    color: isActive
                                                        ? "white"
                                                        : "#DE3032",
                                                }}
                                            >
                                                {item.icon}
                                            </span>
                                            <span className="flex-1">
                                                {item.title}
                                            </span>
                                            {isActive && (
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            )}
                                        </Link>
                                    )}
                                    {item.submenu &&
                                        isSettings &&
                                        isSettingsOpen && (
                                            <div className="ml-8 mt-2 space-y-1">
                                                {item.submenu.map(
                                                    (subItem, subIndex) => {
                                                        const isSubActive =
                                                            url ===
                                                            subItem.href;
                                                        return (
                                                            <Link
                                                                key={subIndex}
                                                                href={
                                                                    subItem.href
                                                                }
                                                                className="group flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-all duration-200"
                                                                style={
                                                                    isSubActive
                                                                        ? {
                                                                              backgroundColor:
                                                                                  "#f8f9fa",
                                                                              color: "#531414",
                                                                              borderLeft:
                                                                                  "2px solid #DE3032",
                                                                          }
                                                                        : {
                                                                              color: "#531414",
                                                                              backgroundColor:
                                                                                  "transparent",
                                                                          }
                                                                }
                                                                onMouseEnter={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        !isSubActive
                                                                    ) {
                                                                        e.target.style.backgroundColor =
                                                                            "#f8f9fa";
                                                                        e.target.style.color =
                                                                            "#531414";
                                                                    }
                                                                }}
                                                                onMouseLeave={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        !isSubActive
                                                                    ) {
                                                                        e.target.style.backgroundColor =
                                                                            "transparent";
                                                                        e.target.style.color =
                                                                            "#531414";
                                                                    }
                                                                }}
                                                                onClick={
                                                                    onClose
                                                                }
                                                            >
                                                                <span
                                                                    className="transition-colors duration-200"
                                                                    style={{
                                                                        color: isSubActive
                                                                            ? "#DE3032"
                                                                            : "#DE3032",
                                                                    }}
                                                                >
                                                                    {
                                                                        subItem.icon
                                                                    }
                                                                </span>
                                                                <span className="font-medium">
                                                                    {
                                                                        subItem.title
                                                                    }
                                                                </span>
                                                            </Link>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        )}
                                </div>
                            );
                        })}
                    </div>

                    {/* User Info Section */}
                    <div
                        className="mt-8 pt-6"
                        style={{ borderTop: "1px solid #e9ecef" }}
                    >
                        <div
                            className="flex items-center space-x-3 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                            style={{
                                background:
                                    "linear-gradient(135deg, #f8f9fa, #ffffff)",
                                border: "1px solid #e9ecef",
                            }}
                        >
                            <div
                                className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #531414, #DE3032)",
                                }}
                            >
                                <span className="text-lg font-bold">
                                    {user?.name?.charAt(0)?.toUpperCase() ||
                                        "U"}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-sm font-semibold truncate"
                                    style={{ color: "#531414" }}
                                >
                                    {user?.name || "User"}
                                </p>
                                <p
                                    className="text-xs truncate font-medium"
                                    style={{ color: "#DE3032" }}
                                >
                                    {user?.primary_role?.name || "Admin"}
                                </p>
                            </div>
                            <div
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{ backgroundColor: "#DE3032" }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
