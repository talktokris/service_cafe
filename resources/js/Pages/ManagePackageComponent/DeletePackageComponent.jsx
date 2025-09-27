export default function DeletePackageComponent({
    package: pkg,
    onClose,
    onConfirm,
}) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    const formatDate = (date) => {
        if (!date) return "Not set";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-900">
                            Delete Package
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

                    {/* Warning Icon */}
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
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
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>

                    {/* Warning Message */}
                    <div className="text-center mb-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                            Are you sure you want to delete this package?
                        </h4>
                        <p className="text-sm text-gray-500">
                            This action cannot be undone. The package will be
                            permanently removed from the system.
                        </p>
                    </div>

                    {/* Package Information */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                            Package Details
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    ID:
                                </span>
                                <span className="text-gray-900">#{pkg.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Name:
                                </span>
                                <span className="text-gray-900">
                                    {pkg.package_name || "Unnamed Package"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Amount:
                                </span>
                                <span className="text-gray-900 font-semibold">
                                    {formatCurrency(pkg.package_amount || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Valid From:
                                </span>
                                <span className="text-gray-900">
                                    {formatDate(pkg.valid_from_date)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Valid To:
                                </span>
                                <span className="text-gray-900">
                                    {formatDate(pkg.valid_to_date)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Status:
                                </span>
                                <span
                                    className={`font-medium ${
                                        pkg.status === 1
                                            ? "text-green-600"
                                            : "text-yellow-600"
                                    }`}
                                >
                                    {pkg.status === 1 ? "Active" : "Not Active"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                    Created:
                                </span>
                                <span className="text-gray-900">
                                    {formatDate(pkg.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Message */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-red-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Warning
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>
                                        Deleting this package will permanently
                                        remove all associated data. Make sure
                                        you have backed up any important
                                        information before proceeding.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onConfirm(pkg)}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Yes, Delete Package
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
