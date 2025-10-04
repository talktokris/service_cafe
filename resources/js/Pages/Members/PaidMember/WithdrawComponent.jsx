import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";

export default function WithdrawComponent({
    isOpen,
    onClose,
    currentBalance = 0,
    minWithdrawalAmount = 1000,
    onWithdrawSuccess,
}) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: "",
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
            setError("");
        }
    }, [isOpen, reset]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        const withdrawalAmount = parseFloat(data.amount);

        // Validation
        if (!data.amount || isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
            setError("Please enter a valid withdrawal amount.");
            return;
        }

        if (withdrawalAmount < minWithdrawalAmount) {
            setError(
                `Minimum withdrawal amount is ${formatCurrency(
                    minWithdrawalAmount
                )}.`
            );
            return;
        }

        if (withdrawalAmount > currentBalance) {
            setError(
                "Withdrawal amount cannot exceed your current earning balance."
            );
            return;
        }

        setIsProcessing(true);

        post(route("withdrawal.create"), {
            onSuccess: () => {
                onWithdrawSuccess?.();
                onClose();
                reset();
            },
            onError: (errors) => {
                setError(
                    errors.message ||
                        "An error occurred while processing withdrawal."
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
                            Create Withdrawal
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
                                Current Earning Balance:
                            </span>
                            <span className="text-xl font-bold text-green-700">
                                {formatCurrency(currentBalance)}
                            </span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                            Minimum withdrawal:{" "}
                            {formatCurrency(minWithdrawalAmount)}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <div className="text-sm text-red-800">{error}</div>
                        </div>
                    )}

                    {/* Withdrawal Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <InputLabel
                                htmlFor="amount"
                                value="Withdrawal Amount"
                            />
                            <TextInput
                                id="amount"
                                type="number"
                                step="0.01"
                                min={minWithdrawalAmount}
                                max={currentBalance}
                                className="mt-1 block w-full"
                                placeholder={`Enter amount (min: ${formatCurrency(
                                    minWithdrawalAmount
                                )})`}
                                value={data.amount}
                                onChange={(e) =>
                                    setData("amount", e.target.value)
                                }
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
                                disabled={processing || isProcessing}
                            >
                                Cancel
                            </button>
                            <PrimaryButton
                                type="submit"
                                disabled={processing || isProcessing}
                                className="px-4 py-2"
                            >
                                {processing || isProcessing ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    "Create Withdrawal"
                                )}
                            </PrimaryButton>
                        </div>
                    </form>

                    {/* Additional Info */}
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="text-xs text-blue-800">
                            <strong>Note:</strong> Your withdrawal request will
                            be processed within 1-2 business days. You will
                            receive a notification once it's completed.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
