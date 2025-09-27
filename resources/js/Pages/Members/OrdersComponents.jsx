import { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function OrdersComponents({ auth, orders, filters }) {
    const [searchForm, setSearchForm] = useState({
        order_id: filters?.order_id || "",
        from_date: filters?.from_date || "",
        to_date: filters?.to_date || "",
    });

    const { data, setData, get, processing } = useForm(searchForm);

    const handleSearch = (e) => {
        e.preventDefault();
        // The parent component will handle the search endpoint
        get(window.location.pathname, {
            data: data,
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setData({
            order_id: "",
            from_date: "",
            to_date: "",
        });
        get(window.location.pathname, {
            data: {
                order_id: "",
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

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
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

    const getCashierName = (order) => {
        if (order.creator) {
            return `${order.creator.first_name} ${order.creator.last_name}`;
        }
        return "Unknown Cashier";
    };

    const getPaymentTypeBadge = (paymentType) => {
        const badges = {
            cash: "bg-green-100 text-green-800",
            online: "bg-blue-100 text-blue-800",
            wallet: "bg-purple-100 text-purple-800",
            card: "bg-indigo-100 text-indigo-800",
        };

        return badges[paymentType] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="space-y-6">
            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Search Orders
                </h3>
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Order ID */}
                        <div>
                            <label
                                htmlFor="order_id"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Order ID
                            </label>
                            <input
                                type="text"
                                id="order_id"
                                value={data.order_id}
                                onChange={(e) =>
                                    setData("order_id", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 text-sm"
                                placeholder="Enter order ID"
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

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Order History
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Showing {orders?.length || 0} orders
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date & Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cashier
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Type
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders && orders.length > 0 ? (
                                orders.map((order, index) => (
                                    <tr
                                        key={order.id}
                                        className={
                                            index % 2 === 0
                                                ? "bg-white"
                                                : "bg-gray-50"
                                        }
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDateTime(order.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {getLocationName(order)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {getCashierName(order)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                            {formatCurrency(
                                                order.sellingPrice || 0
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentTypeBadge(
                                                    order.paymentType
                                                )}`}
                                            >
                                                {order.paymentType?.toUpperCase() ||
                                                    "UNKNOWN"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-12 text-center text-sm text-gray-500"
                                    >
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
