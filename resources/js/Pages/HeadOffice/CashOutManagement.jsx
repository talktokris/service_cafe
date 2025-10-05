import { Head, useForm, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AdminDashboardLayout from "./AdminComponents/AdminDashboardLayout";
import Breadcrumb from "../Members/Components/Breadcrumb";
import PayOutComponent from "./Components/PayOutComponent";

export default function CashOutManagement({
    auth,
    transactions,
    summary,
    filters,
}) {
    const [activeTab, setActiveTab] = useState(filters?.status || "all");

    // Update activeTab when filters change
    useEffect(() => {
        if (filters?.status) {
            setActiveTab(filters.status);
        }
    }, [filters?.status]);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const { data, setData, get, processing } = useForm({
        transaction_id: filters?.transaction_id || "",
        user_id: filters?.user_id || "",
        from_date: filters?.from_date || "",
        to_date: filters?.to_date || "",
        status: filters?.status || "all",
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route("cash.out.management"), {
            data: data,
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setData({
            transaction_id: "",
            user_id: "",
            from_date: "",
            to_date: "",
            status: activeTab,
        });
        get(route("cash.out.management"), {
            data: {
                transaction_id: "",
                user_id: "",
                from_date: "",
                to_date: "",
                status: activeTab,
            },
            preserveState: true,
            replace: true,
        });
    };

    const handlePayoutClick = (transaction) => {
        setSelectedTransaction(transaction);
        setShowPayoutModal(true);
    };

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

    const getStatusBadge = (status) => {
        if (status === 1) {
            return (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Paid
                </span>
            );
        } else {
            return (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                </span>
            );
        }
    };

    return (
        <AdminDashboardLayout
            title="Cash Out Management - Serve Cafe"
            user={auth.user}
        >
            <Head title="Cash Out Management" />

            <div>
                <Breadcrumb
                    title="Cash Out Management"
                    links={["Home", "Cash Out Management"]}
                    icon={
                        <svg
                            className="w-6 h-6 text-blue-600"
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
                    }
                />

                <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
                        {/* Total Requests */}
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
                                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3 sm:ml-4">
                                    <p className="text-xs sm:text-sm font-medium text-blue-600">
                                        Total Requests
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">
                                        {summary?.total || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Pending Requests */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3 sm:ml-4">
                                    <p className="text-xs sm:text-sm font-medium text-yellow-600">
                                        Pending
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-900">
                                        {summary?.pending || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Paid Requests */}
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
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3 sm:ml-4">
                                    <p className="text-xs sm:text-sm font-medium text-green-600">
                                        Paid
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">
                                        {summary?.paid || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Total Amount */}
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
                                        Total Amount
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900">
                                        {formatCurrency(
                                            summary?.total_amount || 0
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Pending Amount */}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600"
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
                                    <p className="text-xs sm:text-sm font-medium text-orange-600">
                                        Pending Amount
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-900">
                                        {formatCurrency(
                                            summary?.pending_amount || 0
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Paid Amount */}
                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-6 w-6 sm:h-8 sm:w-8 text-teal-600"
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
                                    <p className="text-xs sm:text-sm font-medium text-teal-600">
                                        Paid Amount
                                    </p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-teal-900">
                                        {formatCurrency(
                                            summary?.paid_amount || 0
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
                            Search Cash Out Requests
                        </h3>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Transaction ID */}
                                <div>
                                    <label
                                        htmlFor="transaction_id"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Transaction ID
                                    </label>
                                    <input
                                        type="number"
                                        id="transaction_id"
                                        value={data.transaction_id}
                                        onChange={(e) =>
                                            setData(
                                                "transaction_id",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                                        placeholder="Enter transaction ID"
                                    />
                                </div>

                                {/* User ID */}
                                <div>
                                    <label
                                        htmlFor="user_id"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        User ID
                                    </label>
                                    <input
                                        type="number"
                                        id="user_id"
                                        value={data.user_id}
                                        onChange={(e) =>
                                            setData("user_id", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                                        placeholder="Enter user ID"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    disabled={processing}
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    disabled={processing}
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tab Navigation */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="border-b border-gray-200">
                            <nav
                                className="-mb-px flex space-x-8 px-6"
                                aria-label="Tabs"
                            >
                                {[
                                    {
                                        key: "all",
                                        label: "All",
                                        count: summary?.total || 0,
                                    },
                                    {
                                        key: "pending",
                                        label: "Pending",
                                        count: summary?.pending || 0,
                                    },
                                    {
                                        key: "paid",
                                        label: "Paid",
                                        count: summary?.paid || 0,
                                    },
                                ].map((tab) => {
                                    const tabUrl = route(
                                        "cash.out.management",
                                        {
                                            transaction_id: data.transaction_id,
                                            user_id: data.user_id,
                                            from_date: data.from_date,
                                            to_date: data.to_date,
                                            status: tab.key,
                                        }
                                    );

                                    return (
                                        <Link
                                            key={tab.key}
                                            href={tabUrl}
                                            className={`${
                                                activeTab === tab.key
                                                    ? "border-blue-500 text-blue-600"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center cursor-pointer`}
                                        >
                                            {tab.label}
                                            <span
                                                className={`${
                                                    activeTab === tab.key
                                                        ? "bg-blue-100 text-blue-600"
                                                        : "bg-gray-100 text-gray-900"
                                                } ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium`}
                                            >
                                                {tab.count}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Transactions Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Transaction ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Request Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Reference No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactions.length > 0 ? (
                                        transactions.map((transaction) => (
                                            <tr key={transaction.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {transaction.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {transaction.user
                                                                ?.name || "N/A"}
                                                        </div>
                                                        <div className="text-gray-500">
                                                            ID:{" "}
                                                            {
                                                                transaction.user_id
                                                            }
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatCurrency(
                                                        transaction.amount
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDateTime(
                                                        transaction.transaction_date
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {getStatusBadge(
                                                        transaction.cash_out_status
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {transaction.cash_out_reference_no ||
                                                        "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {transaction.cash_out_status ===
                                                    0 ? (
                                                        <button
                                                            onClick={() =>
                                                                handlePayoutClick(
                                                                    transaction
                                                                )
                                                            }
                                                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-xs font-medium"
                                                        >
                                                            Payout
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">
                                                            Processed
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                                            >
                                                No transactions found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <PayOutComponent
                isOpen={showPayoutModal}
                onClose={() => {
                    setShowPayoutModal(false);
                    setSelectedTransaction(null);
                }}
                transaction={selectedTransaction}
                onPayoutSuccess={() => {
                    // Refresh the page data
                    get(route("cash.out.management"), {
                        data: data,
                        preserveState: true,
                        replace: true,
                    });
                }}
            />
        </AdminDashboardLayout>
    );
}
