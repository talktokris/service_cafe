import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import ViewItemsComponents from "./ViewItemsComponents";
import AddMenuItemComponents from "./AddMenuItemComponents";
import EditMenuItemComponents from "./EditMenuItemComponents";
import DeleteMenuItemComponents from "./DeleteMenuItemComponents";
import PayBillComponents from "./PayBillComponents";
import PrintReceiptComponents from "./PrintReceiptComponents";
import TableUserConfirmComponent from "./TableUserConfirmComponent";

export default function ManageBillPaymentComponents({
    user,
    restaurantTables = [],
    menuItems = [],
    orders = [],
    orderItems = [],
}) {
    const [tables, setTables] = useState(restaurantTables);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [refreshCallback, setRefreshCallback] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [tableOrders, setTableOrders] = useState({});
    const [tableOccupancy, setTableOccupancy] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Update tables when restaurantTables prop changes
    useEffect(() => {
        console.log("RestaurantTables received:", restaurantTables);
        console.log("MenuItems received:", menuItems);
        console.log("Orders received:", orders);
        console.log("OrderItems received:", orderItems);
        console.log("User received:", user);
        setTables(restaurantTables);

        // Calculate table occupancy and totals
        calculateTableOccupancy();
    }, [restaurantTables, menuItems, orders, orderItems, user]);

    // Calculate table occupancy status and totals
    const calculateTableOccupancy = () => {
        const occupancy = {};

        // Filter orders based on user's headOfficeId and branchId
        const userOrders = orders.filter((order) => {
            if (user.branchId) {
                return (
                    order.headOfficeId == user.headOfficeId &&
                    order.branchId == user.branchId &&
                    order.tableOccupiedStatus === 1 &&
                    order.deleteStatus === 0
                );
            } else {
                return (
                    order.headOfficeId == user.headOfficeId &&
                    order.tableOccupiedStatus === 1 &&
                    order.deleteStatus === 0
                );
            }
        });

        // Process each order to get table occupancy and totals
        userOrders.forEach((order) => {
            if (order.tableId) {
                const tableId = order.tableId;

                // Get order items for this order
                const items = orderItems.filter(
                    (item) =>
                        item.orderId === order.id && item.deleteStatus === 0
                );

                // Calculate total amount and item count (matching ViewItemsComponents logic)
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

                occupancy[tableId] = {
                    isOccupied: true,
                    orderId: order.id,
                    totalAmount: totalAmount,
                    subtotal: subtotal,
                    totalTax: totalTax,
                    itemCount: itemCount,
                    order: order,
                };
            }
        });

        setTableOccupancy(occupancy);
    };

    // Filter tables based on user's headOfficeId and branchId
    const filteredTables = tables.filter((table) => {
        console.log("Table:", table);
        console.log("User:", user);
        console.log(
            "Table headOfficeId:",
            table.headOfficeId,
            "User headOfficeId:",
            user.headOfficeId
        );
        console.log(
            "Table branchId:",
            table.branchId,
            "User branchId:",
            user.branchId
        );

        // If user has a branchId, show only tables from that branch
        if (user.branchId) {
            return (
                table.headOfficeId == user.headOfficeId &&
                table.branchId == user.branchId &&
                table.deleteStatus === 0
            );
        }
        // If user is head office only, show all tables from that head office
        else {
            return (
                table.headOfficeId == user.headOfficeId &&
                table.deleteStatus === 0
            );
        }
    });

    // Get table order data from occupancy status
    const getTableOrderData = (tableId) => {
        const occupancy = tableOccupancy[tableId];
        if (occupancy && occupancy.isOccupied) {
            return {
                isOccupied: true,
                totalAmount: occupancy.totalAmount,
                itemCount: occupancy.itemCount,
                orderId: occupancy.orderId,
                order: occupancy.order,
            };
        }
        return {
            isOccupied: false,
            totalAmount: 0,
            itemCount: 0,
            orderId: null,
            order: null,
        };
    };

    // Handle table card click
    const handleTableClick = (table) => {
        const orderData = getTableOrderData(table.id);
        const isOccupied = orderData.isOccupied;

        setSelectedTable(table);

        if (isOccupied) {
            // If table is occupied, directly open ViewItemsComponents
            setShowViewModal(true);
        } else {
            // If table is not occupied, show confirmation modal
            setShowConfirmModal(true);
        }
    };

    // Handle add menu item
    const handleAddMenuItem = (table) => {
        setSelectedTable(table);
        setShowAddModal(true);
    };

    // Handle edit menu item
    const handleEditMenuItem = (menuItem, onRefresh) => {
        setSelectedMenuItem(menuItem);
        setShowEditModal(true);
        setRefreshCallback(() => onRefresh);
    };

    // Handle delete menu item
    const handleDeleteMenuItem = (menuItem, onRefresh) => {
        setSelectedMenuItem(menuItem);
        setShowDeleteModal(true);
        setRefreshCallback(() => onRefresh);
    };

    // Handle make payment
    const handleMakePayment = (table) => {
        setSelectedTable(table);
        setShowPayModal(true);
    };

    // Handle print receipt
    const handlePrintReceipt = (table) => {
        setSelectedTable(table);
        setShowPrintModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Bill Payment Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage orders and payments for restaurant tables
                    </p>
                </div>
            </div> */}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                                Active Orders
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {Object.keys(tableOrders).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-yellow-600"
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
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Total Revenue
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹0
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-purple-600"
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
                                Pending Bills
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                0
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTables.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <div className="text-gray-500">
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
                                No Tables Available
                            </p>
                            <p className="text-gray-500">
                                No restaurant tables found for your office.
                            </p>
                        </div>
                    </div>
                ) : (
                    filteredTables.map((table) => {
                        const orderData = getTableOrderData(table.id);
                        const isOccupied = orderData.isOccupied;

                        return (
                            <div
                                key={table.id}
                                onClick={() => handleTableClick(table)}
                                className={`rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-all duration-200 ${
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
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-300">
                                                    Total Amount:
                                                </span>
                                                <span className="font-semibold text-green-400">
                                                    ₹
                                                    {orderData.totalAmount.toFixed(
                                                        2
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
                                                Ready to Use
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modals */}
            {showConfirmModal && selectedTable && (
                <TableUserConfirmComponent
                    table={selectedTable}
                    user={user}
                    onClose={() => {
                        setShowConfirmModal(false);
                        setSelectedTable(null);
                    }}
                    onConfirm={() => {
                        setShowConfirmModal(false);
                        // Refresh the page to get updated data
                        router.reload();
                        // Open ViewItemsComponents after order creation
                        setTimeout(() => {
                            setShowViewModal(true);
                        }, 1000);
                    }}
                />
            )}

            {showViewModal && selectedTable && (
                <ViewItemsComponents
                    table={selectedTable}
                    order={getTableOrderData(selectedTable.id).order}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedTable(null);
                    }}
                    onAddItem={() => handleAddMenuItem(selectedTable)}
                    onEditItem={handleEditMenuItem}
                    onDeleteItem={handleDeleteMenuItem}
                    onMakePayment={() => handleMakePayment(selectedTable)}
                    onPrintReceipt={() => handlePrintReceipt(selectedTable)}
                    menuItems={menuItems}
                />
            )}

            {showAddModal && selectedTable && (
                <AddMenuItemComponents
                    table={selectedTable}
                    user={user}
                    order={getTableOrderData(selectedTable.id).order}
                    onClose={() => {
                        setShowAddModal(false);
                        setSelectedTable(null);
                    }}
                    onSuccess={() => {
                        setShowAddModal(false);
                        setSelectedTable(null);
                        // Refresh the page to get updated data
                        router.reload();
                    }}
                    menuItems={menuItems}
                />
            )}

            {showEditModal && selectedMenuItem && (
                <EditMenuItemComponents
                    menuItem={selectedMenuItem}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedMenuItem(null);
                        setRefreshCallback(null);
                    }}
                    onSuccess={() => {
                        setShowEditModal(false);
                        setSelectedMenuItem(null);
                        if (refreshCallback) {
                            refreshCallback();
                        }
                        setRefreshCallback(null);
                    }}
                />
            )}

            {showDeleteModal && selectedMenuItem && (
                <DeleteMenuItemComponents
                    menuItem={selectedMenuItem}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedMenuItem(null);
                        setRefreshCallback(null);
                    }}
                    onSuccess={() => {
                        setShowDeleteModal(false);
                        setSelectedMenuItem(null);
                        if (refreshCallback) {
                            refreshCallback();
                        }
                        setRefreshCallback(null);
                    }}
                />
            )}

            {showPayModal && selectedTable && (
                <PayBillComponents
                    table={selectedTable}
                    orderTotal={
                        tableOccupancy[selectedTable.id]?.totalAmount || 0
                    }
                    orderSubtotal={
                        tableOccupancy[selectedTable.id]?.subtotal || 0
                    }
                    orderTax={tableOccupancy[selectedTable.id]?.totalTax || 0}
                    onClose={() => {
                        setShowPayModal(false);
                        setSelectedTable(null);
                    }}
                    onSuccess={(paymentData) => {
                        setShowPayModal(false);
                        setSelectedTable(null);

                        // If payment was processed, refresh the data
                        if (paymentData.paymentProcessed) {
                            // Reload the page to refresh all data
                            window.location.reload();
                        }
                    }}
                />
            )}

            {showPrintModal && selectedTable && (
                <PrintReceiptComponents
                    table={selectedTable}
                    order={getTableOrderData(selectedTable.id).order}
                    onClose={() => {
                        setShowPrintModal(false);
                        setSelectedTable(null);
                    }}
                />
            )}
        </div>
    );
}
