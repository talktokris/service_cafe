import React, { useState, useEffect } from "react";
import FindMemberComponent from "./FindMemberComponent";

export default function PayBillComponents({ table, onClose, onSuccess }) {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [billingType, setBillingType] = useState("walking");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [paymentReference, setPaymentReference] = useState("");
    const [paymentOtp, setPaymentOtp] = useState("");
    const [notes, setNotes] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);
    const [memberBalance, setMemberBalance] = useState(0);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [showFindMember, setShowFindMember] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);

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

        setIsSubmitting(true);

        try {
            // Get CSRF token
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content") || "";

            // Prepare payment data
            const paymentData = {
                tableId: table.id,
                paymentMethod: paymentMethod,
                billingType: billingType,
                orderTotal: orderTotal,
                discountAmount: discountAmount,
                finalTotal: finalTotal,
                paymentReference: paymentReference,
                notes: notes,
                selectedMember: selectedMember,
            };

            // Call the payment processing API
            const response = await fetch("/process-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                },
                credentials: "same-origin",
                body: JSON.stringify(paymentData),
            });

            const result = await response.json();

            if (result.success) {
                // Store payment result and show success modal
                setPaymentResult(result);
                setShowSuccessModal(true);
            } else {
                // Show error message
                alert(
                    result.message ||
                        "Payment processing failed. Please try again."
                );
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("Payment processing failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        setPaymentResult(null);

        // Call the original success callback to close all modals and refresh
        onSuccess({
            tableId: table.id,
            paymentMethod: paymentMethod,
            billingType: billingType,
            orderTotal: orderTotal,
            discountAmount: discountAmount,
            finalTotal: finalTotal,
            paymentReference: paymentReference,
            notes: notes,
            selectedMember: selectedMember,
            paymentProcessed: true,
        });
    };

    const handleMemberSelect = (member) => {
        setSelectedMember(member);
        setShowFindMember(false);
    };

    const handleBillingTypeChange = (type) => {
        setBillingType(type);
        if (type === "walking") {
            setSelectedMember(null);
            setPaymentMethod("cash"); // Reset to cash for walking customers
        } else if (type === "member") {
            setShowFindMember(true);
            setPaymentMethod("wallet"); // Auto-select wallet for members
            setDiscountAmount(0); // Reset discount for members
        }
    };

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
        // Reset payment reference when changing payment method
        if (method !== "online") {
            setPaymentReference("");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Make Payment - Table {table.tableShortName}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg
                                className="w-5 h-5"
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

                <form
                    onSubmit={handleSubmit}
                    className="flex-1 flex overflow-hidden"
                >
                    {/* Left Column - Order Summary */}
                    <div className="w-1/3 p-4 border-r border-gray-200 flex flex-col">
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Order Summary
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Subtotal:
                                    </span>
                                    <span className="font-medium">
                                        {formatCurrency(orderTotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Tax (0%):
                                    </span>
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
                                            {formatCurrency(orderTotal)}
                                        </span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-lg font-semibold mt-2">
                                            <span>Final Amount:</span>
                                            <span className="text-blue-600">
                                                {formatCurrency(finalTotal)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Payment Options */}
                    <div className="w-2/3 p-4 flex flex-col">
                        {/* Billing Type */}
                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-500 mb-2 block">
                                Billing Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="billingType"
                                        value="walking"
                                        checked={billingType === "walking"}
                                        onChange={(e) =>
                                            handleBillingTypeChange(
                                                e.target.value
                                            )
                                        }
                                        className="sr-only"
                                    />
                                    <div
                                        className={`p-3 border rounded-lg text-center transition-colors ${
                                            billingType === "walking"
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <svg
                                            className="w-6 h-6 mx-auto mb-1 text-green-600"
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
                                        <span className="font-medium text-sm">
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
                                            handleBillingTypeChange(
                                                e.target.value
                                            )
                                        }
                                        className="sr-only"
                                    />
                                    <div
                                        className={`p-3 border rounded-lg text-center transition-colors ${
                                            billingType === "member"
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <svg
                                            className="w-6 h-6 mx-auto mb-1 text-purple-600"
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
                                        <span className="font-medium text-sm">
                                            Member Customer
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Selected Member Display */}
                        {billingType === "member" && selectedMember && (
                            <div className="mb-4">
                                <label className="text-sm font-medium text-gray-500 mb-2 block">
                                    Selected Member
                                </label>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <svg
                                                    className="w-5 h-5 text-green-600"
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
                                            <div className="ml-2">
                                                <h3 className="font-semibold text-gray-900 text-sm">
                                                    {selectedMember.first_name}{" "}
                                                    {selectedMember.last_name}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    {
                                                        selectedMember.referral_code
                                                    }{" "}
                                                    • {selectedMember.email}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowFindMember(true)
                                            }
                                            className="btn btn-xs btn-outline"
                                        >
                                            Change
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Method */}
                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-500 mb-2 block">
                                Payment Method
                            </label>
                            <div
                                className={`grid gap-3 ${
                                    billingType === "walking"
                                        ? "grid-cols-3"
                                        : "grid-cols-2"
                                }`}
                            >
                                <label
                                    className={`cursor-pointer ${
                                        billingType === "member"
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={paymentMethod === "cash"}
                                        onChange={(e) =>
                                            handlePaymentMethodChange(
                                                e.target.value
                                            )
                                        }
                                        disabled={billingType === "member"}
                                        className="sr-only"
                                    />
                                    <div
                                        className={`p-3 border rounded-lg text-center transition-colors ${
                                            paymentMethod === "cash"
                                                ? "border-blue-500 bg-blue-50"
                                                : billingType === "member"
                                                ? "border-gray-200 bg-gray-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <svg
                                            className="w-6 h-6 mx-auto mb-1 text-yellow-600"
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
                                        <span className="font-medium text-sm">
                                            Cash
                                        </span>
                                    </div>
                                </label>

                                {billingType === "walking" && (
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            checked={paymentMethod === "online"}
                                            onChange={(e) =>
                                                handlePaymentMethodChange(
                                                    e.target.value
                                                )
                                            }
                                            className="sr-only"
                                        />
                                        <div
                                            className={`p-3 border rounded-lg text-center transition-colors ${
                                                paymentMethod === "online"
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <svg
                                                className="w-6 h-6 mx-auto mb-1 text-green-600"
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
                                            <span className="font-medium text-sm">
                                                Online
                                            </span>
                                        </div>
                                    </label>
                                )}

                                <label
                                    className={`cursor-pointer ${
                                        billingType === "walking"
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="wallet"
                                        checked={paymentMethod === "wallet"}
                                        onChange={(e) =>
                                            handlePaymentMethodChange(
                                                e.target.value
                                            )
                                        }
                                        disabled={billingType === "walking"}
                                        className="sr-only"
                                    />
                                    <div
                                        className={`p-3 border rounded-lg text-center transition-colors ${
                                            paymentMethod === "wallet"
                                                ? "border-blue-500 bg-blue-50"
                                                : billingType === "walking"
                                                ? "border-gray-200 bg-gray-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <svg
                                            className="w-6 h-6 mx-auto mb-1 text-purple-600"
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
                                        <span className="font-medium text-sm">
                                            Wallet
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Discount Amount (for cash payments only) */}
                        {paymentMethod === "cash" && (
                            <div className="mb-4">
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
                                    className="input input-bordered w-full input-sm"
                                    placeholder="Enter discount amount"
                                    min={0}
                                    max={orderTotal}
                                    step="0.01"
                                />
                                {discountAmount > orderTotal && (
                                    <p className="text-red-500 text-xs mt-1">
                                        Discount cannot exceed order total
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Payment Reference (for online transfers only) */}
                        {paymentMethod === "online" && (
                            <div className="mb-4">
                                <label className="text-sm font-medium text-gray-500 mb-2 block">
                                    Payment Reference{" "}
                                    <span className="text-gray-400">
                                        (Optional)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={paymentReference}
                                    onChange={(e) =>
                                        setPaymentReference(e.target.value)
                                    }
                                    className="input input-bordered w-full input-sm"
                                    placeholder="Enter transaction reference number"
                                    maxLength={30}
                                />
                            </div>
                        )}

                        {/* Notes (for all payment types) */}
                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-500 mb-2 block">
                                Notes{" "}
                                <span className="text-gray-400">
                                    (Optional)
                                </span>
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="textarea textarea-bordered w-full textarea-sm resize-none"
                                placeholder="Enter any additional notes..."
                                rows={3}
                                maxLength={200}
                            />
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-gray-400">
                                    Maximum 200 characters
                                </span>
                                <span
                                    className={`text-xs ${
                                        notes.length > 180
                                            ? "text-red-500"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {notes.length}/200
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 mt-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-sm btn-ghost"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-sm bg-green-600 hover:bg-green-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner loading-xs mr-1"></span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="w-4 h-4 mr-1"
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

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6 text-center">
                            {/* Success Icon */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                <svg
                                    className="h-8 w-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            {/* Success Message */}
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Payment Successful!
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                {paymentResult?.message ||
                                    "Your payment has been processed successfully."}
                            </p>

                            {/* Payment Details */}
                            {paymentResult && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Order ID:
                                            </span>
                                            <span className="font-medium">
                                                #{paymentResult.orderId}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Payment Method:
                                            </span>
                                            <span className="font-medium capitalize">
                                                {paymentResult.paymentMethod}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Amount Paid:
                                            </span>
                                            <span className="font-medium text-green-600">
                                                {formatCurrency(
                                                    paymentResult.finalTotal
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* OK Button */}
                            <button
                                onClick={handleSuccessModalClose}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
