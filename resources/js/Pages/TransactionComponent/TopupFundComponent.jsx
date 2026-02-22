import { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function TopupFundComponent({
    member,
    encodedUserId,
    onClose,
    onSuccess,
}) {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Refresh CSRF token before submit to avoid "session expired" when modal was open a while
        try {
            const refreshRes = await fetch("/refresh-csrf", {
                method: "GET",
                headers: { Accept: "application/json" },
                credentials: "same-origin",
            });
            if (refreshRes.ok) {
                const resData = await refreshRes.json();
                if (resData.csrf_token) {
                    const meta = document.querySelector('meta[name="csrf-token"]');
                    if (meta) meta.setAttribute("content", resData.csrf_token);
                    if (window.axios) window.axios.defaults.headers.common["X-CSRF-TOKEN"] = resData.csrf_token;
                }
            }
        } catch (_) {
            // Continue with existing token if refresh fails
        }

        post(`/fund-topup/${encodedUserId}`, {
            onSuccess: () => {
                setShowSuccessMessage(true);
                reset();
                setTimeout(() => {
                    setShowSuccessMessage(false);
                    onSuccess();
                }, 2000);
            },
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Fund Topup
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

                    {/* Member Info */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Member Information
                        </h4>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-900">
                                <span className="font-medium">Name:</span>{" "}
                                {member?.first_name} {member?.last_name}
                            </p>
                            <p className="text-sm text-gray-900">
                                <span className="font-medium">Email:</span>{" "}
                                {member?.email}
                            </p>
                            <p className="text-sm text-gray-900">
                                <span className="font-medium">
                                    Member Type:
                                </span>{" "}
                                {member?.member_type === "paid"
                                    ? "Paid Member"
                                    : "Free Member"}
                            </p>
                        </div>
                    </div>

                    {/* Success Message */}
                    {showSuccessMessage && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-green-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">
                                        Fund topup successful!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Amount Input */}
                        <div>
                            <label
                                htmlFor="amount"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Topup Amount
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">
                                        ₹
                                    </span>
                                </div>
                                <input
                                    type="number"
                                    id="amount"
                                    step="0.01"
                                    min="0.01"
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData("amount", e.target.value)
                                    }
                                    className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 text-sm"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            {errors.amount && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.amount}
                                </p>
                            )}
                        </div>

                        {/* Transaction Details */}
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-800 mb-2">
                                Transaction Details
                            </h4>
                            <div className="space-y-1 text-sm text-blue-700">
                                <p>
                                    <span className="font-medium">Type:</span>{" "}
                                    Credit
                                </p>
                                <p>
                                    <span className="font-medium">Nature:</span>{" "}
                                    Fund Topup
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Description:
                                    </span>{" "}
                                    Admin Fund Topup
                                </p>
                                {data.amount && (
                                    <p>
                                        <span className="font-medium">
                                            Amount:
                                        </span>{" "}
                                        {formatCurrency(
                                            parseFloat(data.amount) || 0
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing || !data.amount}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? "Processing..." : "Topup Fund"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
