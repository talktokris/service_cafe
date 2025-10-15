import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import { AdminDashboardLayout } from "../AdminComponents";

// Add custom scrollbar styles
const scrollbarHideStyles = `
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
`;

export default function TodayOTPView({
    auth,
    todayOrders = [],
    filters = {},
    availableDates = [],
}) {
    const user = auth?.user;

    console.log("TodayOTPView initialized with:", {
        todayOrdersCount: todayOrders.length,
        availableDates: availableDates.map((d) => ({
            value: d.value,
            label: d.label,
            is_today: d.is_today,
        })),
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOrders, setFilteredOrders] = useState(todayOrders);
    const [visibleOtps, setVisibleOtps] = useState(new Set());
    const [copiedOtps, setCopiedOtps] = useState(new Set());

    const { data, setData, get, processing } = useForm({
        search: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    // Update filtered orders when data changes from backend
    useEffect(() => {
        console.log("Orders data updated from backend:", {
            ordersCount: todayOrders.length,
        });
        setFilteredOrders(todayOrders);
    }, [todayOrders]);

    // Filter orders based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredOrders(todayOrders);
        } else {
            const filtered = todayOrders.filter((order) => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    order.id.toString().includes(searchLower) ||
                    order.txn_otp?.includes(searchLower) ||
                    order.memberUser?.first_name
                        ?.toLowerCase()
                        .includes(searchLower) ||
                    order.memberUser?.last_name
                        ?.toLowerCase()
                        .includes(searchLower) ||
                    order.memberUser?.email
                        ?.toLowerCase()
                        .includes(searchLower) ||
                    order.memberUser?.phone?.includes(searchLower)
                );
            });
            setFilteredOrders(filtered);
        }
    }, [searchTerm, todayOrders]);

    // Handle reload data
    const handleReloadData = () => {
        setIsLoading(true);

        get("/today-otp", {
            preserveState: false,
            replace: false,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (errors) => {
                console.error("Error reloading OTP orders:", errors);
                setIsLoading(false);
            },
        });
    };

    // Handle clear search
    const handleClearSearch = () => {
        setSearchTerm("");
    };

    // Toggle OTP visibility
    const toggleOtpVisibility = (orderId) => {
        const newVisibleOtps = new Set(visibleOtps);
        if (newVisibleOtps.has(orderId)) {
            newVisibleOtps.delete(orderId);
        } else {
            newVisibleOtps.add(orderId);
        }
        setVisibleOtps(newVisibleOtps);
    };

    // Copy OTP to clipboard
    const copyOtpToClipboard = (otp, orderId) => {
        navigator.clipboard.writeText(otp);
        const newCopiedOtps = new Set(copiedOtps);
        newCopiedOtps.add(orderId);
        setCopiedOtps(newCopiedOtps);

        // Remove the copied status after 3 seconds
        setTimeout(() => {
            setCopiedOtps((prev) => {
                const updated = new Set(prev);
                updated.delete(orderId);
                return updated;
            });
        }, 3000);
    };

    // Handle search functionality - now just local filtering
    const handleSearch = () => {
        // Search is now handled by useEffect with local filtering
        // No need for backend requests
        console.log("Searching locally for:", searchTerm);
    };

    // Update filtered orders when data changes from backend
    useEffect(() => {
        console.log("Orders data updated from backend:", {
            ordersCount: todayOrders.length,
            orders: todayOrders.map((order) => ({
                id: order.id,
                created_at: order.created_at,
                date: new Date(order.created_at).toLocaleDateString(),
            })),
        });
        // Backend handles all filtering, so just use the data as-is
        setFilteredOrders(todayOrders);
    }, [todayOrders]);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    return (
        <AdminDashboardLayout
            title="OTP Orders (Past 3 Days) - Serve Cafe"
            user={user}
        >
            <Head title="OTP Orders (Past 3 Days)" />

            {/* Custom styles for scrollbar */}
            <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyles }} />

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
                                    OTP Orders (Past 3 Days)
                                </h1>
                                <p className="text-sm text-gray-600">
                                    All OTP transactions from the past 3 days
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                                {filteredOrders.length}
                            </div>
                            <div className="text-sm text-gray-500">
                                {searchTerm ? "Filtered" : "Total"} Orders
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Box */}
            <div className="mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
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
                                placeholder="Search by Order ID, OTP, member name, or email..."
                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                        {searchTerm && (
                            <button
                                onClick={handleClearSearch}
                                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                            >
                                Clear
                            </button>
                        )}

                        {/* Load Data Button */}
                        <button
                            onClick={handleReloadData}
                            disabled={isLoading || processing}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors text-sm font-medium flex items-center"
                        >
                            {isLoading || processing ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b border-white mr-2"></div>
                                    Loading...
                                </>
                            ) : (
                                <>
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
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    Load Data
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
                {/* Loading Overlay */}
                {(isLoading || processing) && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="text-gray-600 font-medium">
                                {processing
                                    ? "Searching..."
                                    : "Loading orders..."}
                            </span>
                        </div>
                    </div>
                )}

                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
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
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                        <p className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm
                                ? "No matching orders found"
                                : "No OTP orders found"}
                        </p>
                        <p className="text-gray-500">
                            {searchTerm
                                ? "Try adjusting your search terms"
                                : "Orders with OTP from the past 3 days will appear here"}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Member Info
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        OTP
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    Order #{order.id}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Table:{" "}
                                                    {order.table
                                                        ?.tableShortName ||
                                                        "N/A"}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(
                                                        order.created_at
                                                    ).toLocaleDateString()}{" "}
                                                    at{" "}
                                                    {new Date(
                                                        order.created_at
                                                    ).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.memberUser
                                                        ? `${
                                                              order.memberUser
                                                                  .first_name ||
                                                              ""
                                                          } ${
                                                              order.memberUser
                                                                  .last_name ||
                                                              ""
                                                          }`.trim() ||
                                                          "Walking Customer"
                                                        : "Walking Customer"}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.memberUser?.email ||
                                                        "No email"}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.memberUser?.phone ||
                                                        "No phone"}
                                                </div>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                                        order.free_paid_member_status ===
                                                        1
                                                            ? "bg-emerald-100 text-emerald-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {order.free_paid_member_status ===
                                                    1
                                                        ? "💎 Paid"
                                                        : "🆓 Free"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2 relative">
                                                {/* Tooltip for copied message */}
                                                {copiedOtps.has(order.id) && (
                                                    <div className="absolute -top-10 left-0 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg z-10 animate-pulse">
                                                        OTP copied to clipboard!
                                                        <div className="absolute top-full left-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-600"></div>
                                                    </div>
                                                )}
                                                <div className="text-lg font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                                                    {visibleOtps.has(order.id)
                                                        ? order.txn_otp
                                                        : "•".repeat(
                                                              order.txn_otp
                                                                  ?.length || 6
                                                          )}
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        toggleOtpVisibility(
                                                            order.id
                                                        )
                                                    }
                                                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                                                    title={
                                                        visibleOtps.has(
                                                            order.id
                                                        )
                                                            ? "Hide OTP"
                                                            : "Show OTP"
                                                    }
                                                >
                                                    {visibleOtps.has(
                                                        order.id
                                                    ) ? (
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
                                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                                            />
                                                        </svg>
                                                    ) : (
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
                                                    onClick={() =>
                                                        copyOtpToClipboard(
                                                            order.txn_otp,
                                                            order.id
                                                        )
                                                    }
                                                    className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                                                    title="Copy OTP"
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
                                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatCurrency(
                                                    order.sellingPrice
                                                )}
                                            </div>
                                            {order.discountAmount > 0 && (
                                                <div className="text-sm text-red-600">
                                                    Discount:{" "}
                                                    {formatCurrency(
                                                        order.discountAmount
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminDashboardLayout>
    );
}
