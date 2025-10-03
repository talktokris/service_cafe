import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function OtpOrders({ auth, orders, filters, stats }) {
    const [searchValue, setSearchValue] = useState(filters?.search || "");
    const [dateFilter, setDateFilter] = useState(filters?.date_filter || "today");

    const { data, setData, get, processing } = useForm({
        search: filters?.search || "",
        date_filter: filters?.date_filter || "today",
    });

    const handleDateFilterChange = (filter) => {
        setDateFilter(filter);
        setData("date_filter", filter);
        get(route("otp-orders"), {
            data: { ...data, date_filter: filter },
            preserveState: true,
            replace: true,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        get(route("otp-orders"), {
            data: { ...data, search: searchValue },
            preserveState: true,
            replace: true,
        });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        setData("search", value);
    };

    const handleReset = () => {
        setSearchValue("");
        setData({ search: "", date_filter: dateFilter });
        get(route("otp-orders"), {
            data: { search: "", date_filter: dateFilter },
            preserveState: true,
            replace: true,
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
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

    const getOtpStatusBadge = (status) => {
        const badges = {
            1: "bg-yellow-100 text-yellow-800", // Sent
            2: "bg-green-100 text-green-800",  // Verified
            3: "bg-red-100 text-red-800",      // Expired
        };
        return badges[status] || "bg-gray-100 text-gray-800";
    };

    const getLocationName = (order) => {
        if (order.branch && order.branch.office_name) {
            return order.branch.office_name;
        }
        if (order.headOffice && order.headOffice.office_name) {
            return order.headOffice.office_name;
        }
        return "Unknown Location";
    };

    const getMemberName = (order) => {
        if (order.memberUser) {
            return `${order.memberUser.first_name} ${order.memberUser.last_name}`;
        }
        return "Walking Customer";
    };

    const getMemberContact = (order) => {
        if (order.memberUser) {
            return order.memberUser.email || order.memberUser.phone || "-";
        }
        return order.otp_phone || order.otp_email || "-";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Today's OTP Orders
                </h2>
            }
        >
            <Head title="Today's OTP Orders" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Today's OTP Orders
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        View and manage today's orders with OTP authentication
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-blue-600">
                                        {stats.total}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Total Orders
                                    </div>
                                </div>
                            </div>

                            {/* Date Filter Tabs */}
                            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                                <button
                                    onClick={() => handleDateFilterChange("today")}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        dateFilter === "today"
                                            ? "bg-white text-blue-600 shadow-sm"
                                            : "text-gray-600 hover:text-blue-600"
                                    }`}
                                >
                                    Today
                                </button>
                                <button
                                    onClick={() => handleDateFilterChange("7days")}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        dateFilter === "7days"
                                            ? "bg-white text-blue-600 shadow-sm"
                                            : "text-gray-600 hover:text-blue-600"
                                    }`}
                                >
                                    7 Days
                                </button>
                            </div>

                            {/* Search Box */}
                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="flex gap-3">
                                    <div className="flex-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={searchValue}
                                            onChange={handleSearchChange}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Search by Order ID, OTP, member name, or email..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {processing ? "Searching..." : "Search"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>

                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                                    <div className="text-sm text-blue-600">Total Orders</div>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
                                    <div className="text-sm text-green-600">Verified</div>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                                    <div className="text-sm text-yellow-600">Pending</div>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
                                    <div className="text-sm text-red-600">Expired</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {orders && orders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order Details
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                OTP Details
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order, index) => (
                                            <tr key={order.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 font-mono">
                                                            #{order.id}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {formatDateTime(order.created_at)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {getMemberName(order)}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {getMemberContact(order)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {order.otp_code || "-"}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {order.otp_phone || order.otp_email || "-"}
                                                        </div>
                                                        {order.otp_sent_at && (
                                                            <div className="text-xs text-gray-400">
                                                                Sent: {formatDateTime(order.otp_sent_at)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {formatCurrency(order.sellingPrice)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOtpStatusBadge(order.otp_status)}`}>
                                                        {order.otp_status_label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {getLocationName(order)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    {dateFilter === "today" ? "No OTP orders today" : `No OTP orders in the last 7 days`}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Orders with OTP will appear here
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}