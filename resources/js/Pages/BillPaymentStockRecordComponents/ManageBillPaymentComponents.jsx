import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import ViewItemsComponents from "./ViewItemsComponents";
import AddMenuItemComponents from "./AddMenuItemComponents";
import EditMenuItemComponents from "./EditMenuItemComponents";
import DeleteMenuItemComponents from "./DeleteMenuItemComponents";
import PayBillComponents from "./PayBillComponents";
import PrintReceiptComponents from "./PrintReceiptComponents";

export default function ManageBillPaymentComponents({
    user,
    restaurantTables = [],
    menuItems = [],
}) {
    const [tables, setTables] = useState(restaurantTables);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [tableOrders, setTableOrders] = useState({});

    // Update tables when restaurantTables prop changes
    useEffect(() => {
        console.log("RestaurantTables received:", restaurantTables);
        console.log("MenuItems received:", menuItems);
        console.log("User received:", user);
        setTables(restaurantTables);
    }, [restaurantTables, menuItems, user]);

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

    // Get table order data (mock data for now)
    const getTableOrderData = (tableId) => {
        return (
            tableOrders[tableId] || {
                items: [],
                totalAmount: 0,
                itemCount: 0,
            }
        );
    };

    // Handle table card click
    const handleTableClick = (table) => {
        setSelectedTable(table);
        setShowViewModal(true);
    };

    // Handle add menu item
    const handleAddMenuItem = (table) => {
        setSelectedTable(table);
        setShowAddModal(true);
    };

    // Handle edit menu item
    const handleEditMenuItem = (menuItem) => {
        setSelectedMenuItem(menuItem);
        setShowEditModal(true);
    };

    // Handle delete menu item
    const handleDeleteMenuItem = (menuItem) => {
        setSelectedMenuItem(menuItem);
        setShowDeleteModal(true);
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
                        return (
                            <div
                                key={table.id}
                                onClick={() => handleTableClick(table)}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl font-bold text-blue-600">
                                            {table.tableShortName || "T"}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {table.tableShortName || "Table"}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {table.tableShortFullName ||
                                            "Table Description"}
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                Total Amount:
                                            </span>
                                            <span className="font-semibold text-green-600">
                                                ₹{orderData.totalAmount}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                Items:
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                {orderData.itemCount}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modals */}
            {showViewModal && selectedTable && (
                <ViewItemsComponents
                    table={selectedTable}
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
                    onClose={() => {
                        setShowAddModal(false);
                        setSelectedTable(null);
                    }}
                    onSuccess={() => {
                        setShowAddModal(false);
                        setSelectedTable(null);
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
                    }}
                    onSuccess={() => {
                        setShowEditModal(false);
                        setSelectedMenuItem(null);
                    }}
                />
            )}

            {showDeleteModal && selectedMenuItem && (
                <DeleteMenuItemComponents
                    menuItem={selectedMenuItem}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedMenuItem(null);
                    }}
                    onSuccess={() => {
                        setShowDeleteModal(false);
                        setSelectedMenuItem(null);
                    }}
                />
            )}

            {showPayModal && selectedTable && (
                <PayBillComponents
                    table={selectedTable}
                    onClose={() => {
                        setShowPayModal(false);
                        setSelectedTable(null);
                    }}
                    onSuccess={() => {
                        setShowPayModal(false);
                        setSelectedTable(null);
                    }}
                />
            )}

            {showPrintModal && selectedTable && (
                <PrintReceiptComponents
                    table={selectedTable}
                    onClose={() => {
                        setShowPrintModal(false);
                        setSelectedTable(null);
                    }}
                />
            )}
        </div>
    );
}
