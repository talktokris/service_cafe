import React, { useState } from "react";

export default function WalletTransactions({ transactions, onLoadMore }) {
    const [filter, setFilter] = useState("all");

    const filteredTransactions = transactions.filter((transaction) => {
        if (filter === "all") return true;
        return transaction.type === filter;
    });

    const getTransactionIcon = (type) => {
        switch (type) {
            case "deposit":
                return (
                    <svg
                        className="w-5 h-5 text-green-500"
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
                );
            case "withdrawal":
                return (
                    <svg
                        className="w-5 h-5 text-red-500"
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
                );
            case "payment":
                return (
                    <svg
                        className="w-5 h-5 text-blue-500"
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
                );
            case "commission":
                return (
                    <svg
                        className="w-5 h-5 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                    </svg>
                );
            case "refund":
                return (
                    <svg
                        className="w-5 h-5 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                );
            default:
                return (
                    <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                );
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "badge-success";
            case "pending":
                return "badge-warning";
            case "failed":
                return "badge-error";
            case "cancelled":
                return "badge-neutral";
            default:
                return "badge-neutral";
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-lg">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        Transaction History
                    </h3>
                    <div className="flex space-x-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="select select-bordered select-sm"
                        >
                            <option value="all">All Transactions</option>
                            <option value="deposit">Deposits</option>
                            <option value="withdrawal">Withdrawals</option>
                            <option value="payment">Payments</option>
                            <option value="commission">Commissions</option>
                            <option value="refund">Refunds</option>
                        </select>
                    </div>
                </div>

                {filteredTransactions.length > 0 ? (
                    <div className="space-y-4">
                        {filteredTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        {getTransactionIcon(transaction.type)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 capitalize">
                                            {transaction.type.replace("_", " ")}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {transaction.description ||
                                                `Transaction #${transaction.id}`}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(
                                                transaction.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p
                                        className={`font-medium ${
                                            transaction.type === "deposit" ||
                                            transaction.type === "commission" ||
                                            transaction.type === "refund"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {transaction.type === "deposit" ||
                                        transaction.type === "commission" ||
                                        transaction.type === "refund"
                                            ? "+"
                                            : "-"}
                                        ${transaction.amount.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Balance: $
                                        {transaction.balance_after.toFixed(2)}
                                    </p>
                                    <span
                                        className={`badge badge-sm ${getStatusColor(
                                            transaction.status
                                        )}`}
                                    >
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
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
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No transactions found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {filter === "all"
                                ? "Your transaction history will appear here."
                                : `No ${filter} transactions found.`}
                        </p>
                    </div>
                )}

                {onLoadMore && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={onLoadMore}
                            className="btn btn-outline"
                        >
                            Load More Transactions
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
