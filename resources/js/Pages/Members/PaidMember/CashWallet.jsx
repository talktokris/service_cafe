import { Head, useForm, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import MemberDashboardLayout from "../Components/MemberDashboardLayout";
import Breadcrumb from "../Components/Breadcrumb";
import RequestCashOutComponent from "./Components/RequestCashOutComponent";
import TransferPurchaseBalanceComponent from "./Components/TransferPurchaseBalanceComponent";

export default function CashWallet({
    auth,
    transactions,
    summary,
    filters,
    walletBalance,
}) {
    const memberType = auth.user.member_type || "paid";
    const [showCashOutModal, setShowCashOutModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);

    const [searchForm, setSearchForm] = useState({
        from_date: filters?.from_date || "",
        to_date: filters?.to_date || "",
        type: filters?.type || "",
    });

    const { data, setData, get, processing } = useForm(searchForm);

    const handleSearch = (e) => {
        e.preventDefault();
        get("/cash-wallet", {
            data: data,
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setData({
            from_date: "",
            to_date: "",
            type: "",
        });
        get("/cash-wallet", {
            data: {
                from_date: "",
                to_date: "",
                type: "",
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

    const getTransactionTypeLabel = (type) => {
        switch (type) {
            case 1:
                return "Cash In";
            case 2:
                return "Tax";
            case 3:
                return "Withdrawal";
            case 4:
                return "Transfer";
            default:
                return "Unknown";
        }
    };

    const getTransactionTypeColor = (type) => {
        switch (type) {
            case 1:
                return "text-green-600 bg-green-100";
            case 2:
                return "text-red-600 bg-red-100";
            case 3:
                return "text-orange-600 bg-orange-100";
            case 4:
                return "text-blue-600 bg-blue-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    // Sort transactions by ID (latest ID to oldest ID)
    const sortedTransactions = transactions
        ? [...transactions].sort((a, b) => {
              return b.id - a.id; // Descending order (latest ID first)
          })
        : [];

    // Calculate running balance for bank statement style (newest first, calculating backward)
    const transactionsWithBalance = [];
    let currentBalance = summary?.total_balance || 0;

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

    const handleCashOutSuccess = () => {
        setShowCashOutModal(false);
        // Refresh the page to show updated data
        window.location.reload();
    };

    const handleTransferSuccess = () => {
        setShowTransferModal(false);
        // Refresh the page to show updated data
        window.location.reload();
    };

    return (
        <MemberDashboardLayout
            title="Cash Wallet - Serve Cafe"
            user={auth.user}
            memberType={memberType}
            walletBalance={walletBalance}
        >
            <Head title="Cash Wallet" />

            <div>
                {/* Breadcrumb */}
                <Breadcrumb
                    title="Cash Wallet"
                    links={["Home", "Cash Wallet"]}
                    icon={
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
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                        </svg>
                    }
                />

                {/* Main Content */}
                <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {/* Total Cash In */}
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
                                        Total Cash In
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">
                                        {formatCurrency(
                                            summary?.total_cash_in || 0
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Total Cash Out */}
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
                                        Total Cash Out
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900">
                                        {formatCurrency(
                                            summary?.total_cash_out || 0
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Total Transfer */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
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
                                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3 sm:ml-4">
                                    <p className="text-xs sm:text-sm font-medium text-blue-600">
                                        Total Transfer
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">
                                        {formatCurrency(
                                            summary?.total_transfer || 0
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Total Balance */}
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600"
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
                                    <p className="text-xs sm:text-sm font-medium text-purple-600">
                                        Total Balance
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900">
                                        {formatCurrency(
                                            summary?.total_balance || 0
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
                            Search Cash Wallet Transactions
                        </h3>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

                                {/* Transaction Type */}
                                <div>
                                    <label
                                        htmlFor="type"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Transaction Type
                                    </label>
                                    <select
                                        id="type"
                                        value={data.type}
                                        onChange={(e) =>
                                            setData("type", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
                                    >
                                        <option value="">All Types</option>
                                        <option value="1">Cash In</option>
                                        <option value="2">Tax</option>
                                        <option value="3">Withdrawal</option>
                                        <option value="4">Transfer</option>
                                    </select>
                                </div>

                                {/* Search Button */}
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        {processing ? "Searching..." : "Search"}
                                    </button>
                                </div>
                            </div>

                            {/* Reset Button */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                                    Cash Wallet Transactions
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            setShowCashOutModal(true)
                                        }
                                        className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center text-xs font-medium shadow-sm hover:shadow-md"
                                    >
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
                                                d="M20 12H4m16 0l-4-4m4 4l-4 4"
                                            />
                                        </svg>
                                        Cash Out
                                    </button>
                                    <button
                                        onClick={() =>
                                            setShowTransferModal(true)
                                        }
                                        className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center text-xs font-medium shadow-sm hover:shadow-md"
                                    >
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
                                                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                            />
                                        </svg>
                                        Transfer
                                    </button>
                                </div>
                            </div>

                            {transactionsWithBalance.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date & Time
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Transaction ID
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Description
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Debit/Credit
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Balance
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {transactionsWithBalance.map(
                                                (transaction) => (
                                                    <tr
                                                        key={transaction.id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatDateTime(
                                                                transaction.transaction_date
                                                            )}
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            #{transaction.id}
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {transaction.name}
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionTypeColor(
                                                                    transaction.transaction_type
                                                                )}`}
                                                            >
                                                                {getTransactionTypeLabel(
                                                                    transaction.transaction_type
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    transaction.debit_credit ===
                                                                    1
                                                                        ? "text-red-600 bg-red-100"
                                                                        : "text-green-600 bg-green-100"
                                                                }`}
                                                            >
                                                                {transaction.debit_credit ===
                                                                1
                                                                    ? "Debit"
                                                                    : "Credit"}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <span
                                                                className={
                                                                    transaction.debit_credit ===
                                                                    1
                                                                        ? "text-red-600"
                                                                        : "text-green-600"
                                                                }
                                                            >
                                                                {transaction.debit_credit ===
                                                                1
                                                                    ? "-"
                                                                    : "+"}{" "}
                                                                {formatCurrency(
                                                                    transaction.amount
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatCurrency(
                                                                transaction.calculatedBalance
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
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
                                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        No transactions found
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        No cash wallet transactions match your
                                        current search criteria.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <RequestCashOutComponent
                isOpen={showCashOutModal}
                onClose={() => setShowCashOutModal(false)}
                currentBalance={summary?.total_balance || 0}
                onCashOutSuccess={handleCashOutSuccess}
            />

            <TransferPurchaseBalanceComponent
                isOpen={showTransferModal}
                onClose={() => setShowTransferModal(false)}
                currentBalance={summary?.total_balance || 0}
                onTransferSuccess={handleTransferSuccess}
            />
        </MemberDashboardLayout>
    );
}
