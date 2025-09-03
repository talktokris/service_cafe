import React, { useState, useEffect } from "react";
import ViewOrderComponents from "./ViewOrderComponents";

export default function ManageOrderComponents({
    orders = [],
    officeProfiles = [],
}) {
    const [filteredOrders, setFilteredOrders] = useState(orders);

    // Debug: Log all orders data on component mount
    console.log("ManageOrderComponents - All orders data:", orders);
    console.log(
        "ManageOrderComponents - Order 6 specifically:",
        orders.find((o) => o.id === 6)
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedHeadOffice, setSelectedHeadOffice] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    // Filter orders based on search criteria
    useEffect(() => {
        let filtered = orders;

        // Search by order ID, member user ID, or table ID
        if (searchTerm) {
            filtered = filtered.filter(
                (order) =>
                    order.id.toString().includes(searchTerm) ||
                    (order.memberUserId &&
                        order.memberUserId.toString().includes(searchTerm)) ||
                    (order.tableId &&
                        order.tableId.toString().includes(searchTerm))
            );
        }

        // Filter by head office
        if (selectedHeadOffice) {
            filtered = filtered.filter(
                (order) =>
                    order.headOfficeId &&
                    order.headOfficeId.toString() === selectedHeadOffice
            );
        }

        // Filter by branch
        if (selectedBranch) {
            filtered = filtered.filter(
                (order) =>
                    order.branchId &&
                    order.branchId.toString() === selectedBranch
            );
        }

        // Filter by date range
        if (fromDate) {
            filtered = filtered.filter(
                (order) => new Date(order.created_at) >= new Date(fromDate)
            );
        }

        if (toDate) {
            filtered = filtered.filter(
                (order) => new Date(order.created_at) <= new Date(toDate)
            );
        }

        // Limit to latest 100 orders
        filtered = filtered.slice(0, 100);

        setFilteredOrders(filtered);
    }, [
        orders,
        searchTerm,
        selectedHeadOffice,
        selectedBranch,
        fromDate,
        toDate,
    ]);

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowViewModal(true);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (order) => {
        if (order.paymentStatus === 1) {
            return <span className="badge badge-success">Completed</span>;
        } else if (order.tableOccupiedStatus === 1) {
            return <span className="badge badge-warning">Processing</span>;
        } else {
            return <span className="badge badge-error">Cancelled</span>;
        }
    };

    const getCustomerInfo = (order) => {
        // Simplified check for member customer
        const isMemberCustomer =
            order.customerType === "member" && order.memberUser;

        if (isMemberCustomer) {
            const firstName = order.memberUser?.first_name || "";
            const lastName = order.memberUser?.last_name || "";
            const fullName = `${firstName} ${lastName}`.trim() || "Member User";

            return {
                name: fullName,
                email: order.memberUser?.email || "N/A",
                initials:
                    `${firstName?.[0] || ""}${lastName?.[0] || ""}` || "MU",
                color: "bg-purple-600",
            };
        } else {
            return {
                name: "Walking Customer",
                email: "N/A",
                initials: "WC",
                color: "bg-gray-600",
            };
        }
    };

    // Get unique head offices and branches for filter dropdowns
    const headOffices = officeProfiles.filter(
        (office) => office.profileType === "HeadOffice"
    );
    const branches = officeProfiles.filter(
        (office) => office.profileType === "BranchOffice"
    );

    return (
        <div className="space-y-6">
            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Search & Filter Orders
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {/* Search Input */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search (Order ID, Member ID, Table ID)
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search orders..."
                            className="input input-bordered w-full"
                        />
                    </div>

                    {/* Head Office Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Head Office
                        </label>
                        <select
                            value={selectedHeadOffice}
                            onChange={(e) =>
                                setSelectedHeadOffice(e.target.value)
                            }
                            className="select select-bordered w-full"
                        >
                            <option value="">All Head Offices</option>
                            {headOffices.map((office) => (
                                <option key={office.id} value={office.id}>
                                    {office.companyName ||
                                        `Office ${office.id}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Branch Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Branch Office
                        </label>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="">All Branches</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.companyName ||
                                        `Branch ${branch.id}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* From Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            From Date
                        </label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="input input-bordered w-full"
                        />
                    </div>

                    {/* To Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            To Date
                        </label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="input input-bordered w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Recent Orders ({filteredOrders.length})
                        </h3>
                        <div className="text-sm text-gray-500">
                            Showing latest 100 orders
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Table</th>
                                    <th>Total</th>
                                    <th>Payment Method</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => {
                                        const customerInfo =
                                            getCustomerInfo(order);
                                        return (
                                            <tr key={order.id}>
                                                <td className="font-mono">
                                                    #{order.id}
                                                </td>
                                                <td>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="avatar">
                                                            <div className="mask mask-squircle w-12 h-12">
                                                                <div
                                                                    className={`w-12 h-12 ${customerInfo.color} text-white flex items-center justify-center rounded-full`}
                                                                >
                                                                    <span className="text-sm font-semibold">
                                                                        {
                                                                            customerInfo.initials
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold">
                                                                {
                                                                    customerInfo.name
                                                                }
                                                            </div>
                                                            <div className="text-sm opacity-50">
                                                                {
                                                                    customerInfo.email
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {order.table ? (
                                                        <div>
                                                            <div className="font-medium">
                                                                {
                                                                    order.table
                                                                        .tableShortName
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {
                                                                    order.table
                                                                        .tableShortFullName
                                                                }
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">
                                                            N/A
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="font-medium">
                                                    {formatCurrency(
                                                        order.sellingPrice
                                                    )}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            order.paymentType ===
                                                            "cash"
                                                                ? "badge-warning"
                                                                : order.paymentType ===
                                                                  "online"
                                                                ? "badge-info"
                                                                : order.paymentType ===
                                                                  "wallet"
                                                                ? "badge-primary"
                                                                : "badge-ghost"
                                                        }`}
                                                    >
                                                        {order.paymentType
                                                            ? order.paymentType
                                                                  .charAt(0)
                                                                  .toUpperCase() +
                                                              order.paymentType.slice(
                                                                  1
                                                              )
                                                            : "N/A"}
                                                    </span>
                                                </td>
                                                <td>{getStatusBadge(order)}</td>
                                                <td className="text-sm">
                                                    {formatDate(
                                                        order.created_at
                                                    )}
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            handleViewOrder(
                                                                order
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-xs"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-8 text-gray-500"
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

            {/* View Order Modal */}
            {showViewModal && selectedOrder && (
                <ViewOrderComponents
                    order={selectedOrder}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedOrder(null);
                    }}
                />
            )}
        </div>
    );
}
