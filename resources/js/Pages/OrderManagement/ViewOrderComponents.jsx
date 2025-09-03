import React, { useState } from "react";
import ViewOrderItemComponents from "./ViewOrderItemComponents";

export default function ViewOrderComponents({ order, onClose }) {
    const [showOrderItems, setShowOrderItems] = useState(false);

    // Debug logging for order 6
    if (order.id === 6) {
        console.log("ViewOrderComponents - Order 6 Debug:", {
            order: order,
            customerType: order.customerType,
            memberUserId: order.memberUserId,
            memberUser: order.memberUser,
            hasMemberUser: !!order.memberUser,
            memberUserKeys: order.memberUser
                ? Object.keys(order.memberUser)
                : "No memberUser",
        });
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const getStatusBadge = (order) => {
        if (order.paymentStatus === 1) {
            return (
                <span className="badge badge-success badge-lg">Completed</span>
            );
        } else if (order.tableOccupiedStatus === 1) {
            return (
                <span className="badge badge-warning badge-lg">Processing</span>
            );
        } else {
            return (
                <span className="badge badge-error badge-lg">Cancelled</span>
            );
        }
    };

    const getPaymentMethodBadge = (paymentType) => {
        if (!paymentType) return <span className="badge badge-ghost">N/A</span>;

        const badgeClass =
            {
                cash: "badge-warning",
                online: "badge-info",
                wallet: "badge-primary",
            }[paymentType] || "badge-ghost";

        return (
            <span className={`badge ${badgeClass} badge-lg`}>
                {paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}
            </span>
        );
    };

    const getCustomerTypeBadge = (customerType) => {
        const badgeClass =
            customerType === "member" ? "badge-primary" : "badge-secondary";
        return (
            <span className={`badge ${badgeClass} badge-lg`}>
                {customerType === "member" ? "Member" : "Walking Customer"}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Order Details - #{order.id}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Complete order information and payment details
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="btn btn-ghost btn-circle"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Order Status and Payment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                                Order Status
                            </h3>
                            <div className="flex items-center space-x-2">
                                {getStatusBadge(order)}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                                Payment Method
                            </h3>
                            <div className="flex items-center space-x-2">
                                {getPaymentMethodBadge(order.paymentType)}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                                Customer Type
                            </h3>
                            <div className="flex items-center space-x-2">
                                {getCustomerTypeBadge(order.customerType)}
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Customer Information
                        </h3>
                        {order.customerType === "member" && order.memberUser ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Name
                                    </label>
                                    <p className="text-gray-900 font-medium">
                                        {order.memberUser.first_name || ""}{" "}
                                        {order.memberUser.last_name || ""}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Email
                                    </label>
                                    <p className="text-gray-900">
                                        {order.memberUser.email || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Phone
                                    </label>
                                    <p className="text-gray-900">
                                        {order.memberUser.phone || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Referral Code
                                    </label>
                                    <p className="text-gray-900 font-mono">
                                        {order.memberUser.referral_code ||
                                            "N/A"}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500">
                                    Walking Customer - No member information
                                    available
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Table Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Table Information
                        </h3>
                        {order.table ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Table Name
                                    </label>
                                    <p className="text-gray-900 font-medium">
                                        {order.table.tableShortName}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Full Name
                                    </label>
                                    <p className="text-gray-900">
                                        {order.table.tableShortFullName}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Occupancy Status
                                    </label>
                                    <span
                                        className={`badge ${
                                            order.tableOccupiedStatus
                                                ? "badge-warning"
                                                : "badge-success"
                                        }`}
                                    >
                                        {order.tableOccupiedStatus
                                            ? "Occupied"
                                            : "Available"}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500">
                                    No table information available
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Financial Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Financial Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Buying Price
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {formatCurrency(order.buyingPrice)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Selling Price
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {formatCurrency(order.sellingPrice)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Discount Amount
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {formatCurrency(order.discountAmount)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Tax Amount
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {formatCurrency(order.taxAmount)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Admin Profit
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {formatCurrency(order.adminProfitAmount)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    User Commission
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {formatCurrency(order.userCommissionAmount)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Payment Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Payment Reference
                                </label>
                                <p className="text-gray-900 font-mono">
                                    {order.paymentReference || "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Payment Status
                                </label>
                                <span
                                    className={`badge ${
                                        order.paymentStatus
                                            ? "badge-success"
                                            : "badge-warning"
                                    }`}
                                >
                                    {order.paymentStatus ? "Paid" : "Pending"}
                                </span>
                            </div>
                        </div>
                        {order.notes && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-500">
                                    Notes
                                </label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                                    {order.notes}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Timestamps */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Order Timeline
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Order Started
                                </label>
                                <p className="text-gray-900">
                                    {formatDate(order.orderStaredDateTime)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Order Ended
                                </label>
                                <p className="text-gray-900">
                                    {formatDate(order.orderEndDateTime)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Created At
                                </label>
                                <p className="text-gray-900">
                                    {formatDate(order.created_at)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Last Updated
                                </label>
                                <p className="text-gray-900">
                                    {formatDate(order.updated_at)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Office Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Office Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Head Office
                                </label>
                                <p className="text-gray-900">
                                    {order.headOffice
                                        ? order.headOffice.companyName ||
                                          `Office ${order.headOffice.id}`
                                        : "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Branch Office
                                </label>
                                <p className="text-gray-900">
                                    {order.branch
                                        ? order.branch.companyName ||
                                          `Branch ${order.branch.id}`
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-between items-center">
                    <button
                        onClick={() => setShowOrderItems(true)}
                        className="btn btn-primary"
                    >
                        <svg
                            className="w-4 h-4 mr-2"
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
                        View Items
                    </button>
                    <button onClick={onClose} className="btn btn-ghost">
                        Close
                    </button>
                </div>
            </div>

            {/* View Order Items Modal */}
            {showOrderItems && (
                <ViewOrderItemComponents
                    order={order}
                    onClose={() => setShowOrderItems(false)}
                />
            )}
        </div>
    );
}
