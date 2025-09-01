import React from "react";
import { Head } from "@inertiajs/react";

export default function AppLayout({ children, title }) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-base-100">
                {/* Header */}
                <header className="navbar bg-base-100 shadow-sm">
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost lg:hidden"
                            >
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
                                        d="M4 6h16M4 12h8m-8 6h16"
                                    />
                                </svg>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                            >
                                <li>
                                    <a>Home</a>
                                </li>
                                <li>
                                    <a>About</a>
                                </li>
                                <li>
                                    <a>Contact</a>
                                </li>
                            </ul>
                        </div>
                        <a className="btn btn-ghost text-xl">🍽️ ServeCafe</a>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">
                            <li>
                                <a>Home</a>
                            </li>
                            <li>
                                <a>About</a>
                            </li>
                            <li>
                                <a>Contact</a>
                            </li>
                        </ul>
                    </div>
                    <div className="navbar-end">
                        <a className="btn btn-primary">Login</a>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8">{children}</main>

                {/* Footer */}
                <footer className="footer footer-center p-4 bg-base-200 text-base-content">
                    <aside>
                        <p>
                            Copyright © 2024 - ServeCafe Restaurant Management
                            System
                        </p>
                    </aside>
                </footer>
            </div>
        </>
    );
}
