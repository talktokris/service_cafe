import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import MemberDashboardLayout from "@/Pages/Members/Components/MemberDashboardLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import WithdrawComponent from "./WithdrawComponent";
import Breadcrumb from "../Components/Breadcrumb";

export default function Earnings({
    auth,
    earnings = [],
    summary = {},
    min_withdrawal_amount = 1000,
}) {
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [searchFromDate, setSearchFromDate] = useState("");
    const [searchToDate, setSearchToDate] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [filteredEarnings, setFilteredEarnings] = useState(earnings);
    const [currentSummary, setCurrentSummary] = useState(summary);

    const { get, data, setData } = useForm({
        from_date: "",
        to_date: "",
        type: "",
    });

    useEffect(() => {
        // Set default dates to current month
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const formatDate = (date) => {
            return date.toISOString().split("T")[0];
        };

        setSearchFromDate(formatDate(firstDay));
        setSearchToDate(formatDate(lastDay));
        setData("from_date", formatDate(firstDay));
        setData("to_date", formatDate(lastDay));
    }, []);

    useEffect(() => {
        setFilteredEarnings(earnings);
        setCurrentSummary(summary);
    }, [earnings, summary]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getTransactionTypeLabel = (type) => {
        switch (type) {
            case 1:
                return "Earning";
            case 2:
                return "Withdrawal";
            case 3:
                return "Redistribution";
            default:
                return "Unknown";
        }
    };

    const getTransactionTypeColor = (type) => {
        switch (type) {
            case 1:
                return "bg-green-100 text-green-800";
            case 2:
                return "bg-red-100 text-red-800";
            case 3:
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getDebitCreditLabel = (debitCredit) => {
        return debitCredit === 1 ? "Debit" : "Credit";
    };

    const getDebitCreditColor = (debitCredit) => {
        return debitCredit === 1 ? "text-red-600" : "text-green-600";
    };

    const handleSearch = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(
                route("api.member.earnings") +
                    `?from_date=${searchFromDate}&to_date=${searchToDate}&type=${selectedType}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setFilteredEarnings(data.earnings);
                setCurrentSummary(data.summary);
            } else {
                console.error("Failed to fetch earnings data");
            }
        } catch (error) {
            console.error("Error fetching earnings data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWithdrawSuccess = () => {
        // Refresh the page data
        window.location.reload();
    };

    return (
        <MemberDashboardLayout
            title="Earnings - Serve Cafe"
            user={auth.user}
            memberType="paid"
        >
            <Head title="Earnings" />

            <div>
                {/* Breadcrumb */}
                <Breadcrumb
                    title="Earnings"
                    links={["Home", "Earnings"]}
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
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                        </svg>
                    }
                />

                {/* Main Content */}
                <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 w-[100vw] overflow-hidden">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full">
                        {/* Total Earnings */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 lg:p-6 min-w-0">
                            <div className="flex items-center min-w-0">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-600"
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
                                <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm font-medium text-green-600 truncate">
                                        Total Earnings
                                    </p>
                                    <p className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-green-900 truncate">
                                        {formatCurrency(
                                            currentSummary.total_earnings || 0
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500 truncate">
                                This month:{" "}
                                {formatCurrency(
                                    currentSummary.month_earnings || 0
                                )}
                            </div>
                        </div>

                        {/* Total Withdrawals */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 lg:p-6 min-w-0">
                            <div className="flex items-center min-w-0">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-red-600"
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
                                <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm font-medium text-red-600 truncate">
                                        Total Withdrawals
                                    </p>
                                    <p className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-red-900 truncate">
                                        {formatCurrency(
                                            currentSummary.total_withdrawals ||
                                                0
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500 truncate">
                                This month:{" "}
                                {formatCurrency(
                                    currentSummary.month_withdrawals || 0
                                )}
                            </div>
                        </div>

                        {/* Total Redistributions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-6 min-w-0">
                            <div className="flex items-center min-w-0">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600"
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
                                </div>
                                <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm font-medium text-blue-600 truncate">
                                        Total Redistributions
                                    </p>
                                    <p className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-blue-900 truncate">
                                        {formatCurrency(
                                            currentSummary.total_redistributions ||
                                                0
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500 truncate">
                                This month:{" "}
                                {formatCurrency(
                                    currentSummary.month_redistributions || 0
                                )}
                            </div>
                        </div>

                        {/* Earning Balance */}
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 lg:p-6 min-w-0">
                            <div className="flex items-center min-w-0">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm font-medium text-purple-600 truncate">
                                        Earning Balance
                                    </p>
                                    <p className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-purple-900 truncate">
                                        {formatCurrency(
                                            currentSummary.earning_balance || 0
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500 truncate">
                                Available for withdrawal
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 max-w-full overflow-hidden">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Search Earnings
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={searchFromDate}
                                    onChange={(e) =>
                                        setSearchFromDate(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={searchToDate}
                                    onChange={(e) =>
                                        setSearchToDate(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Transaction Type
                                </label>
                                <select
                                    value={selectedType}
                                    onChange={(e) =>
                                        setSelectedType(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Types</option>
                                    <option value="1">Earning</option>
                                    <option value="2">Withdrawal</option>
                                    <option value="3">Redistribution</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <PrimaryButton
                                    onClick={handleSearch}
                                    disabled={isLoading}
                                    className="w-full"
                                >
                                    {isLoading ? "Searching..." : "Search"}
                                </PrimaryButton>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <PrimaryButton
                                onClick={() => setIsWithdrawModalOpen(true)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                Create Withdrawal
                            </PrimaryButton>
                        </div>
                    </div>

                    {/* Earnings History */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Earnings History ({filteredEarnings.length}{" "}
                                records)
                            </h3>

                            {filteredEarnings.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500">
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
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-500">
                                            No earnings found for the selected
                                            period.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full max-w-full overflow-hidden">
                                    <div className="overflow-hidden rounded-lg border border-gray-200 w-full">
                                        <div className="overflow-x-auto max-h-96 overflow-y-auto w-full">
                                            <table
                                                className="w-full divide-y divide-gray-200"
                                                style={{ minWidth: "600px" }}
                                            >
                                                <thead className="bg-gray-50 sticky top-0 z-10">
                                                    <tr>
                                                        <th className="px-2 sm:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-20 sm:w-24">
                                                            Date
                                                        </th>
                                                        <th className="px-2 sm:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-16 sm:w-20">
                                                            Type
                                                        </th>
                                                        <th className="px-2 sm:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell w-24 sm:w-28">
                                                            Name
                                                        </th>
                                                        <th className="px-2 sm:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell w-32">
                                                            Description
                                                        </th>
                                                        <th className="px-2 sm:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-12">
                                                            D/C
                                                        </th>
                                                        <th className="px-2 sm:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-20 sm:w-24">
                                                            Amount
                                                        </th>
                                                        <th className="px-2 sm:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-16 sm:w-20">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {filteredEarnings.map(
                                                        (earning) => (
                                                            <tr
                                                                key={earning.id}
                                                                className="hover:bg-gray-50"
                                                            >
                                                                <td className="px-2 sm:px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 w-20 sm:w-24">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium truncate">
                                                                            {formatDate(
                                                                                earning.created_at
                                                                            )}
                                                                        </span>
                                                                        {/* Show name on mobile when hidden in table */}
                                                                        <span className="text-xs text-gray-500 sm:hidden truncate">
                                                                            {earning.earning_name ||
                                                                                "-"}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-2 sm:px-3 py-3 whitespace-nowrap w-16 sm:w-20">
                                                                    <span
                                                                        className={`inline-flex px-1 sm:px-2 py-1 text-xs font-semibold rounded-full ${getTransactionTypeColor(
                                                                            earning.transation_type
                                                                        )}`}
                                                                    >
                                                                        {getTransactionTypeLabel(
                                                                            earning.transation_type
                                                                        )}
                                                                    </span>
                                                                </td>
                                                                <td className="px-2 sm:px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell w-24 sm:w-28">
                                                                    <div className="truncate">
                                                                        {earning.earning_name ||
                                                                            "-"}
                                                                    </div>
                                                                </td>
                                                                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-gray-900 hidden lg:table-cell w-32">
                                                                    <div className="truncate">
                                                                        {earning.earning_description ||
                                                                            "-"}
                                                                    </div>
                                                                </td>
                                                                <td className="px-2 sm:px-3 py-3 whitespace-nowrap text-center w-12">
                                                                    <span
                                                                        className={`text-xs sm:text-sm font-medium ${getDebitCreditColor(
                                                                            earning.debit_credit
                                                                        )}`}
                                                                    >
                                                                        {earning.debit_credit ===
                                                                        1
                                                                            ? "D"
                                                                            : "C"}
                                                                    </span>
                                                                </td>
                                                                <td className="px-2 sm:px-3 py-3 whitespace-nowrap text-xs sm:text-sm font-medium w-20 sm:w-24">
                                                                    <span
                                                                        className={getDebitCreditColor(
                                                                            earning.debit_credit
                                                                        )}
                                                                    >
                                                                        {earning.debit_credit ===
                                                                        1
                                                                            ? "-"
                                                                            : "+"}
                                                                        {formatCurrency(
                                                                            earning.ammout
                                                                        )}
                                                                    </span>
                                                                </td>
                                                                <td className="px-2 sm:px-3 py-3 whitespace-nowrap text-center w-16 sm:w-20">
                                                                    <span
                                                                        className={`inline-flex px-1 sm:px-2 py-1 text-xs font-semibold rounded-full ${
                                                                            earning.status ===
                                                                            1
                                                                                ? "bg-green-100 text-green-800"
                                                                                : "bg-gray-100 text-gray-800"
                                                                        }`}
                                                                    >
                                                                        {earning.status ===
                                                                        1
                                                                            ? "✓"
                                                                            : "✗"}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* Scroll indicator for mobile */}
                                        <div className="sm:hidden px-4 py-2 bg-gray-50 border-t border-gray-200 text-center">
                                            <p className="text-xs text-gray-500">
                                                ← Swipe to see more columns →
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Withdrawal Modal */}
            <WithdrawComponent
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                currentBalance={currentSummary.earning_balance || 0}
                minWithdrawalAmount={1000} // This should come from env
                onWithdrawSuccess={handleWithdrawSuccess}
            />
        </MemberDashboardLayout>
    );
}
