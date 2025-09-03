import React from "react";

export default function AdminFooter() {
    return (
        <footer
            className="text-gray-400 mt-auto"
            style={{ backgroundColor: "#1f2937" }}
        >
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <img
                            src="/assets/logo.png"
                            alt="Serve Cafe Logo"
                            className="w-8 h-8 object-contain"
                            style={{ filter: "brightness(0) invert(1)" }}
                        />
                        <div className="text-sm text-gray-400">
                            <span className="font-semibold text-white">
                                SERVE CAFE
                            </span>
                            <span className="ml-2">Admin Dashboard</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <span>© 2024 Serve Cafe. All rights reserved.</span>
                        {/* <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
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
                                Last updated: {new Date().toLocaleDateString()}
                            </span>
                        </div> */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
