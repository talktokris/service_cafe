import React, { useState, useEffect, useMemo } from "react";
import { Head } from "@inertiajs/react";
import { AdminDashboardLayout } from "../AdminComponents";

export default function TodayOTPView({
    auth,
    restaurantTables = [],
    orders = [],
    orderItems = [],
}) {
    const user = auth?.user;
    const [visibleOtps, setVisibleOtps] = useState(new Set());
    const [copiedOtps, setCopiedOtps] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState("");

    // Filter tables by user's headOfficeId and branchId (same as Bill Payment)
    const filteredTables = useMemo(() => {
        if (!user) return [];
        return restaurantTables.filter((table) => {
            if (user.branchId) {
                return (
                    table.headOfficeId == user.headOfficeId &&
                    table.branchId == user.branchId &&
                    table.deleteStatus === 0
                );
            }
            return (
                table.headOfficeId == user.headOfficeId &&
                table.deleteStatus === 0
            );
        });
    }, [restaurantTables, user]);

    // Build table occupancy map: tableId -> { order, orderId, totalAmount, itemCount, txn_otp }
    const tableOccupancy = useMemo(() => {
        const occupancy = {};
        const userOrders = orders.filter((order) => {
            if (user?.branchId) {
                return (
                    order.headOfficeId == user.headOfficeId &&
                    order.branchId == user.branchId &&
                    order.tableOccupiedStatus === 1 &&
                    order.paymentStatus === 0 &&
                    order.deleteStatus === 0
                );
            }
            return (
                order.headOfficeId == user?.headOfficeId &&
                order.tableOccupiedStatus === 1 &&
                order.paymentStatus === 0 &&
                order.deleteStatus === 0
            );
        });

        userOrders.forEach((order) => {
            if (order.tableId) {
                const items = orderItems.filter(
                    (item) =>
                        item.orderId === order.id && item.deleteStatus === 0
                );
                const subtotal = items.reduce((sum, item) => {
                    const itemPrice = parseFloat(item.sellingPrice) || 0;
                    const itemQty = parseInt(item.quantity) || 0;
                    return sum + itemPrice * itemQty;
                }, 0);
                const totalTax = items.reduce((sum, item) => {
                    const taxAmount = parseFloat(item.taxAmount) || 0;
                    return sum + taxAmount;
                }, 0);
                const totalAmount = subtotal + totalTax;
                const itemCount = items.length;

                occupancy[order.tableId] = {
                    isOccupied: true,
                    orderId: order.id,
                    totalAmount,
                    itemCount,
                    txn_otp: order.txn_otp || null,
                    order,
                };
            }
        });
        return occupancy;
    }, [orders, orderItems, user]);

    // Tables with active order that has OTP
    const tablesWithOtpCount = useMemo(() => {
        return Object.values(tableOccupancy).filter(
            (o) => o.txn_otp && o.txn_otp.trim() !== ""
        ).length;
    }, [tableOccupancy]);

    // Optional: filter tables by search (table name or order id)
    const displayedTables = useMemo(() => {
        if (!searchTerm.trim()) return filteredTables;
        const term = searchTerm.toLowerCase();
        return filteredTables.filter((table) => {
            const name =
                (table.tableShortName || "") +
                " " +
                (table.tableShortFullName || "");
            if (name.toLowerCase().includes(term)) return true;
            const occ = tableOccupancy[table.id];
            if (occ && occ.orderId && occ.orderId.toString().includes(term))
                return true;
            if (occ && occ.txn_otp && occ.txn_otp.includes(term)) return true;
            return false;
        });
    }, [filteredTables, searchTerm, tableOccupancy]);

    const getTableOrderData = (tableId) => {
        const occ = tableOccupancy[tableId];
        if (occ && occ.isOccupied) {
            return {
                isOccupied: true,
                orderId: occ.orderId,
                totalAmount: occ.totalAmount,
                itemCount: occ.itemCount,
                txn_otp: occ.txn_otp,
                order: occ.order,
            };
        }
        return {
            isOccupied: false,
            orderId: null,
            totalAmount: 0,
            itemCount: 0,
            txn_otp: null,
            order: null,
        };
    };

    const toggleOtpVisibility = (orderId) => {
        setVisibleOtps((prev) => {
            const next = new Set(prev);
            if (next.has(orderId)) next.delete(orderId);
            else next.add(orderId);
            return next;
        });
    };

    const copyOtpToClipboard = (otp, orderId) => {
        if (!otp) return;
        navigator.clipboard.writeText(otp);
        setCopiedOtps((prev) => new Set(prev).add(orderId));
        setTimeout(() => {
            setCopiedOtps((prev) => {
                const updated = new Set(prev);
                updated.delete(orderId);
                return updated;
            });
        }, 3000);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    return (
        <AdminDashboardLayout
            title="Today OTP - Serve Cafe"
            user={user}
        >
            <Head title="Today OTP" />

            {/* Page Header */}
            <div className="mb-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
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
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Today OTP
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Active unpaid orders with OTP by table
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Total Tables
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {filteredTables.length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-green-600"
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
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Active orders with OTP
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {tablesWithOtpCount}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-gray-600"
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
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Unpaid orders (total)
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {Object.keys(tableOccupancy).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by table name, order ID, or OTP..."
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedTables.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
                        <svg
                            className="w-16 h-16 mx-auto mb-4 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                        <p className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm
                                ? "No matching tables"
                                : "No tables available"}
                        </p>
                        <p className="text-gray-500">
                            {searchTerm
                                ? "Try a different search"
                                : "No restaurant tables found for your office."}
                        </p>
                    </div>
                ) : (
                    displayedTables.map((table) => {
                        const orderData = getTableOrderData(table.id);
                        const isOccupied = orderData.isOccupied;

                        return (
                            <div
                                key={table.id}
                                className={`rounded-lg shadow-sm border p-6 transition-all duration-200 ${
                                    isOccupied
                                        ? "bg-gray-800 border-gray-700"
                                        : "bg-white border-gray-200"
                                }`}
                            >
                                <div className="text-center">
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                                            isOccupied
                                                ? "bg-gray-700"
                                                : "bg-blue-100"
                                        }`}
                                    >
                                        <span
                                            className={`text-2xl font-bold ${
                                                isOccupied
                                                    ? "text-white"
                                                    : "text-blue-600"
                                            }`}
                                        >
                                            {table.tableShortName || "T"}
                                        </span>
                                    </div>
                                    <h3
                                        className={`text-xl font-bold mb-2 ${
                                            isOccupied
                                                ? "text-white"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        {table.tableShortName || "Table"}
                                    </h3>
                                    <p
                                        className={`text-sm mb-4 ${
                                            isOccupied
                                                ? "text-gray-300"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {table.tableShortFullName ||
                                            "Table Description"}
                                    </p>

                                    {isOccupied ? (
                                        <div className="space-y-2 text-left">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-300">
                                                    Order #
                                                </span>
                                                <span className="font-semibold text-white">
                                                    {orderData.orderId}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center gap-2">
                                                <span className="text-sm text-gray-300">
                                                    OTP:
                                                </span>
                                                <div className="flex items-center space-x-1">
                                                    <span className="font-mono font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded text-sm">
                                                        {orderData.txn_otp
                                                            ? visibleOtps.has(
                                                                  orderData.orderId
                                                              )
                                                                ? orderData.txn_otp
                                                                : "•".repeat(
                                                                      orderData.txn_otp?.length ||
                                                                          6
                                                                  )
                                                            : "—"}
                                                    </span>
                                                    {orderData.txn_otp && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    toggleOtpVisibility(
                                                                        orderData.orderId
                                                                    )
                                                                }
                                                                className="p-1 text-gray-400 hover:text-white"
                                                                title={
                                                                    visibleOtps.has(
                                                                        orderData.orderId
                                                                    )
                                                                        ? "Hide OTP"
                                                                        : "Show OTP"
                                                                }
                                                            >
                                                                {visibleOtps.has(
                                                                    orderData.orderId
                                                                ) ? (
                                                                    <svg
                                                                        className="w-4 h-4"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                                                        />
                                                                    </svg>
                                                                ) : (
                                                                    <svg
                                                                        className="w-4 h-4"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                        />
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                        />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    copyOtpToClipboard(
                                                                        orderData.txn_otp,
                                                                        orderData.orderId
                                                                    )
                                                                }
                                                                className="p-1 text-gray-400 hover:text-green-400"
                                                                title="Copy OTP"
                                                            >
                                                                {copiedOtps.has(
                                                                    orderData.orderId
                                                                ) ? (
                                                                    <span className="text-xs text-green-400">
                                                                        Copied!
                                                                    </span>
                                                                ) : (
                                                                    <svg
                                                                        className="w-4 h-4"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                                        />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-300">
                                                    Total Amount:
                                                </span>
                                                <span className="font-semibold text-green-400">
                                                    {formatCurrency(
                                                        orderData.totalAmount
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-300">
                                                    Items:
                                                </span>
                                                <span className="font-semibold text-white">
                                                    {orderData.itemCount}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <span className="text-sm text-green-600 font-medium">
                                                Ready to use
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </AdminDashboardLayout>
    );
}
