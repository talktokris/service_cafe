import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

export default function LatestActivePackageCard() {
    const [latestPackage, setLatestPackage] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    useEffect(() => {
        // Fetch the latest active package
        fetch("/api/latest-active-package")
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setLatestPackage(data.package);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching latest package:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center animate-pulse">
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
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 animate-pulse">
                            Loading...
                        </p>
                        <p className="text-2xl font-bold text-gray-900 animate-pulse">
                            ₹0.00
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!latestPackage) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                            Latest Active Package
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                            No active packages
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
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
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                        Latest Active Package
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(latestPackage.package_amount || 0)}
                    </p>
                    {latestPackage.package_name && (
                        <p className="text-xs text-gray-500 mt-1">
                            {latestPackage.package_name}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
