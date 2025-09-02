import React, { useState } from "react";

export default function DeleteMenuItemComponents({
    menuItem,
    onClose,
    onSuccess,
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    const handleDelete = async () => {
        setIsSubmitting(true);

        try {
            // Mock API call - replace with actual API
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Call success callback
            onSuccess(menuItem.id);
        } catch (error) {
            console.error("Error deleting menu item:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Delete Menu Item
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

                <div className="p-6">
                    {/* Warning Message */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <svg
                                className="w-6 h-6 text-red-600 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                            <div>
                                <h3 className="text-lg font-semibold text-red-800">
                                    Are you sure you want to delete this item?
                                </h3>
                                <p className="text-red-600 mt-1">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Item Details */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Item to be deleted:
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Menu Item
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {menuItem.menuName}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Price
                                </label>
                                <p className="text-lg font-semibold text-green-600">
                                    {formatCurrency(menuItem.price)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Quantity
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {menuItem.quantity}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Total Amount
                                </label>
                                <p className="text-lg font-semibold text-blue-600">
                                    {formatCurrency(menuItem.total)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="btn btn-ghost"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="btn bg-red-600 hover:bg-red-700 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading loading-spinner loading-sm mr-2"></span>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                    Delete Item
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
