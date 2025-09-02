import React, { useState } from "react";

export default function ViewItemsComponents({
    table,
    onClose,
    onAddItem,
    onEditItem,
    onDeleteItem,
    onMakePayment,
    onPrintReceipt,
    menuItems = [],
}) {
    // Mock order data for the table
    const [orderItems] = useState([
        {
            id: 1,
            menuItemId: 1,
            menuName: "Chicken Burger",
            price: 250,
            quantity: 2,
            total: 500,
        },
        {
            id: 2,
            menuItemId: 2,
            menuName: "Coffee",
            price: 80,
            quantity: 1,
            total: 80,
        },
    ]);

    // Calculate subtotal
    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Table {table.tableShortName} - Order Items
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
                    {/* Order Items Table */}
                    <div className="mb-6">
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>S.N</th>
                                        <th>Menu Items</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th>Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="text-center py-8 text-gray-500"
                                            >
                                                No items in this order
                                            </td>
                                        </tr>
                                    ) : (
                                        orderItems.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="font-medium">
                                                        {item.menuName}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="font-medium text-green-600">
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="font-medium">
                                                        {item.quantity}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="font-medium text-blue-600">
                                                        {formatCurrency(
                                                            item.total
                                                        )}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                onEditItem(item)
                                                            }
                                                            className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                onDeleteItem(
                                                                    item
                                                                )
                                                            }
                                                            className="btn btn-ghost btn-xs text-red-600 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Subtotal Row */}
                        {orderItems.length > 0 && (
                            <div className="mt-4 flex justify-end">
                                <div className="bg-gray-50 rounded-lg p-4 min-w-[300px]">
                                    <div className="flex justify-between items-center text-lg font-semibold">
                                        <span>Sub Total:</span>
                                        <span className="text-green-600">
                                            {formatCurrency(subtotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                        <button
                            onClick={onAddItem}
                            className="btn bg-green-600 hover:bg-green-700 text-white"
                        >
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
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            Add Item
                        </button>

                        <div className="flex space-x-3">
                            <button
                                onClick={onMakePayment}
                                className="btn bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={orderItems.length === 0}
                            >
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
                                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                    />
                                </svg>
                                Make Payment
                            </button>
                            <button
                                onClick={onPrintReceipt}
                                className="btn bg-gray-600 hover:bg-gray-700 text-white"
                                disabled={orderItems.length === 0}
                            >
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
                                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                    />
                                </svg>
                                Print Receipt
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
