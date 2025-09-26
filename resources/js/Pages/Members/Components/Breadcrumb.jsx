import React from "react";

export default function Breadcrumb({ title, links = [], icon }) {
    return (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    {icon || (
                        <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    )}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h1>
                    <nav className="flex items-center space-x-2 text-sm mt-1">
                        {links.map((link, index) => (
                            <React.Fragment key={index}>
                                <span
                                    className={`font-medium ${
                                        index === links.length - 1
                                            ? "text-gray-700"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {link}
                                </span>
                                {index < links.length - 1 && (
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}
