import React from "react";

export default function AdminFooter() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                    {/* Left side - Branding and Copyright */}
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-3">
                            {/* Circular logo with 't' */}
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    t
                                </span>
                            </div>
                            {/* Square logo with 'sC' */}
                            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    sC
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                            <span className="text-white font-medium">
                                Admin Dashboard
                            </span>
                            <span className="text-gray-400 text-sm hidden sm:inline">
                                •
                            </span>
                            <span className="text-gray-400 text-sm">
                                © 2025 Serve Cafe. All rights reserved.
                            </span>
                        </div>
                    </div>

                    {/* Right side - Navigation Links */}
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
                        {/* Cursor button */}
                        <div className="relative">
                            <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 flex items-center space-x-1">
                                <span>Cursor</span>
                                <svg
                                    className="w-3 h-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex flex-wrap justify-center items-center space-x-4 sm:space-x-6">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                            >
                                Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
