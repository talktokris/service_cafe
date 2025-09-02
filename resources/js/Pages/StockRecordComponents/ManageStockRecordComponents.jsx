import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import CreateStockRecordComponents from "./CreateStockRecordComponents";
import ViewStockRecordComponents from "./ViewStockRecordComponents";
import EditStockRecordComponents from "./EditStockRecordComponents";
import DeleteStockRecordComponents from "./DeleteStockRecordComponents";

export default function ManageStockRecordComponents({
    user,
    stockRecords = [],
    officeProfiles = [],
    stockItemSettings = [],
}) {
    const [stockRecordsData, setStockRecordsData] = useState(stockRecords);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStockRecord, setSelectedStockRecord] = useState(null);

    // Filter states
    const [filterHeadOffice, setFilterHeadOffice] = useState("all");
    const [filterBranchOffice, setFilterBranchOffice] = useState("all");
    const [filterStockItem, setFilterStockItem] = useState("all");
    const [filteredData, setFilteredData] = useState(stockRecords);

    // Update stock records when stockRecords prop changes
    useEffect(() => {
        setStockRecordsData(stockRecords);
        setFilteredData(stockRecords);
    }, [stockRecords]);

    // Get head offices and branch offices for filters
    const headOffices = officeProfiles.filter(
        (profile) =>
            profile.profileType === "HeadOffice" && profile.deleteStatus === 0
    );
    const branchOffices = officeProfiles.filter(
        (profile) =>
            profile.profileType === "BranchOffice" && profile.deleteStatus === 0
    );

    // Apply filters
    const applyFilters = () => {
        const filtered = stockRecordsData.filter((record) => {
            const matchesHeadOffice =
                filterHeadOffice === "all" ||
                record.headOfficeId == filterHeadOffice;
            const matchesBranchOffice =
                filterBranchOffice === "all" ||
                record.branchId == filterBranchOffice;
            const matchesStockItem =
                filterStockItem === "all" ||
                record.stockItemSettingId == filterStockItem;

            return (
                matchesHeadOffice &&
                matchesBranchOffice &&
                matchesStockItem &&
                record.deleteStatus === 0
            );
        });
        setFilteredData(filtered);
    };

    // Reset filters
    const resetFilters = () => {
        setFilterHeadOffice("all");
        setFilterBranchOffice("all");
        setFilterStockItem("all");
        setFilteredData(
            stockRecordsData.filter((record) => record.deleteStatus === 0)
        );
    };

    // Handle create stock record
    const handleCreateStockRecord = (newStockRecord) => {
        console.log(
            "New stock record received in handleCreateStockRecord:",
            newStockRecord
        );
        console.log("Current stock records before update:", stockRecordsData);
        console.log("Current filtered data before update:", filteredData);

        setStockRecordsData((prevRecords) => {
            const updatedRecords = [...prevRecords, newStockRecord];
            console.log("Updated stock records:", updatedRecords);
            return updatedRecords;
        });

        // Also update filtered data immediately
        setFilteredData((prevFiltered) => {
            const newFiltered = [...prevFiltered, newStockRecord];
            console.log("Updated filtered records:", newFiltered);
            return newFiltered;
        });

        setShowCreateModal(false);
    };

    // Handle edit stock record
    const handleEditStockRecord = (updatedStockRecord) => {
        setStockRecordsData(
            stockRecordsData.map((record) =>
                record.id === updatedStockRecord.id
                    ? updatedStockRecord
                    : record
            )
        );
        // Also update filtered data immediately
        setFilteredData(
            filteredData.map((record) =>
                record.id === updatedStockRecord.id
                    ? updatedStockRecord
                    : record
            )
        );
        setShowEditModal(false);
        setSelectedStockRecord(null);
    };

    // Handle delete stock record
    const handleDeleteStockRecord = (deletedStockRecordId) => {
        console.log("Deleting stock record with ID:", deletedStockRecordId);
        console.log("Current stock records before delete:", stockRecordsData);
        console.log("Current filtered data before delete:", filteredData);

        setStockRecordsData(
            stockRecordsData.map((record) =>
                record.id === deletedStockRecordId
                    ? { ...record, deleteStatus: 1 }
                    : record
            )
        );
        // Also remove from filtered data immediately
        setFilteredData(
            filteredData.filter((record) => record.id !== deletedStockRecordId)
        );

        console.log("After delete - filtered data should be updated");
        setShowDeleteModal(false);
        setSelectedStockRecord(null);
    };

    // Handle view button click
    const handleViewClick = (stockRecord) => {
        setSelectedStockRecord(stockRecord);
        setShowViewModal(true);
    };

    // Handle edit button click
    const handleEditClick = (stockRecord) => {
        setSelectedStockRecord(stockRecord);
        setShowEditModal(true);
    };

    // Handle delete button click
    const handleDeleteClick = (stockRecord) => {
        setSelectedStockRecord(stockRecord);
        setShowDeleteModal(true);
    };

    // Get office name by ID
    const getOfficeName = (officeId, type) => {
        if (!officeId) return "N/A";
        const office = officeProfiles.find((profile) => profile.id == officeId);
        return office ? office.companyName : "Unknown";
    };

    // Get stock item name by ID
    const getStockItemName = (stockItemId) => {
        if (!stockItemId) return "N/A";
        const stockItem = stockItemSettings.find(
            (item) => item.id == stockItemId
        );
        return stockItem ? stockItem.itemName : "Unknown";
    };

    // Format currency
    const formatCurrency = (amount) => {
        const numAmount = parseFloat(amount) || 0;
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(numAmount);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Stock Records Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage stock records for head offices and branch offices
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn bg-red-600 hover:bg-red-700 text-white"
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
                    Add New Stock Record
                </button>
            </div>

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
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Total Stock Records
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    stockRecordsData.filter(
                                        (i) => i.deleteStatus === 0
                                    ).length
                                }
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
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Food Records
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    stockRecordsData.filter(
                                        (i) =>
                                            i.itemType === "food" &&
                                            i.deleteStatus === 0
                                    ).length
                                }
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
                                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Drink Records
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    stockRecordsData.filter(
                                        (i) =>
                                            i.itemType === "drink" &&
                                            i.deleteStatus === 0
                                    ).length
                                }
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
                                Total Value
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {(() => {
                                    const totalValue = stockRecordsData
                                        .filter((i) => i.deleteStatus === 0)
                                        .reduce((sum, record) => {
                                            const amount =
                                                parseFloat(
                                                    record.itemAmountTotal
                                                ) || 0;
                                            console.log(
                                                `Record ${record.id}: itemAmountTotal = ${record.itemAmountTotal}, parsed = ${amount}`
                                            );
                                            return sum + amount;
                                        }, 0);
                                    console.log(
                                        "Total value calculated:",
                                        totalValue
                                    );
                                    return formatCurrency(totalValue);
                                })()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="label">
                            <span className="label-text">Head Office</span>
                        </label>
                        <select
                            value={filterHeadOffice}
                            onChange={(e) =>
                                setFilterHeadOffice(e.target.value)
                            }
                            className="select select-bordered w-full"
                        >
                            <option value="all">All Head Offices</option>
                            {headOffices.map((office) => (
                                <option key={office.id} value={office.id}>
                                    {office.companyName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Branch Office</span>
                        </label>
                        <select
                            value={filterBranchOffice}
                            onChange={(e) =>
                                setFilterBranchOffice(e.target.value)
                            }
                            className="select select-bordered w-full"
                        >
                            <option value="all">All Branch Offices</option>
                            {branchOffices.map((office) => (
                                <option key={office.id} value={office.id}>
                                    {office.companyName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Stock Item</span>
                        </label>
                        <select
                            value={filterStockItem}
                            onChange={(e) => setFilterStockItem(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="all">All Stock Items</option>
                            {stockItemSettings.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.itemName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end space-x-2">
                        <button
                            onClick={applyFilters}
                            className="btn btn-primary"
                        >
                            Filter
                        </button>
                        <button
                            onClick={resetFilters}
                            className="btn btn-ghost"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Stock Records Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Stock Records ({filteredData.length})
                    </h3>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Stock Item</th>
                                    <th>Item Type</th>
                                    <th>Head Office</th>
                                    <th>Branch Office</th>
                                    <th>Quantity</th>
                                    <th>Amount</th>
                                    <th>Total Value</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-8 text-gray-500"
                                        >
                                            No stock records found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((record) => (
                                        <tr key={record.id}>
                                            <td>
                                                <div className="font-bold">
                                                    {getStockItemName(
                                                        record.stockItemSettingId
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        record.itemType ===
                                                        "food"
                                                            ? "badge-primary"
                                                            : "badge-secondary"
                                                    }`}
                                                >
                                                    {record.itemType}
                                                </span>
                                            </td>
                                            <td>
                                                {getOfficeName(
                                                    record.headOfficeId,
                                                    "HeadOffice"
                                                )}
                                            </td>
                                            <td>
                                                {getOfficeName(
                                                    record.branchId,
                                                    "BranchOffice"
                                                )}
                                            </td>
                                            <td>
                                                <span className="font-medium">
                                                    {record.quantity || 0}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="font-medium text-green-600">
                                                    {formatCurrency(
                                                        record.itemAmount
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="font-medium text-blue-600">
                                                    {formatCurrency(
                                                        record.itemAmountTotal
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleViewClick(
                                                                record
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-xs text-green-600 hover:bg-green-50"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(
                                                                record
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                record
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-xs text-red-600 hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateStockRecordComponents
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateStockRecord}
                    officeProfiles={officeProfiles}
                    stockItemSettings={stockItemSettings}
                />
            )}

            {showViewModal && selectedStockRecord && (
                <ViewStockRecordComponents
                    stockRecord={selectedStockRecord}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedStockRecord(null);
                    }}
                    officeProfiles={officeProfiles}
                    stockItemSettings={stockItemSettings}
                />
            )}

            {showEditModal && selectedStockRecord && (
                <EditStockRecordComponents
                    stockRecord={selectedStockRecord}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedStockRecord(null);
                    }}
                    onSuccess={handleEditStockRecord}
                    officeProfiles={officeProfiles}
                    stockItemSettings={stockItemSettings}
                />
            )}

            {showDeleteModal && selectedStockRecord && (
                <DeleteStockRecordComponents
                    stockRecord={selectedStockRecord}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedStockRecord(null);
                    }}
                    onSuccess={handleDeleteStockRecord}
                />
            )}
        </div>
    );
}
