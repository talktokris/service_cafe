import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import CreateMenuComponents from "./CreateMenuComponents";
import ViewMenuComponents from "./ViewMenuComponents";
import EditMenuComponents from "./EditMenuComponents";
import DeleteMenuComponents from "./DeleteMenuComponents";

export default function ManageMenuComponents({
    user,
    menuItems = [],
    officeProfiles = [],
}) {
    const [menus, setMenus] = useState(menuItems);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterHeadOffice, setFilterHeadOffice] = useState("all");
    const [filterBranchOffice, setFilterBranchOffice] = useState("all");
    const [filterMenuType, setFilterMenuType] = useState("all");

    // Update menus when menuItems prop changes
    useEffect(() => {
        setMenus(menuItems);
    }, [menuItems]);

    // Get head offices and branch offices for filters
    const headOffices = officeProfiles.filter(
        (profile) =>
            profile.profileType === "HeadOffice" && profile.deleteStatus === 0
    );
    const branchOffices = officeProfiles.filter(
        (profile) =>
            profile.profileType === "BranchOffice" && profile.deleteStatus === 0
    );

    // Filter menu items based on search and filters
    const filteredMenuItems = menus.filter((item) => {
        const matchesSearch = item.menuName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesHeadOffice =
            filterHeadOffice === "all" || item.headOfficeId == filterHeadOffice;
        const matchesBranchOffice =
            filterBranchOffice === "all" || item.branchId == filterBranchOffice;
        const matchesMenuType =
            filterMenuType === "all" || item.menuType === filterMenuType;

        return (
            matchesSearch &&
            matchesHeadOffice &&
            matchesBranchOffice &&
            matchesMenuType &&
            item.deleteStatus === 0
        );
    });

    // Handle create menu item
    const handleCreateMenuItem = (newMenuItem) => {
        console.log(
            "New menu item received in handleCreateMenuItem:",
            newMenuItem
        );
        console.log("Current menus before update:", menus);
        setMenus((prevMenus) => {
            const updatedMenus = [...prevMenus, newMenuItem];
            console.log("Updated menus:", updatedMenus);
            return updatedMenus;
        });
        setShowCreateModal(false);
    };

    // Handle edit menu item
    const handleEditMenuItem = (updatedMenuItem) => {
        setMenus(
            menus.map((item) =>
                item.id === updatedMenuItem.id ? updatedMenuItem : item
            )
        );
        setShowEditModal(false);
        setSelectedMenuItem(null);
    };

    // Handle delete menu item
    const handleDeleteMenuItem = (deletedMenuItemId) => {
        setMenus(
            menus.map((item) =>
                item.id === deletedMenuItemId
                    ? { ...item, deleteStatus: 1 }
                    : item
            )
        );
        setShowDeleteModal(false);
        setSelectedMenuItem(null);
    };

    // Handle view button click
    const handleViewClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
        setShowViewModal(true);
    };

    // Handle edit button click
    const handleEditClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
        setShowEditModal(true);
    };

    // Handle delete button click
    const handleDeleteClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
        setShowDeleteModal(true);
    };

    // Get office name by ID
    const getOfficeName = (officeId, type) => {
        if (!officeId) return "N/A";
        const office = officeProfiles.find((profile) => profile.id == officeId);
        return office ? office.companyName : "Unknown";
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">
                        Menu Items Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage menu items for head offices and branch offices
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
                    Add New Menu Item
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
                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Total Menu Items
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    menus.filter((i) => i.deleteStatus === 0)
                                        .length
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
                                Food Items
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    menus.filter(
                                        (i) =>
                                            i.menuType === "food" &&
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
                                    menus.filter(
                                        (i) =>
                                            i.menuType === "drink" &&
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
                                Active Items
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    menus.filter(
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
                            placeholder="Search menu items..."
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
                            value={filterMenuType}
                            onChange={(e) => setFilterMenuType(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="all">All Types</option>
                            <option value="food">Food</option>
                            <option value="drink">Drink</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Menu Items Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Menu Items ({filteredMenuItems.length})
                    </h3>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Menu Name</th>
                                    <th>Type</th>
                                    <th>Head Office</th>
                                    <th>Branch Office</th>
                                    <th>Buying Price</th>
                                    <th>Selling Price</th>
                                    <th>Gov Tax %</th>
                                    <th>Gov Tax Amount</th>
                                    <th>Price with Tax</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMenuItems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="11"
                                            className="text-center py-8 text-gray-500"
                                        >
                                            No menu items found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMenuItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="font-bold">
                                                    {item.menuName || "N/A"}
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        item.menuType === "food"
                                                            ? "badge-primary"
                                                            : "badge-secondary"
                                                    }`}
                                                >
                                                    {item.menuType}
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
                                                <span className="font-medium text-green-600">
                                                    {formatCurrency(
                                                        item.buyingPrice
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="font-medium text-blue-600">
                                                    {formatCurrency(
                                                        item.sellingPrice
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="font-medium text-orange-600">
                                                    {item.govTaxPercentage || 0}
                                                    %
                                                </span>
                                            </td>
                                            <td>
                                                <span className="font-medium text-purple-600">
                                                    {formatCurrency(
                                                        item.govTaxAmount
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="font-medium text-green-600">
                                                    {formatCurrency(
                                                        item.sellingWithTaxPrice
                                                    )}
                                                </span>
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
                                                            handleViewClick(
                                                                item
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-xs text-green-600 hover:bg-green-50"
                                                    >
                                                        View
                                                    </button>
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
                <CreateMenuComponents
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateMenuItem}
                    officeProfiles={officeProfiles}
                />
            )}

            {showViewModal && selectedMenuItem && (
                <ViewMenuComponents
                    menuItem={selectedMenuItem}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedMenuItem(null);
                    }}
                    officeProfiles={officeProfiles}
                />
            )}

            {showEditModal && selectedMenuItem && (
                <EditMenuComponents
                    menuItem={selectedMenuItem}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedMenuItem(null);
                    }}
                    onSuccess={handleEditMenuItem}
                    officeProfiles={officeProfiles}
                />
            )}

            {showDeleteModal && selectedMenuItem && (
                <DeleteMenuComponents
                    menuItem={selectedMenuItem}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedMenuItem(null);
                    }}
                    onSuccess={handleDeleteMenuItem}
                />
            )}
        </div>
    );
}
