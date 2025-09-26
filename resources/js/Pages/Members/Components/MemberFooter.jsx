import React from "react";

export default function MemberFooter() {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                                SC
                            </span>
                        </div>
                        <span className="text-gray-600 text-sm">
                            © 2025 Serve Cafe. All rights reserved.
                        </span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <a
                            href="#"
                            className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                            Terms of Service
                        </a>
                        <a
                            href="#"
                            className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                            Support
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
