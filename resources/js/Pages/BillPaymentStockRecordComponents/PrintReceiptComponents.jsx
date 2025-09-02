import React, { useState } from "react";

export default function PrintReceiptComponents({ table, onClose }) {
    const [isPrinting, setIsPrinting] = useState(false);

    // Mock order data
    const orderData = {
        orderId: "ORD-001",
        tableName: table.tableShortName,
        items: [
            {
                id: 1,
                menuName: "Chicken Burger",
                price: 250,
                quantity: 2,
                total: 500,
            },
            {
                id: 2,
                menuName: "Coffee",
                price: 80,
                quantity: 1,
                total: 80,
            },
        ],
        subtotal: 580,
        tax: 0,
        total: 580,
        paymentMethod: "Cash",
        amountPaid: 600,
        change: 20,
        timestamp: new Date().toLocaleString(),
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    const handlePrint = () => {
        setIsPrinting(true);

        // Simulate print delay
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Print Receipt - Table {table.tableShortName}
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
                    {/* Receipt Preview */}
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6 print:border-none print:shadow-none">
                        {/* Receipt Header */}
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Serve Cafe
                            </h1>
                            <p className="text-gray-600">
                                123 Main Street, City, State 12345
                            </p>
                            <p className="text-gray-600">
                                Phone: +1 (555) 123-4567
                            </p>
                        </div>

                        {/* Receipt Details */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Order ID:</span>
                                <span className="font-medium">
                                    {orderData.orderId}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Table:</span>
                                <span className="font-medium">
                                    {orderData.tableName}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">
                                    Date & Time:
                                </span>
                                <span className="font-medium">
                                    {orderData.timestamp}
                                </span>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="mb-6">
                            <div className="border-b border-gray-200 pb-2 mb-4">
                                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600">
                                    <div>Item</div>
                                    <div className="text-center">Qty</div>
                                    <div className="text-right">Price</div>
                                    <div className="text-right">Total</div>
                                </div>
                            </div>
                            {orderData.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-4 gap-4 py-2 border-b border-gray-100"
                                >
                                    <div className="text-sm">
                                        {item.menuName}
                                    </div>
                                    <div className="text-center text-sm">
                                        {item.quantity}
                                    </div>
                                    <div className="text-right text-sm">
                                        {formatCurrency(item.price)}
                                    </div>
                                    <div className="text-right text-sm font-medium">
                                        {formatCurrency(item.total)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">
                                    {formatCurrency(orderData.subtotal)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Tax:</span>
                                <span className="font-medium">
                                    {formatCurrency(orderData.tax)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-t border-gray-200 pt-2">
                                <span className="text-lg font-semibold">
                                    Total:
                                </span>
                                <span className="text-lg font-bold text-green-600">
                                    {formatCurrency(orderData.total)}
                                </span>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">
                                    Payment Method:
                                </span>
                                <span className="font-medium">
                                    {orderData.paymentMethod}
                                </span>
                            </div>
                            {orderData.paymentMethod === "Cash" && (
                                <>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">
                                            Amount Paid:
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(
                                                orderData.amountPaid
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">
                                            Change:
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(orderData.change)}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="text-center text-sm text-gray-500">
                            <p>Thank you for your visit!</p>
                            <p>Please come again</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="btn btn-ghost"
                            disabled={isPrinting}
                        >
                            Close
                        </button>
                        <button
                            onClick={handlePrint}
                            className="btn bg-gray-600 hover:bg-gray-700 text-white"
                            disabled={isPrinting}
                        >
                            {isPrinting ? (
                                <>
                                    <span className="loading loading-spinner loading-sm mr-2"></span>
                                    Printing...
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
                                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                        />
                                    </svg>
                                    Print Receipt
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
