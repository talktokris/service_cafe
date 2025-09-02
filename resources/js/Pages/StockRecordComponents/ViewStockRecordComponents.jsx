import React from "react";

export default function ViewStockRecordComponents({
    stockRecord,
    onClose,
    officeProfiles = [],
    stockItemSettings = [],
}) {
    // Get office name by ID
    const getOfficeName = (officeId, type) => {
        if (!officeId) return "N/A";
        const office = officeProfiles.find((profile) => profile.id == officeId);
        return office ? office.companyName : "Unknown";
    };

    // Get stock item name by ID
    const getStockItemName = (stockItemId) => {
        if (!stockItemId) return "N/A";
        const stockItem = stockItemSettings.find(
            (item) => item.id == stockItemId
        );
        return stockItem ? stockItem.itemName : "Unknown";
    };

    // Format currency
    const formatCurrency = (amount) => {
        const numAmount = parseFloat(amount) || 0;
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(numAmount);
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

    if (!stockRecord) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Stock Record Details:{" "}
                            {getStockItemName(stockRecord.stockItemSettingId)}
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
                                    Stock Item
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {getStockItemName(
                                        stockRecord.stockItemSettingId
                                    )}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Item Type
                                </label>
                                <p className="mt-1">
                                    <span
                                        className={`badge ${
                                            stockRecord.itemType === "food"
                                                ? "badge-primary"
                                                : "badge-secondary"
                                        }`}
                                    >
                                        {stockRecord.itemType}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Quantity
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {stockRecord.quantity || 0}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Status
                                </label>
                                <p className="mt-1">
                                    <span
                                        className={`badge ${
                                            stockRecord.activeStatus === 1
                                                ? "badge-success"
                                                : "badge-warning"
                                        }`}
                                    >
                                        {stockRecord.activeStatus === 1
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
                                        stockRecord.headOfficeId,
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
                                        stockRecord.branchId,
                                        "BranchOffice"
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Item Details */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Item Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Item Amount
                                </label>
                                <p className="text-lg font-semibold text-green-600">
                                    {formatCurrency(stockRecord.itemAmount)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Mass Weight (KG)
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {stockRecord.itemMassWeightKG || 0} KG
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Liquid Weight (ML)
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {stockRecord.itemLiquidWeightML || 0} ML
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Calculated Totals */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Calculated Totals
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Total Amount
                                </label>
                                <p className="text-lg font-semibold text-blue-600">
                                    {formatCurrency(
                                        stockRecord.itemAmountTotal
                                    )}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Total Mass Weight (KG)
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {stockRecord.itemMassWeightKGTotal || 0} KG
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Total Liquid Weight (ML)
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {stockRecord.itemLiquidWeightMLTotal || 0}{" "}
                                    ML
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
                                    {formatDate(stockRecord.created_at)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Updated At
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {formatDate(stockRecord.updated_at)}
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
