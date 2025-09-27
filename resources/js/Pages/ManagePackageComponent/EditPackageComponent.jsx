import { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function EditPackageComponent({
    package: pkg,
    onClose,
    onSuccess,
}) {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Helper function to safely format date for HTML input
    const safeDateFormat = (dateString) => {
        if (!dateString) return "";

        // Handle different date formats
        let date;
        try {
            // If it's already in YYYY-MM-DD format, return as is
            if (
                typeof dateString === "string" &&
                /^\d{4}-\d{2}-\d{2}$/.test(dateString)
            ) {
                return dateString;
            }

            // Try to create a Date object
            date = new Date(dateString);

            // Check if the date is valid
            if (isNaN(date.getTime())) {
                console.warn("Invalid date:", dateString);
                return "";
            }

            // Return in YYYY-MM-DD format
            return date.toISOString().split("T")[0];
        } catch (error) {
            console.error(
                "Date formatting error:",
                error,
                "Input:",
                dateString
            );
            return "";
        }
    };

    // Debug logging
    console.log("Package data received:", pkg);
    console.log(
        "Formatted valid_from_date:",
        safeDateFormat(pkg.valid_from_date)
    );
    console.log("Formatted valid_to_date:", safeDateFormat(pkg.valid_to_date));

    const { data, setData, put, processing, errors } = useForm({
        package_name: pkg.package_name || "",
        package_amount: pkg.package_amount || "",
        valid_from_date: safeDateFormat(pkg.valid_from_date),
        valid_to_date: safeDateFormat(pkg.valid_to_date),
        status: pkg.status || 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(`/package-offers/${pkg.id}`, {
            onSuccess: () => {
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                    onSuccess();
                }, 2000);
            },
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-900">
                            Edit Package
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg
                                className="w-6 h-6"
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

                    {/* Package Info */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Package Information
                        </h4>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-900">
                                <span className="font-medium">ID:</span> #
                                {pkg.id}
                            </p>
                            <p className="text-sm text-gray-900">
                                <span className="font-medium">Created:</span>{" "}
                                {new Date(pkg.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Success Message */}
                    {showSuccessMessage && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-green-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">
                                        Package updated successfully!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Two Column Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                {/* Package Name */}
                                <div>
                                    <label
                                        htmlFor="package_name"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Package Name
                                    </label>
                                    <input
                                        type="text"
                                        id="package_name"
                                        value={data.package_name}
                                        onChange={(e) =>
                                            setData(
                                                "package_name",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
                                        placeholder="Enter package name"
                                        maxLength="250"
                                    />
                                    {errors.package_name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.package_name}
                                        </p>
                                    )}
                                </div>

                                {/* Package Amount */}
                                <div>
                                    <label
                                        htmlFor="package_amount"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Package Amount
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">
                                                ₹
                                            </span>
                                        </div>
                                        <input
                                            type="number"
                                            id="package_amount"
                                            value={data.package_amount}
                                            onChange={(e) =>
                                                setData(
                                                    "package_amount",
                                                    e.target.value
                                                )
                                            }
                                            className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
                                            placeholder="0"
                                            min="0"
                                            max="999999"
                                            required
                                        />
                                    </div>
                                    {errors.package_amount && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.package_amount}
                                        </p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label
                                        htmlFor="status"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData(
                                                "status",
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
                                    >
                                        <option value={1}>Active</option>
                                        <option value={0}>Not Active</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                {/* Valid From Date */}
                                <div>
                                    <label
                                        htmlFor="valid_from_date"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Valid From Date
                                    </label>
                                    <input
                                        type="date"
                                        id="valid_from_date"
                                        value={data.valid_from_date}
                                        onChange={(e) =>
                                            setData(
                                                "valid_from_date",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
                                    />
                                    {errors.valid_from_date && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.valid_from_date}
                                        </p>
                                    )}
                                </div>

                                {/* Valid To Date */}
                                <div>
                                    <label
                                        htmlFor="valid_to_date"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Valid To Date
                                    </label>
                                    <input
                                        type="date"
                                        id="valid_to_date"
                                        value={data.valid_to_date}
                                        onChange={(e) =>
                                            setData(
                                                "valid_to_date",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
                                    />
                                    {errors.valid_to_date && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.valid_to_date}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-800 mb-2">
                                Updated Package Preview
                            </h4>
                            <div className="space-y-1 text-sm text-blue-700">
                                <p>
                                    <span className="font-medium">Name:</span>{" "}
                                    {data.package_name || "Unnamed Package"}
                                </p>
                                <p>
                                    <span className="font-medium">Amount:</span>{" "}
                                    {data.package_amount
                                        ? formatCurrency(
                                              parseInt(data.package_amount) || 0
                                          )
                                        : "₹0"}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Valid From:
                                    </span>{" "}
                                    {data.valid_from_date || "Not set"}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Valid To:
                                    </span>{" "}
                                    {data.valid_to_date || "Not set"}
                                </p>
                                <p>
                                    <span className="font-medium">Status:</span>{" "}
                                    {data.status === 1
                                        ? "Active"
                                        : "Not Active"}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing || !data.package_amount}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? "Updating..." : "Update Package"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
