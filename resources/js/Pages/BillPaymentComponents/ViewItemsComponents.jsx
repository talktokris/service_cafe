import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

export default function ViewItemsComponents({
    table,
    order,
    onClose,
    onAddItem,
    onEditItem,
    onDeleteItem,
    onMakePayment,
    onPrintReceipt,
    onRefresh,
    menuItems = [],
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [orderItems, setOrderItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch order items from the database
    useEffect(() => {
        console.log("ViewItemsComponents useEffect triggered:", {
            order: order,
            user: user,
            table: table,
        });

        if (order && order.id && user) {
            fetchOrderItems();
        } else {
            console.log("Missing required data:", {
                hasOrder: !!order,
                hasOrderId: !!(order && order.id),
                hasUser: !!user,
            });
        }
    }, [order, user]);

    const fetchOrderItems = async () => {
        try {
            setIsLoading(true);

            // Debug logging
            console.log("Fetching order items with params:", {
                orderId: order.id,
                headOfficeId: user.headOfficeId,
                branchId: user.branchId,
                tableId: table.id,
            });

            const response = await fetch(
                `/order-items?orderId=${order.id}&headOfficeId=${user.headOfficeId}&branchId=${user.branchId}&tableId=${table.id}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-TOKEN":
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute("content") || "",
                    },
                    credentials: "same-origin",
                }
            );

            console.log("Response status:", response.status);

            if (response.ok) {
                const data = await response.json();
                console.log("Fetched data:", data);
                setOrderItems(data.orderItems || []);
            } else {
                const errorText = await response.text();
                console.error(
                    "Failed to fetch order items:",
                    response.status,
                    errorText
                );
                setOrderItems([]);
            }
        } catch (error) {
            console.error("Error fetching order items:", error);
            setOrderItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => {
        const itemPrice = parseFloat(item.sellingPrice) || 0;
        const itemQty = parseInt(item.quantity) || 0;
        return sum + itemPrice * itemQty;
    }, 0);

    const totalTax = orderItems.reduce((sum, item) => {
        const taxAmount = parseFloat(item.taxAmount) || 0;
        return sum + taxAmount;
    }, 0);

    const finalTotal = subtotal + totalTax;

    // Debug logging
    console.log("Calculation Debug:", {
        orderItems: orderItems,
        subtotal: subtotal,
        totalTax: totalTax,
        finalTotal: finalTotal,
    });

    // Format currency
    const formatCurrency = (amount) => {
        const numAmount = parseFloat(amount) || 0;
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(numAmount);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[85vh] sm:h-[80vh] max-h-[600px] flex flex-col">
                {/* Fixed Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                            Table {table.tableShortName} - Order Items
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
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

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6">
                        {/* Order Items Table */}
                        <div className="mb-6">
                            {isLoading ? (
                                <div className="text-center py-8">
                                    <span className="loading loading-spinner loading-lg"></span>
                                    <p className="text-gray-500 mt-2">
                                        Loading order items...
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full text-sm">
                                        <thead>
                                            <tr>
                                                <th>S.N</th>
                                                <th>Menu Items</th>
                                                <th>Price</th>
                                                <th>Qty</th>
                                                <th>Tax</th>
                                                <th>Sub Total</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderItems.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="7"
                                                        className="text-center py-8 text-gray-500"
                                                    >
                                                        No items in this order
                                                    </td>
                                                </tr>
                                            ) : (
                                                orderItems.map(
                                                    (item, index) => (
                                                        <tr key={item.id}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <div className="font-medium">
                                                                    {item
                                                                        .menu_item
                                                                        ?.menuName ||
                                                                        item
                                                                            .menuItem
                                                                            ?.menuName ||
                                                                        "Unknown Item"}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className="font-medium text-green-600">
                                                                    {formatCurrency(
                                                                        item.sellingPrice
                                                                    )}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className="font-medium">
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className="font-medium text-orange-600">
                                                                    {formatCurrency(
                                                                        item.taxAmount ||
                                                                            0
                                                                    )}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className="font-medium text-blue-600">
                                                                    {formatCurrency(
                                                                        item.sellingPrice *
                                                                            item.quantity
                                                                    )}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="flex space-x-2">
                                                                    <button
                                                                        onClick={() =>
                                                                            onEditItem(
                                                                                item,
                                                                                () =>
                                                                                    fetchOrderItems()
                                                                            )
                                                                        }
                                                                        className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50"
                                                                        title="Edit Item"
                                                                    >
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
                                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            onDeleteItem(
                                                                                item,
                                                                                () =>
                                                                                    fetchOrderItems()
                                                                            )
                                                                        }
                                                                        className="btn btn-ghost btn-xs text-red-600 hover:bg-red-50"
                                                                        title="Delete Item"
                                                                    >
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
                                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="border-t border-gray-200 flex-shrink-0 bg-gray-50 rounded-b-lg">
                    {/* Totals Row - Always Visible */}
                    {orderItems.length > 0 && (
                        <div className="px-4 sm:px-6 pt-4 pb-2 border-b border-gray-300">
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <div className="flex flex-col sm:flex-row justify-evenly items-center w-full max-w-5xl gap-4 sm:gap-0">
                                    {/* Sub Total */}
                                    <div className="flex justify-between sm:justify-center items-center w-full sm:flex-1">
                                        <span className="text-gray-600 text-sm font-medium mr-2">
                                            Sub Total:
                                        </span>
                                        <span className="font-semibold text-lg">
                                            {formatCurrency(subtotal)}
                                        </span>
                                    </div>

                                    {/* Tax */}
                                    <div className="flex justify-between sm:justify-center items-center w-full sm:flex-1">
                                        <span className="text-gray-600 text-sm font-medium mr-2">
                                            Tax:
                                        </span>
                                        <span className="font-semibold text-lg text-orange-600">
                                            {formatCurrency(totalTax)}
                                        </span>
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-between sm:justify-center items-center w-full sm:flex-1">
                                        <span className="text-gray-800 text-base font-bold mr-2">
                                            Total:
                                        </span>
                                        <span className="font-bold text-xl text-green-600">
                                            {formatCurrency(finalTotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons Row */}
                    <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                            <button
                                onClick={onAddItem}
                                className="btn btn-sm sm:btn-md bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                                Add Item
                            </button>

                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                                <button
                                    onClick={onMakePayment}
                                    className="btn btn-sm sm:btn-md bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                                    disabled={orderItems.length === 0}
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                        />
                                    </svg>
                                    Make Payment
                                </button>
                                <button
                                    onClick={onPrintReceipt}
                                    className="btn btn-sm sm:btn-md bg-gray-600 hover:bg-gray-700 text-white w-full sm:w-auto"
                                    disabled={orderItems.length === 0}
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                        />
                                    </svg>
                                    Print Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
