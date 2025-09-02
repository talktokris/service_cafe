import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import CreateStockItemSettingsComponent from "./CreateStockItemSettingsComponent";
import EditStockItemSettingsComponent from "./EditStockItemSettingsComponent";
import DeleteStockItemSettingsComponent from "./DeleteStockItemSettingsComponent";

export default function ManageStockItemSettingsComponent({
    user,
    stockItemSettings = [],
    officeProfiles = [],
}) {
    const [stockItems, setStockItems] = useState(stockItemSettings);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStockItem, setSelectedStockItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterHeadOffice, setFilterHeadOffice] = useState("all");
    const [filterBranchOffice, setFilterBranchOffice] = useState("all");
    const [filterItemType, setFilterItemType] = useState("all");

    // Update stock items when stockItemSettings prop changes
    useEffect(() => {
        setStockItems(stockItemSettings);
    }, [stockItemSettings]);

    // Get head offices and branch offices for filters
    const headOffices = officeProfiles.filter(
        (profile) =>
            profile.profileType === "HeadOffice" && profile.deleteStatus === 0
    );
    const branchOffices = officeProfiles.filter(
        (profile) =>
            profile.profileType === "BranchOffice" && profile.deleteStatus === 0
    );

    // Filter stock items based on search and filters
    const filteredStockItems = stockItems.filter((item) => {
        const matchesSearch = item.itemName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesHeadOffice =
            filterHeadOffice === "all" || item.headOfficeId == filterHeadOffice;
        const matchesBranchOffice =
            filterBranchOffice === "all" || item.branchId == filterBranchOffice;
        const matchesItemType =
            filterItemType === "all" || item.itemType === filterItemType;

        return (
            matchesSearch &&
            matchesHeadOffice &&
            matchesBranchOffice &&
            matchesItemType &&
            item.deleteStatus === 0
        );
    });

    // Handle create stock item
    const handleCreateStockItem = (newStockItem) => {
        console.log(
            "New stock item received in handleCreateStockItem:",
            newStockItem
        );
        console.log("Current stock items before update:", stockItems);
        setStockItems((prevItems) => {
            const updatedItems = [...prevItems, newStockItem];
            console.log("Updated stock items:", updatedItems);
            return updatedItems;
        });
        setShowCreateModal(false);
    };

    // Handle edit stock item
    const handleEditStockItem = (updatedStockItem) => {
        setStockItems(
            stockItems.map((item) =>
                item.id === updatedStockItem.id ? updatedStockItem : item
            )
        );
        setShowEditModal(false);
        setSelectedStockItem(null);
    };

    // Handle delete stock item
    const handleDeleteStockItem = (deletedStockItemId) => {
        setStockItems(
            stockItems.map((item) =>
                item.id === deletedStockItemId
                    ? { ...item, deleteStatus: 1 }
                    : item
            )
        );
        setShowDeleteModal(false);
        setSelectedStockItem(null);
    };

    // Handle edit button click
    const handleEditClick = (stockItem) => {
        setSelectedStockItem(stockItem);
        setShowEditModal(true);
    };

    // Handle delete button click
    const handleDeleteClick = (stockItem) => {
        setSelectedStockItem(stockItem);
        setShowDeleteModal(true);
    };

    // Get office name by ID
    const getOfficeName = (officeId, type) => {
        if (!officeId) return "N/A";
        const office = officeProfiles.find((profile) => profile.id == officeId);
        return office ? office.companyName : "Unknown";
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Stock Item Settings Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage stock item settings for head offices and branch
                        offices
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
                    Add New Stock Item
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
                                Total Stock Items
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    stockItems.filter(
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
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Food Items
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    stockItems.filter(
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
                                Drink Items
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    stockItems.filter(
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
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Active Items
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    stockItems.filter(
                                        (i) =>
                                            i.activeStatus === 1 &&
                                            i.deleteStatus === 0
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                        <input
                            type="text"
                            placeholder="Search stock items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div>
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
                        <select
                            value={filterItemType}
                            onChange={(e) => setFilterItemType(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="all">All Types</option>
                            <option value="food">Food</option>
                            <option value="drink">Drink</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stock Items Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Stock Item Settings ({filteredStockItems.length})
                    </h3>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Item Type</th>
                                    <th>Head Office</th>
                                    <th>Branch Office</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStockItems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-8 text-gray-500"
                                        >
                                            No stock item settings found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStockItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="font-bold">
                                                    {item.itemName || "N/A"}
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        item.itemType === "food"
                                                            ? "badge-primary"
                                                            : "badge-secondary"
                                                    }`}
                                                >
                                                    {item.itemType}
                                                </span>
                                            </td>
                                            <td>
                                                {getOfficeName(
                                                    item.headOfficeId,
                                                    "HeadOffice"
                                                )}
                                            </td>
                                            <td>
                                                {getOfficeName(
                                                    item.branchId,
                                                    "BranchOffice"
                                                )}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        item.activeStatus === 1
                                                            ? "badge-success"
                                                            : "badge-warning"
                                                    }`}
                                                >
                                                    {item.activeStatus === 1
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(
                                                                item
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                item
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
                <CreateStockItemSettingsComponent
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateStockItem}
                    officeProfiles={officeProfiles}
                />
            )}

            {showEditModal && selectedStockItem && (
                <EditStockItemSettingsComponent
                    stockItem={selectedStockItem}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedStockItem(null);
                    }}
                    onSuccess={handleEditStockItem}
                    officeProfiles={officeProfiles}
                />
            )}

            {showDeleteModal && selectedStockItem && (
                <DeleteStockItemSettingsComponent
                    stockItem={selectedStockItem}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedStockItem(null);
                    }}
                    onSuccess={handleDeleteStockItem}
                />
            )}
        </div>
    );
}
