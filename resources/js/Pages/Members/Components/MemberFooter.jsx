import React from "react";

export default function MemberFooter() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                    {/* Left side - Branding and Copyright */}
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-3">
                            {/* Square logo with 'sC' */}
                            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    sC
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                            <span className="text-black font-medium">
                                test one
                            </span>

                            <span className="text-gray-400 text-sm">
                                © 2025 Serve Cafe. All rights reserved.
                            </span>
                        </div>
                    </div>

                    {/* Right side - Navigation Links */}
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
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
