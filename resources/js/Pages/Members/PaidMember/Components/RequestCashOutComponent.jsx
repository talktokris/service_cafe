import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";

export default function RequestCashOutComponent({
    isOpen,
    onClose,
    currentBalance = 0,
    onCashOutSuccess,
}) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [validationMessage, setValidationMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: "",
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
            setError("");
            setValidationMessage("");
            setSuccessMessage("");
        }
    }, [isOpen, reset]);

    // Real-time validation
    useEffect(() => {
        if (!data.amount) {
            setValidationMessage("");
            return;
        }

        const cashOutAmount = parseFloat(data.amount);

        if (isNaN(cashOutAmount) || cashOutAmount <= 0) {
            setValidationMessage("Please enter a valid cash out amount.");
            return;
        }

        if (cashOutAmount > currentBalance) {
            setValidationMessage(
                `Amount must not exceed your current balance of ${formatCurrency(
                    currentBalance
                )}.`
            );
            return;
        }

        setValidationMessage("");
    }, [data.amount, currentBalance]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Check if there's a validation message
        if (validationMessage) {
            setError(validationMessage);
            return;
        }

        const cashOutAmount = parseFloat(data.amount);

        // Final validation
        if (!data.amount || isNaN(cashOutAmount) || cashOutAmount <= 0) {
            setError("Please enter a valid cash out amount.");
            return;
        }

        if (cashOutAmount > currentBalance) {
            setError(
                `Amount must not exceed your current balance of ${formatCurrency(
                    currentBalance
                )}.`
            );
            return;
        }

        setIsProcessing(true);

        post(route("cash.out.create"), {
            onSuccess: (page) => {
                // Show success message if available
                if (page.props.flash?.success) {
                    setError(""); // Clear any existing errors
                    setSuccessMessage(page.props.flash.success);
                    // Close modal after 3 seconds
                    setTimeout(() => {
                        onCashOutSuccess?.();
                        onClose();
                        reset();
                    }, 3000);
                } else {
                    onCashOutSuccess?.();
                    onClose();
                    reset();
                }
            },
            onError: (errors) => {
                setError(
                    errors.message ||
                        "An error occurred while processing cash out request."
                );
            },
            onFinish: () => {
                setIsProcessing(false);
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Request Cash Out
                        </h3>
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

                    {/* Current Balance */}
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">
                                Current Cash Wallet Balance:
                            </span>
                            <span className="text-xl font-bold text-green-700">
                                {formatCurrency(currentBalance)}
                            </span>
                        </div>
                    </div>

                    {/* Cash Out Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <InputLabel
                                htmlFor="amount"
                                value="Cash Out Amount"
                            />

                            {/* Success Message */}
                            {successMessage && (
                                <div className="mt-2 mb-3 p-3 bg-green-50 border border-green-200 rounded-md">
                                    <div className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <div className="text-sm font-medium text-green-800">
                                            {successMessage}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Validation Message - Above the input field */}
                            {(validationMessage || error) &&
                                !successMessage && (
                                    <div className="mt-2 mb-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                                        <div className="flex items-center">
                                            <svg
                                                className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <div className="text-sm font-medium text-orange-800">
                                                {validationMessage || error}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            <TextInput
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                max={currentBalance}
                                className="mt-1 block w-full"
                                placeholder={`Enter amount (max: ${formatCurrency(
                                    currentBalance
                                )})`}
                                value={data.amount}
                                onChange={(e) =>
                                    setData("amount", e.target.value)
                                }
                                disabled={successMessage ? true : false}
                                required
                            />
                            {errors.amount && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.amount}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                disabled={
                                    processing || isProcessing || successMessage
                                }
                            >
                                Cancel
                            </button>
                            <PrimaryButton
                                type="submit"
                                disabled={
                                    processing || isProcessing || successMessage
                                }
                                className="px-4 py-2"
                            >
                                {processing || isProcessing ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    "Request Cash Out"
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
