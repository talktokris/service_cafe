import React, { useState } from "react";

export default function PayBillComponents({ table, onClose, onSuccess }) {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [amountPaid, setAmountPaid] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock order data
    const orderTotal = 580; // This should come from actual order data

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (paymentMethod === "cash" && amountPaid < orderTotal) {
            alert("Amount paid cannot be less than order total");
            return;
        }

        setIsSubmitting(true);

        try {
            // Mock API call - replace with actual API
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Call success callback
            onSuccess({
                tableId: table.id,
                paymentMethod: paymentMethod,
                amountPaid: amountPaid,
                orderTotal: orderTotal,
                change: paymentMethod === "cash" ? amountPaid - orderTotal : 0,
            });
        } catch (error) {
            console.error("Error processing payment:", error);
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
                            Make Payment - Table {table.tableShortName}
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

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Order Summary
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">
                                    {formatCurrency(orderTotal)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax (0%):</span>
                                <span className="font-medium">
                                    {formatCurrency(0)}
                                </span>
                            </div>
                            <div className="border-t pt-2">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total Amount:</span>
                                    <span className="text-green-600">
                                        {formatCurrency(orderTotal)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-6">
                        <label className="text-sm font-medium text-gray-500 mb-3 block">
                            Payment Method
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cash"
                                    checked={paymentMethod === "cash"}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    className="sr-only"
                                />
                                <div
                                    className={`p-4 border rounded-lg text-center transition-colors ${
                                        paymentMethod === "cash"
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <svg
                                        className="w-8 h-8 mx-auto mb-2 text-yellow-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                    <span className="font-medium">Cash</span>
                                </div>
                            </label>
                            <label className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === "card"}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    className="sr-only"
                                />
                                <div
                                    className={`p-4 border rounded-lg text-center transition-colors ${
                                        paymentMethod === "card"
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <svg
                                        className="w-8 h-8 mx-auto mb-2 text-blue-600"
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
                                    <span className="font-medium">Card</span>
                                </div>
                            </label>
                            <label className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="wallet"
                                    checked={paymentMethod === "wallet"}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    className="sr-only"
                                />
                                <div
                                    className={`p-4 border rounded-lg text-center transition-colors ${
                                        paymentMethod === "wallet"
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <svg
                                        className="w-8 h-8 mx-auto mb-2 text-purple-600"
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
                                    <span className="font-medium">Wallet</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Amount Paid (for cash payments) */}
                    {paymentMethod === "cash" && (
                        <div className="mb-6">
                            <label className="text-sm font-medium text-gray-500 mb-2 block">
                                Amount Paid
                            </label>
                            <input
                                type="number"
                                value={amountPaid}
                                onChange={(e) =>
                                    setAmountPaid(
                                        parseFloat(e.target.value) || 0
                                    )
                                }
                                className="input input-bordered w-full"
                                placeholder="Enter amount paid"
                                min={orderTotal}
                                step="0.01"
                            />
                            {amountPaid > 0 && amountPaid < orderTotal && (
                                <p className="text-red-500 text-sm mt-1">
                                    Amount paid must be at least{" "}
                                    {formatCurrency(orderTotal)}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Change (for cash payments) */}
                    {paymentMethod === "cash" && amountPaid > orderTotal && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-medium text-green-800">
                                    Change to return:
                                </span>
                                <span className="text-2xl font-bold text-green-600">
                                    {formatCurrency(amountPaid - orderTotal)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn bg-green-600 hover:bg-green-700 text-white"
                            disabled={
                                isSubmitting ||
                                (paymentMethod === "cash" &&
                                    amountPaid < orderTotal)
                            }
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading loading-spinner loading-sm mr-2"></span>
                                    Processing...
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
                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                        />
                                    </svg>
                                    Process Payment
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
