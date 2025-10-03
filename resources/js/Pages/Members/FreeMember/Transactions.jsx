import { Head, useForm, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import MemberDashboardLayout from "../Components/MemberDashboardLayout";
import Breadcrumb from "../Components/Breadcrumb";

export default function Transactions({
    auth,
    transactions,
    summary,
    filters,
    walletBalance,
}) {
    const memberType = auth.user.member_type || "free";

    const [searchForm, setSearchForm] = useState({
        transaction_id: filters?.transaction_id || "",
        from_date: filters?.from_date || "",
        to_date: filters?.to_date || "",
    });

    const { data, setData, get, processing } = useForm(searchForm);

    const handleSearch = (e) => {
        e.preventDefault();
        get("/free-transactions", {
            data: data,
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setData({
            transaction_id: "",
            from_date: "",
            to_date: "",
        });
        get("/free-transactions", {
            data: {
                transaction_id: "",
                from_date: "",
                to_date: "",
            },
            preserveState: true,
            replace: true,
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
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

    // Sort transactions by ID (latest ID to oldest ID)
    const sortedTransactions = transactions
        ? [...transactions].sort((a, b) => {
              return b.id - a.id; // Descending order (latest ID first)
          })
        : [];

    // Calculate running balance for bank statement style (newest first, calculating backward)
    const transactionsWithBalance = [];
    let currentBalance = walletBalance;

    for (let i = 0; i < sortedTransactions.length; i++) {
        const transaction = sortedTransactions[i];

        if (i === 0) {
            // For the first (newest) transaction, use current wallet balance
            transactionsWithBalance.push({
                ...transaction,
                calculatedBalance: currentBalance,
            });
        } else {
            // For older transactions, calculate what the balance was before this transaction
            const currentAmount = parseFloat(transaction.amount) || 0;

            if (transaction.debit_credit === 1) {
                // If this transaction was debit, balance was higher before it
                currentBalance = currentBalance + currentAmount;
            } else {
                // If this transaction was credit, balance was lower before it
                currentBalance = currentBalance - currentAmount;
            }

            transactionsWithBalance.push({
                ...transaction,
                calculatedBalance: currentBalance,
            });
        }
    }

    return (
        <MemberDashboardLayout
            title="Transactions - Serve Cafe"
            user={auth.user}
            memberType={memberType}
            walletBalance={walletBalance}
        >
            <Head title="Transactions" />

            <div>
                {/* Breadcrumb */}
                <Breadcrumb
                    title="Transaction History"
                    links={["Home", "Transactions"]}
                    icon={
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
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                        </svg>
                    }
                />

                {/* Main Content */}
                <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Total Debits */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-6 w-6 sm:h-8 sm:w-8 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M20 12H4m16 0l-4-4m4 4l-4 4"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3 sm:ml-4">
                                    <p className="text-xs sm:text-sm font-medium text-red-600">
                                        Total Debits
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900">
                                        {formatCurrency(
                                            summary?.total_debits || 0
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Total Credits */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-6 w-6 sm:h-8 sm:w-8 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M20 12H4m16 0l4-4m-4 4l4 4"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3 sm:ml-4">
                                    <p className="text-xs sm:text-sm font-medium text-green-600">
                                        Total Credits
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">
                                        {formatCurrency(
                                            summary?.total_credits || 0
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Current Balance */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600"
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
                                <div className="ml-3 sm:ml-4">
                                    <p className="text-xs sm:text-sm font-medium text-blue-600">
                                        Current Balance
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">
                                        {formatCurrency(summary?.balance || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
                            Search Transactions
                        </h3>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Transaction ID */}
                                <div className="sm:col-span-2 lg:col-span-1">
                                    <label
                                        htmlFor="transaction_id"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Transaction ID
                                    </label>
                                    <input
                                        type="text"
                                        id="transaction_id"
                                        value={data.transaction_id}
                                        onChange={(e) =>
                                            setData(
                                                "transaction_id",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
                                        placeholder="Enter transaction ID"
                                    />
                                </div>

                                {/* From Date */}
                                <div>
                                    <label
                                        htmlFor="from_date"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        From Date
                                    </label>
                                    <input
                                        type="date"
                                        id="from_date"
                                        value={data.from_date}
                                        onChange={(e) =>
                                            setData("from_date", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
                                    />
                                </div>

                                {/* To Date */}
                                <div>
                                    <label
                                        htmlFor="to_date"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        To Date
                                    </label>
                                    <input
                                        type="date"
                                        id="to_date"
                                        value={data.to_date}
                                        onChange={(e) =>
                                            setData("to_date", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Search Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                                >
                                    {processing ? "Searching..." : "Search"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900">
                                Transaction Statement
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                Showing {transactionsWithBalance.length || 0}{" "}
                                transactions
                            </p>
                        </div>

                        {/* Mobile Card View */}
                        <div className="block lg:hidden">
                            {transactionsWithBalance.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {transactionsWithBalance.map(
                                        (transaction, index) => (
                                            <div
                                                key={transaction.id}
                                                className="p-4"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            #{transaction.id}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {formatDateTime(
                                                                transaction.transaction_date ||
                                                                    transaction.created_at
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            transaction.debit_credit ===
                                                            1
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-green-100 text-green-800"
                                                        }`}
                                                    >
                                                        {transaction.debit_credit ===
                                                        1
                                                            ? "Debit"
                                                            : "Credit"}
                                                    </span>
                                                </div>

                                                <div className="mb-2">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {transaction.transaction_nature ||
                                                            "Transaction"}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {
                                                            transaction.transaction_type
                                                        }
                                                    </div>
                                                    {transaction.order_id && (
                                                        <div className="text-xs text-blue-600 font-mono mt-1">
                                                            Order #
                                                            {
                                                                transaction.order_id
                                                            }
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-500">
                                                            Amount:
                                                        </span>
                                                        <div className="font-medium">
                                                            {transaction.debit_credit ===
                                                            1
                                                                ? "-" +
                                                                  formatCurrency(
                                                                      transaction.amount
                                                                  )
                                                                : formatCurrency(
                                                                      transaction.amount
                                                                  )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">
                                                            Balance:
                                                        </span>
                                                        <div className="font-bold">
                                                            {formatCurrency(
                                                                transaction.calculatedBalance
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-sm text-gray-500">
                                    No transactions found
                                </div>
                            )}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Transaction ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Debit
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Credit
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Balance
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactionsWithBalance.length > 0 ? (
                                        transactionsWithBalance.map(
                                            (transaction, index) => (
                                                <tr
                                                    key={transaction.id}
                                                    className={
                                                        index % 2 === 0
                                                            ? "bg-white"
                                                            : "bg-gray-50"
                                                    }
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDateTime(
                                                            transaction.transaction_date ||
                                                                transaction.created_at
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                                        #{transaction.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {transaction.order_id ? (
                                                            <span className="text-blue-600 font-mono">
                                                                #
                                                                {
                                                                    transaction.order_id
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        <div>
                                                            <div className="font-medium">
                                                                {transaction.transaction_nature ||
                                                                    "Transaction"}
                                                            </div>
                                                            <div className="text-gray-500">
                                                                {
                                                                    transaction.transaction_type
                                                                }
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                transaction.debit_credit ===
                                                                1
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-green-100 text-green-800"
                                                            }`}
                                                        >
                                                            {transaction.debit_credit ===
                                                            1
                                                                ? "Debit"
                                                                : "Credit"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                        {transaction.debit_credit ===
                                                        1
                                                            ? "-" +
                                                              formatCurrency(
                                                                  transaction.amount
                                                              )
                                                            : "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                        {transaction.debit_credit ===
                                                        2
                                                            ? formatCurrency(
                                                                  transaction.amount
                                                              )
                                                            : "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                                        {formatCurrency(
                                                            transaction.calculatedBalance
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="px-6 py-12 text-center text-sm text-gray-500"
                                            >
                                                No transactions found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </MemberDashboardLayout>
    );
}
