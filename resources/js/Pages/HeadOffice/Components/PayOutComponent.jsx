import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";

export default function PayOutComponent({
    isOpen,
    onClose,
    transaction,
    onPayoutSuccess,
}) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        transaction_id: transaction?.id || "",
        cash_out_reference_no: "",
        cash_out_description: "",
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
            setError("");
            setSuccessMessage("");
        } else if (transaction) {
            setData("transaction_id", transaction.id);
        }
    }, [isOpen, transaction, reset]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!data.cash_out_reference_no.trim()) {
            setError("Reference number is required.");
            return;
        }

        if (!data.cash_out_description.trim()) {
            setError("Description is required.");
            return;
        }

        setIsProcessing(true);

        post(route("cash.out.payout"), {
            onSuccess: (page) => {
                if (page.props.flash?.success) {
                    setError("");
                    setSuccessMessage(page.props.flash.success);
                    setTimeout(() => {
                        onPayoutSuccess?.();
                        onClose();
                        reset();
                    }, 3000);
                } else {
                    onPayoutSuccess?.();
                    onClose();
                    reset();
                }
            },
            onError: (errors) => {
                setError(
                    errors.message ||
                        "An error occurred while processing the payout."
                );
            },
            onFinish: () => {
                setIsProcessing(false);
            },
        });
    };

    if (!isOpen || !transaction) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Process Cash Out Payout
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

                    {/* Transaction Information */}
                    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h4 className="text-md font-medium text-gray-900 mb-3">
                            Transaction Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">
                                    Transaction ID:
                                </span>
                                <span className="ml-2 text-gray-900">
                                    {transaction.id}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">
                                    User:
                                </span>
                                <span className="ml-2 text-gray-900">
                                    {transaction.user?.name || "N/A"} (ID:{" "}
                                    {transaction.user_id})
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">
                                    Amount:
                                </span>
                                <span className="ml-2 text-gray-900 font-semibold">
                                    {formatCurrency(transaction.amount)}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">
                                    Request Date:
                                </span>
                                <span className="ml-2 text-gray-900">
                                    {formatDateTime(
                                        transaction.transaction_date
                                    )}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">
                                    Status:
                                </span>
                                <span
                                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                        transaction.cash_out_status === 1
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}
                                >
                                    {transaction.cash_out_status === 1
                                        ? "Paid"
                                        : "Pending"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
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

                    {error && !successMessage && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <div className="flex items-center">
                                <svg
                                    className="w-5 h-5 text-red-500 mr-2 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div className="text-sm font-medium text-red-800">
                                    {error}
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Reference Number */}
                            <div>
                                <InputLabel
                                    htmlFor="cash_out_reference_no"
                                    value="Reference Number *"
                                />
                                <TextInput
                                    id="cash_out_reference_no"
                                    type="text"
                                    className="mt-1 block w-full"
                                    placeholder="Enter payment reference number"
                                    value={data.cash_out_reference_no}
                                    onChange={(e) =>
                                        setData(
                                            "cash_out_reference_no",
                                            e.target.value
                                        )
                                    }
                                    disabled={successMessage ? true : false}
                                    required
                                />
                                {errors.cash_out_reference_no && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.cash_out_reference_no}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <InputLabel
                                    htmlFor="cash_out_description"
                                    value="Payment Description *"
                                />
                                <textarea
                                    id="cash_out_description"
                                    rows={3}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                                    placeholder="Enter payment description or notes"
                                    value={data.cash_out_description}
                                    onChange={(e) =>
                                        setData(
                                            "cash_out_description",
                                            e.target.value
                                        )
                                    }
                                    disabled={successMessage ? true : false}
                                    required
                                />
                                {errors.cash_out_description && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.cash_out_description}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
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
                                    "Make Payment"
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
