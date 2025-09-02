import React from "react";

export default function ViewMenuComponents({
    menuItem,
    onClose,
    officeProfiles = [],
}) {
    // Get office name by ID
    const getOfficeName = (officeId, type) => {
        if (!officeId) return "N/A";
        const office = officeProfiles.find((profile) => profile.id == officeId);
        return office ? office.companyName : "Unknown";
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!menuItem) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Menu Item Details: {menuItem.menuName}
                        </h2>
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
                </div>

                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Menu Name
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {menuItem.menuName || "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Menu Type
                                </label>
                                <p className="mt-1">
                                    <span
                                        className={`badge ${
                                            menuItem.menuType === "food"
                                                ? "badge-primary"
                                                : "badge-secondary"
                                        }`}
                                    >
                                        {menuItem.menuType}
                                    </span>
                                </p>
                            </div>
                            {menuItem.menuType === "drink" &&
                                menuItem.drinkAmount && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Drink Amount
                                        </label>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {menuItem.drinkAmount} ml
                                        </p>
                                    </div>
                                )}
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Status
                                </label>
                                <p className="mt-1">
                                    <span
                                        className={`badge ${
                                            menuItem.activeStatus === 1
                                                ? "badge-success"
                                                : "badge-warning"
                                        }`}
                                    >
                                        {menuItem.activeStatus === 1
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Office Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Office Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Head Office
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {getOfficeName(
                                        menuItem.headOfficeId,
                                        "HeadOffice"
                                    )}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Branch Office
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {getOfficeName(
                                        menuItem.branchId,
                                        "BranchOffice"
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Pricing Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Buying Price
                                </label>
                                <p className="text-lg font-semibold text-green-600">
                                    {formatCurrency(menuItem.buyingPrice)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Selling Price
                                </label>
                                <p className="text-lg font-semibold text-blue-600">
                                    {formatCurrency(menuItem.sellingPrice)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Profit & Commission */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Profit & Commission
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Admin Profit Percentage
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {menuItem.adminProfitPercentage || 0}%
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Admin Profit Amount
                                </label>
                                <p className="text-lg font-semibold text-green-600">
                                    {formatCurrency(menuItem.adminProfitAmount)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    User Commission Percentage
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {menuItem.userCommissionPercentage || 0}%
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    User Commission Amount
                                </label>
                                <p className="text-lg font-semibold text-purple-600">
                                    {formatCurrency(
                                        menuItem.userCommissionAmount
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Timestamps
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Created At
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {formatDate(menuItem.created_at)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Updated At
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {formatDate(menuItem.updated_at)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end pt-6 border-t border-gray-200">
                        <button onClick={onClose} className="btn btn-primary">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
