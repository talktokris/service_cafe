import React, { useState, useEffect } from "react";
import FindMemberComponent from "./FindMemberComponent";
import PrintReceiptComponents from "./PrintReceiptComponents";

export default function PayBillComponents({
    table,
    orderTotal = 0,
    orderSubtotal = 0,
    orderTax = 0,
    onClose,
    onSuccess,
}) {
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
    const [isRequestingOtp, setIsRequestingOtp] = useState(false);
    const [otpRequested, setOtpRequested] = useState(false);
    const [otpMessage, setOtpMessage] = useState("");
    const [resendTimer, setResendTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPrintModal, setShowPrintModal] = useState(false);

    // Calculate final total after discount
    const finalTotal = orderTotal - discountAmount;

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    // Helper function to show error modal
    const showError = (message) => {
        setErrorMessage(message);
        setShowErrorModal(true);
    };

    // Helper function to close error modal
    const handleErrorModalClose = () => {
        setShowErrorModal(false);
        setErrorMessage("");
    };

    // Helper function to handle print receipt
    const handlePrintReceipt = () => {
        setShowSuccessModal(false);
        setShowPrintModal(true);
    };

    // Calculate member balance from transactions
    const calculateMemberBalance = async (memberId) => {
        try {
            setIsLoadingBalance(true);

            // Fetch member transactions
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content") || "";

            const response = await fetch(
                `/api/member-transactions/${memberId}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken,
                    },
                    credentials: "same-origin",
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.transactions) {
                    // Calculate balance: total credits - total debits
                    let totalCredits = 0;
                    let totalDebits = 0;

                    data.transactions.forEach((transaction) => {
                        const amount = parseFloat(transaction.amount) || 0;

                        // If transaction_to_id matches current member, it's money coming in
                        if (
                            transaction.transaction_to_id === selectedMember.id
                        ) {
                            if (transaction.debit_credit === 2) {
                                // Credit to this user
                                totalCredits += amount;
                            } else if (transaction.debit_credit === 1) {
                                // Debit from this user
                                totalDebits += amount;
                            }
                        }
                        // If transaction_from_id matches current member, it's money going out
                        else if (
                            transaction.transaction_from_id ===
                            selectedMember.id
                        ) {
                            if (transaction.debit_credit === 1) {
                                // Debit from this user
                                totalDebits += amount;
                            } else if (transaction.debit_credit === 2) {
                                // Credit to this user
                                totalCredits += amount;
                            }
                        }
                    });

                    const balance = totalCredits - totalDebits;
                    setMemberBalance(balance);
                    return balance;
                } else {
                    console.error(
                        "Failed to fetch transactions:",
                        data.message
                    );
                    setMemberBalance(0);
                    return 0;
                }
            } else {
                console.error("API request failed:", response.status);
                setMemberBalance(0);
                return 0;
            }
        } catch (error) {
            console.error("Error calculating member balance:", error);
            setMemberBalance(0);
            return 0;
        } finally {
            setIsLoadingBalance(false);
        }
    };

    // Effect to calculate balance when member is selected
    useEffect(() => {
        if (selectedMember) {
            calculateMemberBalance(selectedMember.id);
        } else {
            setMemberBalance(0);
        }
    }, [selectedMember]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // OTP validation only for wallet payments with member billing
        if (
            paymentMethod === "wallet" &&
            billingType === "member" &&
            selectedMember
        ) {
            // Check for insufficient funds
            if (memberBalance < orderTotal) {
                showError(
                    "Insufficient wallet balance. Please choose a different payment method or add funds to your wallet."
                );
                return;
            }

            // OTP validation for wallet payments
            if (!otpRequested) {
                showError(
                    "Please request OTP first before processing wallet payment."
                );
                return;
            }

            if (!paymentOtp || paymentOtp.length !== 6) {
                showError(
                    "Please enter a valid 6-digit OTP for wallet payment."
                );
                return;
            }
        }

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
                paymentOtp: paymentOtp, // Include OTP for verification
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
                console.error("Payment Error:", result);
                showError(
                    result.message ||
                        "Payment processing failed. Please try again."
                );
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            showError("Payment processing failed. Please try again.");
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
        setOtpRequested(false); // Reset OTP status

        // For paid members, automatically switch to wallet payment method
        if (member && member.member_type === "paid") {
            setPaymentMethod("wallet");
        } else {
            // For free members, default to cash payment method
            setPaymentMethod("cash");
        }

        // Fetch member balance
        if (member && member.id) {
            fetchMemberBalance(member.id);
        }
    };

    const handleBillingTypeChange = (type) => {
        setBillingType(type);
        if (type === "walking") {
            setSelectedMember(null);
            setPaymentMethod("cash"); // Reset to cash for walking customers
            setMemberBalance(0);
        } else if (type === "member") {
            setShowFindMember(true);
            setPaymentMethod("cash"); // Default to cash for members too
            setDiscountAmount(0); // Reset discount for members
        }
    };

    const handlePaymentMethodChange = (method) => {
        // Prevent free members from selecting wallet
        if (
            method === "wallet" &&
            billingType === "member" &&
            selectedMember &&
            selectedMember.member_type !== "paid"
        ) {
            return; // Don't allow the change
        }

        setPaymentMethod(method);
        // Reset payment reference when changing payment method
        if (method !== "online") {
            setPaymentReference("");
        }
    };

    const handleRequestOtp = async () => {
        if (!selectedMember || !table) return;

        setIsRequestingOtp(true);

        try {
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content") || "";

            const response = await fetch("/api/request-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    tableId: table.id,
                    memberId: selectedMember.id,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setOtpRequested(true);
                setCanResend(false);

                // Hide OTP for security, show simple success message
                setOtpMessage("OTP sent successfully!");

                // Start 30-second timer for resend
                setResendTimer(30);
                const timer = setInterval(() => {
                    setResendTimer((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            setCanResend(true);
                            setOtpMessage("");
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

                // Clear success message after 5 seconds (but keep timer running)
                setTimeout(() => {
                    setOtpMessage("");
                }, 5000);
            } else {
                setOtpMessage(
                    result.message || "Failed to send OTP. Please try again."
                );
                // Clear error message after 5 seconds
                setTimeout(() => setOtpMessage(""), 5000);
            }
        } catch (error) {
            console.error("Error requesting OTP:", error);
            setOtpMessage("Failed to send OTP. Please try again.");
            setTimeout(() => setOtpMessage(""), 5000);
        } finally {
            setIsRequestingOtp(false);
        }
    };

    const fetchMemberBalance = async (memberId) => {
        setIsLoadingBalance(true);
        try {
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content") || "";

            const response = await fetch(`/api/member-balance/${memberId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                },
                credentials: "same-origin",
            });

            const result = await response.json();

            if (result.success) {
                setMemberBalance(result.balance || 0);
            } else {
                setMemberBalance(0);
            }
        } catch (error) {
            console.error("Error fetching member balance:", error);
            setMemberBalance(0);
        } finally {
            setIsLoadingBalance(false);
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
                                        {formatCurrency(orderSubtotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax:</span>
                                    <span className="font-medium text-orange-600">
                                        {formatCurrency(orderTax)}
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
                                <div
                                    className={`${
                                        selectedMember.member_type === "paid"
                                            ? "bg-green-50 border-green-200"
                                            : "bg-gray-50 border-gray-200"
                                    } border rounded-lg p-3`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div
                                                className={`w-8 h-8 ${
                                                    selectedMember.member_type ===
                                                    "paid"
                                                        ? "bg-green-100"
                                                        : "bg-gray-100"
                                                } rounded-full flex items-center justify-center`}
                                            >
                                                <svg
                                                    className={`w-5 h-5 ${
                                                        selectedMember.member_type ===
                                                        "paid"
                                                            ? "text-green-600"
                                                            : "text-gray-600"
                                                    }`}
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
                                                    {selectedMember.first_name ||
                                                        selectedMember.name}{" "}
                                                    {selectedMember.last_name}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    {
                                                        selectedMember.referral_code
                                                    }{" "}
                                                    • {selectedMember.email}
                                                </p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <div className="flex items-center">
                                                        <span className="text-xs text-gray-500">
                                                            Wallet Balance:
                                                        </span>
                                                        <span
                                                            className={`ml-2 text-sm font-semibold ${
                                                                memberBalance >=
                                                                0
                                                                    ? selectedMember.member_type ===
                                                                      "paid"
                                                                    ? "text-green-600"
                                                                        : "text-gray-600"
                                                                    : "text-red-500"
                                                            }`}
                                                        >
                                                            {isLoadingBalance ? (
                                                                <div className="inline-flex items-center">
                                                                    <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400 mr-1"></div>
                                                                    Loading...
                                                                </div>
                                                            ) : (
                                                                formatCurrency(
                                                                    memberBalance
                                                                )
                                                            )}
                                                        </span>
                                                    </div>
                                                    {/* Funds Status Badge */}
                                                    {!isLoadingBalance && (
                                                        <div className="flex space-x-1 ml-4">
                                                            {memberBalance >=
                                                            orderTotal ? (
                                                                <span
                                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                        selectedMember.member_type ===
                                                                        "paid"
                                                                            ? "bg-green-100 text-green-700"
                                                                            : "bg-gray-100 text-gray-700"
                                                                    }`}
                                                                >
                                                                    Sufficient
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                                                    Insufficient
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowFindMember(true)
                                                }
                                                className="px-3 py-1 text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                            >
                                                Change
                                            </button>
                                        </div>
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
                                        : "grid-cols-3"
                                }`}
                            >
                                <label
                                    className={`cursor-pointer ${
                                        billingType === "member" &&
                                        selectedMember &&
                                        selectedMember.member_type === "paid"
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
                                        disabled={
                                            billingType === "member" &&
                                            selectedMember &&
                                            selectedMember.member_type ===
                                                "paid"
                                        }
                                        className="sr-only"
                                    />
                                    <div
                                        className={`p-3 border rounded-lg text-center transition-colors ${
                                            paymentMethod === "cash"
                                                ? "border-blue-500 bg-blue-50"
                                                : billingType === "member" &&
                                                  selectedMember &&
                                                  selectedMember.member_type ===
                                                      "paid"
                                                ? "border-gray-200 bg-gray-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <svg
                                            className={`w-6 h-6 mx-auto mb-1 ${
                                                billingType === "member" &&
                                                selectedMember &&
                                                selectedMember.member_type ===
                                                    "paid"
                                                    ? "text-gray-400"
                                                    : "text-yellow-600"
                                            }`}
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
                                        <span
                                            className={`font-medium text-sm ${
                                                billingType === "member" &&
                                                selectedMember &&
                                                selectedMember.member_type ===
                                                    "paid"
                                                    ? "text-gray-400"
                                                    : ""
                                            }`}
                                        >
                                            Cash
                                        </span>
                                    </div>
                                </label>

                                <label
                                    className={`cursor-pointer ${
                                        billingType === "member" &&
                                        selectedMember &&
                                        selectedMember.member_type === "paid"
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
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
                                        disabled={
                                            billingType === "member" &&
                                            selectedMember &&
                                            selectedMember.member_type ===
                                                "paid"
                                        }
                                        className="sr-only"
                                    />
                                    <div
                                        className={`p-3 border rounded-lg text-center transition-colors ${
                                            paymentMethod === "online"
                                                ? "border-blue-500 bg-blue-50"
                                                : billingType === "member" &&
                                                  selectedMember &&
                                                  selectedMember.member_type ===
                                                      "paid"
                                                ? "border-gray-200 bg-gray-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <svg
                                            className={`w-6 h-6 mx-auto mb-1 ${
                                                billingType === "member" &&
                                                selectedMember &&
                                                selectedMember.member_type ===
                                                    "paid"
                                                    ? "text-gray-400"
                                                    : "text-green-600"
                                            }`}
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
                                        <span
                                            className={`font-medium text-sm ${
                                                billingType === "member" &&
                                                selectedMember &&
                                                selectedMember.member_type ===
                                                    "paid"
                                                    ? "text-gray-400"
                                                    : ""
                                            }`}
                                        >
                                            Online
                                        </span>
                                    </div>
                                </label>

                                <label
                                    className={`cursor-pointer ${
                                        billingType === "walking" ||
                                        (billingType === "member" &&
                                            selectedMember &&
                                            selectedMember.member_type !==
                                                "paid")
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
                                        disabled={
                                            billingType === "walking" ||
                                            (billingType === "member" &&
                                                selectedMember &&
                                                selectedMember.member_type !==
                                                    "paid")
                                        }
                                        className="sr-only"
                                    />
                                    <div
                                        className={`p-3 border rounded-lg text-center transition-colors ${
                                            paymentMethod === "wallet"
                                                ? "border-blue-500 bg-blue-50"
                                                : billingType === "walking" ||
                                                  (billingType === "member" &&
                                                      selectedMember &&
                                                      selectedMember.member_type !==
                                                          "paid")
                                                ? "border-gray-200 bg-gray-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <svg
                                            className={`w-6 h-6 mx-auto mb-1 ${
                                                billingType === "walking" ||
                                                (billingType === "member" &&
                                                    selectedMember &&
                                                    selectedMember.member_type !==
                                                        "paid")
                                                    ? "text-gray-400"
                                                    : "text-purple-600"
                                            }`}
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
                                        <span
                                            className={`font-medium text-sm ${
                                                billingType === "walking" ||
                                                (billingType === "member" &&
                                                    selectedMember &&
                                                    selectedMember.member_type !==
                                                        "paid")
                                                    ? "text-gray-400"
                                                    : ""
                                            }`}
                                        >
                                            Wallet
                                        </span>
                                    </div>
                                </label>
                            </div>

                            {/* Payment Method Restriction Notice for Paid Members */}
                            {billingType === "member" &&
                                selectedMember &&
                                selectedMember.member_type === "paid" && (
                                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="h-4 w-4 text-blue-600 mt-0.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="ml-2">
                                                <p className="text-xs text-blue-700 font-medium">
                                                    For paid members, only
                                                    wallet payments are
                                                    available.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* Payment Method Restriction Notice for Free Members */}
                            {billingType === "member" &&
                                selectedMember &&
                                selectedMember.member_type !== "paid" && (
                                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="h-4 w-4 text-orange-600 mt-0.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="ml-2">
                                                <p className="text-xs text-orange-700 font-medium">
                                                    Wallet payments are not
                                                    available for free members.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* OTP Operations for Wallet Payments */}
                        {billingType === "member" &&
                            selectedMember &&
                            paymentMethod === "wallet" && (
                                <div className="mb-4">
                                    <div className="space-y-3">
                                        {/* OTP Status Message */}
                                        {otpMessage && (
                                            <div
                                                className={`inline-flex items-center text-xs px-2 py-1 rounded ${
                                                    otpRequested
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {otpRequested ? (
                                                    <svg
                                                        className="w-3 h-3 mr-1"
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
                                                ) : (
                                                    <svg
                                                        className="w-3 h-3 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                )}
                                                {otpMessage}
                                            </div>
                                        )}

                                        <div className="flex items-center space-x-3">
                                            <label className="text-sm font-medium text-gray-500 flex-shrink-0">
                                                {paymentMethod === "wallet"
                                                    ? "Confirm OTP"
                                                    : "Enter OTP"}
                                                <span className="text-red-500 ml-1">
                                                    *
                                                </span>
                                            </label>

                                            {/* OTP Input */}
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={paymentOtp}
                                                    onChange={(e) =>
                                                        setPaymentOtp(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="input input-bordered input-sm w-24 text-center font-mono tracking-wider"
                                                    placeholder="000000"
                                                    maxLength={6}
                                                    pattern="[0-9]{6}"
                                                    required
                                                    disabled={!otpRequested}
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                                                    <svg
                                                        className="w-3 h-3 text-purple-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Request OTP Button */}
                                            {!otpRequested && (
                                                <button
                                                    type="button"
                                                    onClick={handleRequestOtp}
                                                    disabled={isRequestingOtp}
                                                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex-shrink-0"
                                                >
                                                    {isRequestingOtp ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-3 w-3 border-b border-white inline mr-1"></div>
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        "Request OTP"
                                                    )}
                                                </button>
                                            )}

                                            {/* Resend Timer or Resend Button */}
                                            {otpRequested && (
                                                <div className="flex items-center space-x-2 flex-shrink-0">
                                                    {resendTimer > 0 ? (
                                                        <span className="text-xs text-gray-500">
                                                            Resend in{" "}
                                                            {resendTimer}s
                                                        </span>
                                                    ) : canResend ? (
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                handleRequestOtp
                                                            }
                                                            disabled={
                                                                isRequestingOtp
                                                            }
                                                            className="px-3 py-1 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                                                        >
                                                            {isRequestingOtp ? (
                                                                <>
                                                                    <div className="animate-spin rounded-full h-3 w-3 border-b border-white inline mr-1"></div>
                                                                    Resending...
                                                                </>
                                                            ) : (
                                                                "Resend OTP"
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                                            ✓ OTP Sent
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <span className="text-xs text-gray-500 flex-1">
                                                {paymentMethod === "wallet"
                                                    ? "Enter 6-digit OTP to confirm wallet payment"
                                                    : "Enter 6-digit OTP sent to your email"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                className={`btn btn-sm text-white ${
                                    (paymentMethod === "wallet" &&
                                        billingType === "member" &&
                                        selectedMember &&
                                        memberBalance < orderTotal) ||
                                    isSubmitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                                disabled={
                                    isSubmitting ||
                                    (paymentMethod === "wallet" &&
                                        billingType === "member" &&
                                        selectedMember &&
                                        memberBalance < orderTotal)
                                }
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

                            {/* Action Buttons */}
                            <div className="flex space-x-3">
                            <button
                                onClick={handleSuccessModalClose}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handlePrintReceipt}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
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
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform animate-pulse">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Error
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Please check the details below
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="w-5 h-5 text-red-600 mt-0.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-red-800 font-medium">
                                            {errorMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                            <button
                                onClick={handleErrorModalClose}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Receipt Modal */}
            {showPrintModal && paymentResult && (
                <PrintReceiptComponents
                    table={table}
                    order={{ id: paymentResult.orderId }}
                    onClose={() => {
                        setShowPrintModal(false);
                        // After closing print modal, call success callback to close all modals
                        handleSuccessModalClose();
                    }}
                />
            )}
        </div>
    );
}
