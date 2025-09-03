import React, { useState } from "react";
import FindMemberComponent from "./FindMemberComponent";

export default function PayBillComponents({ table, onClose, onSuccess }) {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [billingType, setBillingType] = useState("walking");
    const [amountPaid, setAmountPaid] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showFindMember, setShowFindMember] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock order data
    const orderTotal = 580; // This should come from actual order data
    const finalTotal = orderTotal - discountAmount;

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (paymentMethod === "cash" && amountPaid < finalTotal) {
            alert("Amount paid cannot be less than final total");
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
                billingType: billingType,
                amountPaid: amountPaid,
                orderTotal: orderTotal,
                discountAmount: discountAmount,
                finalTotal: finalTotal,
                selectedMember: selectedMember,
                change: paymentMethod === "cash" ? amountPaid - finalTotal : 0,
            });
        } catch (error) {
            console.error("Error processing payment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMemberSelect = (member) => {
        setSelectedMember(member);
        setShowFindMember(false);
    };

    const handleBillingTypeChange = (type) => {
        setBillingType(type);
        if (type === "walking") {
            setSelectedMember(null);
        } else if (type === "member") {
            setShowFindMember(true);
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
                            {discountAmount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Discount:
                                    </span>
                                    <span className="font-medium text-red-600">
                                        -{formatCurrency(discountAmount)}
                                    </span>
                                </div>
                            )}
                            <div className="border-t pt-2">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total Amount:</span>
                                    <span className="text-green-600">
                                        {formatCurrency(finalTotal)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Billing Type */}
                    <div className="mb-6">
                        <label className="text-sm font-medium text-gray-500 mb-3 block">
                            Billing Type
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="billingType"
                                    value="walking"
                                    checked={billingType === "walking"}
                                    onChange={(e) =>
                                        handleBillingTypeChange(e.target.value)
                                    }
                                    className="sr-only"
                                />
                                <div
                                    className={`p-4 border rounded-lg text-center transition-colors ${
                                        billingType === "walking"
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <svg
                                        className="w-8 h-8 mx-auto mb-2 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span className="font-medium">
                                        Walking Customer
                                    </span>
                                </div>
                            </label>
                            <label className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="billingType"
                                    value="member"
                                    checked={billingType === "member"}
                                    onChange={(e) =>
                                        handleBillingTypeChange(e.target.value)
                                    }
                                    className="sr-only"
                                />
                                <div
                                    className={`p-4 border rounded-lg text-center transition-colors ${
                                        billingType === "member"
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
                                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                        />
                                    </svg>
                                    <span className="font-medium">
                                        Member Customer
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Selected Member Display */}
                    {billingType === "member" && selectedMember && (
                        <div className="mb-6">
                            <label className="text-sm font-medium text-gray-500 mb-3 block">
                                Selected Member
                            </label>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-green-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="font-semibold text-gray-900">
                                                {selectedMember.first_name}{" "}
                                                {selectedMember.last_name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {selectedMember.referral_code} •{" "}
                                                {selectedMember.email}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowFindMember(true)}
                                        className="btn btn-sm btn-outline"
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Method */}
                    <div className="mb-6">
                        <label className="text-sm font-medium text-gray-500 mb-3 block">
                            Payment Method
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    {/* Discount Amount (for walking customers) */}
                    {billingType === "walking" && (
                        <div className="mb-6">
                            <label className="text-sm font-medium text-gray-500 mb-2 block">
                                Discount Amount
                            </label>
                            <input
                                type="number"
                                value={discountAmount}
                                onChange={(e) =>
                                    setDiscountAmount(
                                        parseFloat(e.target.value) || 0
                                    )
                                }
                                className="input input-bordered w-full"
                                placeholder="Enter discount amount"
                                min={0}
                                max={orderTotal}
                                step="0.01"
                            />
                            {discountAmount > orderTotal && (
                                <p className="text-red-500 text-sm mt-1">
                                    Discount cannot exceed order total
                                </p>
                            )}
                        </div>
                    )}

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
                                min={finalTotal}
                                step="0.01"
                            />
                            {amountPaid > 0 && amountPaid < finalTotal && (
                                <p className="text-red-500 text-sm mt-1">
                                    Amount paid must be at least{" "}
                                    {formatCurrency(finalTotal)}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Change (for cash payments) */}
                    {paymentMethod === "cash" && amountPaid > finalTotal && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-medium text-green-800">
                                    Change to return:
                                </span>
                                <span className="text-2xl font-bold text-green-600">
                                    {formatCurrency(amountPaid - finalTotal)}
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
                                    amountPaid < finalTotal)
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

            {/* Find Member Modal */}
            {showFindMember && (
                <FindMemberComponent
                    onClose={() => setShowFindMember(false)}
                    onSelectMember={handleMemberSelect}
                />
            )}
        </div>
    );
}
