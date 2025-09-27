import React from "react";
import { Head } from "@inertiajs/react";
import { AdminDashboardLayout } from "../AdminComponents";
import LatestActivePackageCard from "../../ManagePackageComponent/LatestActivePackageCard";

export default function LatestPackageDemo({ auth }) {
    return (
        <AdminDashboardLayout
            title="Latest Active Package - Serve Cafe"
            user={auth.user}
        >
            <Head title="Latest Active Package" />

            <div>
                {/* Breadcrumb */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Latest Active Package
                            </h1>
                            <nav className="flex items-center space-x-2 text-sm mt-1">
                                <span className="font-medium text-gray-600">
                                    Home
                                </span>
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
                                <span className="font-medium text-gray-700">
                                    Latest Active Package
                                </span>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    <div className="max-w-md">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Latest Active Package Card
                        </h2>
                        <LatestActivePackageCard />

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="text-sm font-medium text-blue-800 mb-2">
                                Component Information
                            </h3>
                            <div className="text-sm text-blue-700 space-y-1">
                                <p>
                                    • Fetches the most recent active package
                                    from the database
                                </p>
                                <p>
                                    • Displays package amount in Indian Rupees
                                    (₹)
                                </p>
                                <p>• Shows package name if available</p>
                                <p>• Handles loading states and error cases</p>
                                <p>
                                    • Auto-refreshes when new packages are
                                    created
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
