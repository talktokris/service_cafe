import React from "react";

export default function WalletBalance({ wallet, onTopUp, onWithdraw }) {
    if (!wallet) {
        return (
            <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
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
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No wallet found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Contact support to set up your wallet.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                    Wallet Balance
                </h3>
                <div className="flex space-x-2">
                    <button
                        onClick={onTopUp}
                        className="btn btn-primary btn-sm"
                    >
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
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        Top Up
                    </button>
                    <button
                        onClick={onWithdraw}
                        className="btn btn-outline btn-sm"
                    >
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
                                d="M20 12H4"
                            />
                        </svg>
                        Withdraw
                    </button>
                </div>
            </div>

            {/* Balance Display */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-green-800">
                            Available Balance
                        </p>
                        <p className="text-3xl font-bold text-green-900">
                            ${wallet.balance.toFixed(2)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-green-700">
                            Total Deposited
                        </p>
                        <p className="text-lg font-semibold text-green-800">
                            ${wallet.total_deposited.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Wallet Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-8 w-8 text-green-500"
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
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">
                                Total Deposited
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                ${wallet.total_deposited.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-8 w-8 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 12H4"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">
                                Total Spent
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                ${wallet.total_spent.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet Status */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                    <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                            wallet.is_active ? "bg-green-500" : "bg-red-500"
                        }`}
                    ></div>
                    <span className="text-sm text-gray-600">
                        {wallet.is_active ? "Wallet Active" : "Wallet Inactive"}
                    </span>
                </div>
                <span className="text-xs text-gray-500">
                    Last updated:{" "}
                    {new Date(wallet.updated_at).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
}
