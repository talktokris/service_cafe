import React, { useState } from "react";

export default function TableUserConfirmComponent({
    table,
    user,
    onClose,
    onConfirm,
}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        console.log("handleConfirm called");
        setIsLoading(true);

        try {
            // Create new order data
            const orderData = {
                headOfficeId: user.headOfficeId,
                branchId: user.branchId,
                createUserId: user.id,
                tableId: table.id,
                tableOccupiedStatus: 1,
                buyingPrice: 0,
                sellingPrice: 0,
                discountAmount: 0,
                taxAmount: 0,
                adminProfitAmount: 0,
                adminNetProfitAmount: 0,
                userCommissionAmount: 0,
                customerType: "walking", // Default to walking customer
                memberUserId: null,
                orderStaredDateTime: new Date().toISOString(),
                orderEndDateTime: null,
                paymentType: "cash", // Default to cash
                paymentReference: null,
                notes: null,
                paymentStatus: 0, // Not paid yet
                deleteStatus: 0,
            };

            // Get CSRF token
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");
            console.log("CSRF Token:", csrfToken);
            console.log("Order Data:", orderData);

            // Submit the order creation using fetch
            const response = await fetch("/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                    Accept: "application/json",
                },
                credentials: "same-origin",
                body: JSON.stringify(orderData),
            });

            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Response result:", result);

            if (result.success) {
                setIsLoading(false);
                onConfirm();
            } else {
                console.error("Error creating order:", result.message);
                setIsLoading(false);
                alert(
                    "Error creating order: " +
                        (result.message || "Unknown error")
                );
            }
        } catch (error) {
            console.error("Error creating order:", error);
            setIsLoading(false);
            alert("Error creating order: " + error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Confirm Table Usage
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            disabled={isLoading}
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

                {/* Content */}
                <div className="px-6 py-6">
                    {/* Table Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-600">
                                    {table.tableShortName || "T"}
                                </span>
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">
                                {table.tableShortName || "Table"}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {table.tableShortFullName ||
                                    "Table Description"}
                            </p>
                        </div>
                    </div>

                    {/* Confirmation Message */}
                    <div className="text-center mb-6">
                        <p className="text-gray-700 text-lg">
                            Are you sure you want to use this table?
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            This will mark the table as occupied and allow you
                            to start taking orders.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                            disabled={isLoading}
                        >
                            No, Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Creating...
                                </div>
                            ) : (
                                "Yes, Use Table"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
