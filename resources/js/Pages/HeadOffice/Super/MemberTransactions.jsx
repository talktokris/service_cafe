import { Head, useForm, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "../AdminComponents";
import TopupFundComponent from "../../TransactionComponent/TopupFundComponent";

export default function MemberTransactions({
    auth,
    transactions,
    summary,
    filters,
    member,
    encodedUserId,
}) {
    const [searchForm, setSearchForm] = useState({
        transaction_id: filters?.transaction_id || "",
        from_date: filters?.from_date || "",
        to_date: filters?.to_date || "",
    });

    const [showTopupModal, setShowTopupModal] = useState(false);

    const { data, setData, get, processing } = useForm(searchForm);

    const handleSearch = (e) => {
        e.preventDefault();
        get(`/member-transactions/${encodedUserId}`, {
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
        get(`/member-transactions/${encodedUserId}`, {
            data: {
                transaction_id: "",
                from_date: "",
                to_date: "",
            },
            preserveState: true,
            replace: true,
        });
    };

    const handleTopupSuccess = () => {
        setShowTopupModal(false);
        // Refresh the page to show updated transactions
        window.location.reload();
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

    return (
        <AdminDashboardLayout
            title="Member Transactions - Serve Cafe"
            user={auth.user}
        >
            <Head title="Member Transactions" />

            <div>
                {/* Breadcrumb */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
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
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Member Transactions
                            </h1>
                            <nav className="flex items-center space-x-2 text-sm mt-1">
                                <Link
                                    href="/dashboard"
                                    className="font-medium text-gray-600 hover:text-gray-900"
                                >
                                    Home
                                </Link>
                                <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                <Link
                                    href="/manage-members"
                                    className="font-medium text-gray-600 hover:text-gray-900"
                                >
                                    Members
                                </Link>
                                <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                <span className="font-medium text-gray-700">
                                    {member?.first_name} {member?.last_name} -
                                    Transactions
                                </span>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6 space-y-6">
                    {/* Member Info Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Member Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Name
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {member?.first_name} {member?.last_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Email
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {member?.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Member Type
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {member?.member_type === "paid"
                                        ? "Paid Member"
                                        : "Free Member"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Debits */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-8 w-8 text-red-600"
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
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-red-600">
                                        Total Debits
                                    </p>
                                    <p className="text-2xl font-bold text-red-900">
                                        {formatCurrency(
                                            summary?.total_debits || 0
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Total Credits */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-8 w-8 text-green-600"
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
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-green-600">
                                        Total Credits
                                    </p>
                                    <p className="text-2xl font-bold text-green-900">
                                        {formatCurrency(
                                            summary?.total_credits || 0
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Current Balance */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-8 w-8 text-blue-600"
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
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-blue-600">
                                        Current Balance
                                    </p>
                                    <p className="text-2xl font-bold text-blue-900">
                                        {formatCurrency(summary?.balance || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Form and Fund Topup Button */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Search Transactions
                            </h3>
                            <button
                                onClick={() => setShowTopupModal(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                Fund Topup
                            </button>
                        </div>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Transaction ID */}
                                <div>
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
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                                >
                                    {processing ? "Searching..." : "Search"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                Transaction Statement
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Showing {transactions?.length || 0} transactions
                            </p>
                        </div>

                        <div className="overflow-x-auto">
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
                                    {transactions && transactions.length > 0 ? (
                                        transactions.map(
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
                                                            ? formatCurrency(
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
                                                            transaction.balance
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
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

            {/* Topup Fund Modal */}
            {showTopupModal && (
                <TopupFundComponent
                    member={member}
                    encodedUserId={encodedUserId}
                    onClose={() => setShowTopupModal(false)}
                    onSuccess={handleTopupSuccess}
                />
            )}
        </AdminDashboardLayout>
    );
}
