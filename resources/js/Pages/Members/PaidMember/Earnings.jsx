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
                <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {/* Total Earnings */}
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
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3 sm:ml-4">
                                    <p className="text-xs sm:text-sm font-medium text-green-600">
                                        Total Earnings
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">
                                        {formatCurrency(
                                            currentSummary.total_earnings || 0
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                This month:{" "}
                                {formatCurrency(
                                    currentSummary.month_earnings || 0
                                )}
                            </div>
                        </div>

                        {/* Total Withdrawals */}
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
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3 sm:ml-4">
                                    <p className="text-xs sm:text-sm font-medium text-red-600">
                                        Total Withdrawals
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900">
                                        {formatCurrency(
                                            currentSummary.total_withdrawals ||
                                                0
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                This month:{" "}
                                {formatCurrency(
                                    currentSummary.month_withdrawals || 0
                                )}
                            </div>
                        </div>

                        {/* Total Redistributions */}
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
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3 sm:ml-4">
                                    <p className="text-xs sm:text-sm font-medium text-blue-600">
                                        Total Redistributions
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">
                                        {formatCurrency(
                                            currentSummary.total_redistributions ||
                                                0
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                This month:{" "}
                                {formatCurrency(
                                    currentSummary.month_redistributions || 0
                                )}
                            </div>
                        </div>

                        {/* Earning Balance */}
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
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3 sm:ml-4">
                                    <p className="text-xs sm:text-sm font-medium text-purple-600">
                                        Earning Balance
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900">
                                        {formatCurrency(
                                            currentSummary.earning_balance || 0
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                Available for withdrawal
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Search Earnings
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Description
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Debit/Credit
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredEarnings.map((earning) => (
                                                <tr
                                                    key={earning.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDate(
                                                            earning.created_at
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionTypeColor(
                                                                earning.transation_type
                                                            )}`}
                                                        >
                                                            {getTransactionTypeLabel(
                                                                earning.transation_type
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {earning.earning_name ||
                                                            "-"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {earning.earning_description ||
                                                            "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`text-sm font-medium ${getDebitCreditColor(
                                                                earning.debit_credit
                                                            )}`}
                                                        >
                                                            {getDebitCreditLabel(
                                                                earning.debit_credit
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                earning.status ===
                                                                1
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {earning.status ===
                                                            1
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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
