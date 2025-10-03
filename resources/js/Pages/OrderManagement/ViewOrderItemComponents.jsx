import React, { useState, useEffect } from "react";

export default function ViewOrderItemComponents({ order, onClose }) {
    const [orderItems, setOrderItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrderItems();
    }, [order.id]);

    const fetchOrderItems = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `/order-items?orderId=${order.id}&headOfficeId=${order.headOfficeId}&branchId=${order.branchId}&tableId=${order.tableId}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    credentials: "same-origin",
                }
            );

            const result = await response.json();

            if (result.success) {
                setOrderItems(result.orderItems);
            } else {
                console.error("Failed to fetch order items:", result.message);
                setOrderItems([]);
            }
        } catch (error) {
            console.error("Error fetching order items:", error);
            setOrderItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    const calculateTotals = () => {
        const totals = orderItems.reduce(
            (acc, item) => {
                const quantity = parseInt(item.quantity) || 0;

                // Calculate totals by multiplying price × quantity (except for tax which is already per item total)
                acc.buyingPrice +=
                    (parseFloat(item.buyingPrice) || 0) * quantity;
                acc.sellingPrice +=
                    (parseFloat(item.sellingPrice) || 0) * quantity;
                acc.taxAmount += parseFloat(item.taxAmount) || 0; // Tax is already total for the item
                acc.adminProfitAmount +=
                    (parseFloat(item.adminProfitAmount) || 0) * quantity;
                acc.adminNetProfitAmount +=
                    (parseFloat(item.adminNetProfitAmount) || 0) * quantity;
                acc.userCommissionAmount +=
                    (parseFloat(item.userCommissionAmount) || 0) * quantity;
                acc.subTotalAmount += parseFloat(item.subTotalAmount) || 0; // SubTotal is already calculated
                acc.totalQuantity += quantity;
                return acc;
            },
            {
                buyingPrice: 0,
                sellingPrice: 0,
                taxAmount: 0,
                adminProfitAmount: 0,
                adminNetProfitAmount: 0,
                userCommissionAmount: 0,
                subTotalAmount: 0,
                totalQuantity: 0,
            }
        );

        return totals;
    };

    const totals = calculateTotals();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full h-[90vh] flex flex-col">
                {/* Fixed Header */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Order Items - #{order.id}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Complete list of items in this order
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="btn btn-ghost btn-circle"
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

                {/* Scrollable Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="loading loading-spinner loading-lg"></div>
                            <span className="ml-3 text-gray-600">
                                Loading order items...
                            </span>
                        </div>
                    ) : orderItems.length > 0 ? (
                        <div className="space-y-6">
                            {/* Order Items Table */}
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Type</th>
                                            <th>Quantity</th>
                                            <th>Buying Price</th>
                                            <th>Selling Price</th>
                                            <th>Tax Amount</th>
                                            <th>Sub Total</th>
                                            <th>Admin Profit</th>
                                            <th>User Commission</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderItems.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div>
                                                        <div className="font-medium">
                                                            {item.menuItem
                                                                ?.menuName ||
                                                                "Unknown Item"}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {item.menuId}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            item.menuItem
                                                                ?.menuType ===
                                                            "food"
                                                                ? "badge-primary"
                                                                : "badge-secondary"
                                                        }`}
                                                    >
                                                        {item.menuItem
                                                            ?.menuType || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="text-center font-medium">
                                                    {item.quantity}
                                                </td>
                                                <td className="font-medium">
                                                    {formatCurrency(
                                                        item.buyingPrice
                                                    )}
                                                </td>
                                                <td className="font-medium">
                                                    {formatCurrency(
                                                        item.sellingPrice
                                                    )}
                                                </td>
                                                <td className="font-medium">
                                                    {formatCurrency(
                                                        item.taxAmount
                                                    )}
                                                </td>
                                                <td className="font-medium text-green-600">
                                                    {formatCurrency(
                                                        item.subTotalAmount
                                                    )}
                                                </td>
                                                <td className="font-medium text-blue-600">
                                                    {formatCurrency(
                                                        item.adminProfitAmount
                                                    )}
                                                </td>
                                                <td className="font-medium text-purple-600">
                                                    {formatCurrency(
                                                        item.userCommissionAmount
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary Section */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Order Summary
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {totals.totalQuantity}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Total Items
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-gray-900">
                                            {formatCurrency(totals.buyingPrice)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Total Buying
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-gray-900">
                                            {formatCurrency(
                                                totals.sellingPrice
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Total Selling
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-blue-600">
                                            {formatCurrency(totals.taxAmount)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Total Tax
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-green-600">
                                            {formatCurrency(
                                                totals.adminProfitAmount
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Admin Profit
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-purple-600">
                                            {formatCurrency(
                                                totals.userCommissionAmount
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            User Commission
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Breakdown */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Financial Breakdown
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600">
                                            Subtotal (Before Tax):
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(
                                                totals.sellingPrice
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600">
                                            Tax Amount:
                                        </span>
                                        <span className="font-medium text-blue-600">
                                            {formatCurrency(totals.taxAmount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600">
                                            Discount Amount:
                                        </span>
                                        <span className="font-medium text-red-600">
                                            {formatCurrency(
                                                order.discountAmount || 0
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-t-2 border-gray-200">
                                        <span className="text-lg font-semibold text-gray-900">
                                            Final Total:
                                        </span>
                                        <span className="text-xl font-bold text-green-600">
                                            {formatCurrency(
                                                totals.sellingPrice +
                                                    totals.taxAmount -
                                                    (order.discountAmount || 0)
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg
                                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No Items Found
                            </h3>
                            <p className="text-gray-500">
                                This order doesn't have any items yet.
                            </p>
                        </div>
                    )}
                </div>

                {/* Fixed Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-end flex-shrink-0 bg-gray-50">
                    <button onClick={onClose} className="btn btn-ghost">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
