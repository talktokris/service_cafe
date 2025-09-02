import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import CreateRestaurantTableComponent from "./CreateRestaurantTableComponent";
import EditRestaurantTableComponent from "./EditRestaurantTableComponent";
import DeleteRestaurantTableComponent from "./DeleteRestaurantTableComponent";

export default function ManageRestaurantTableComponent({
    user,
    restaurantTables = [],
    officeProfiles = [],
}) {
    const [tables, setTables] = useState(restaurantTables);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterHeadOffice, setFilterHeadOffice] = useState("all");
    const [filterBranchOffice, setFilterBranchOffice] = useState("all");

    // Update tables when restaurantTables prop changes
    useEffect(() => {
        setTables(restaurantTables);
    }, [restaurantTables]);

    // Get head offices and branch offices for filters
    const headOffices = officeProfiles.filter(
        (profile) =>
            profile.profileType === "HeadOffice" && profile.deleteStatus === 0
    );
    const branchOffices = officeProfiles.filter(
        (profile) =>
            profile.profileType === "BranchOffice" && profile.deleteStatus === 0
    );

    // Filter tables based on search and filters
    const filteredTables = tables.filter((table) => {
        const matchesSearch =
            table.tableShortName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            table.tableShortFullName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesHeadOffice =
            filterHeadOffice === "all" ||
            table.headOfficeId == filterHeadOffice;
        const matchesBranchOffice =
            filterBranchOffice === "all" ||
            table.branchId == filterBranchOffice;

        return (
            matchesSearch &&
            matchesHeadOffice &&
            matchesBranchOffice &&
            table.deleteStatus === 0
        );
    });

    // Handle create table
    const handleCreateTable = (newTable) => {
        console.log("New table received in handleCreateTable:", newTable);
        console.log("Current tables before update:", tables);
        setTables((prevTables) => {
            const updatedTables = [...prevTables, newTable];
            console.log("Updated tables:", updatedTables);
            return updatedTables;
        });
        setShowCreateModal(false);
    };

    // Handle edit table
    const handleEditTable = (updatedTable) => {
        setTables(
            tables.map((table) =>
                table.id === updatedTable.id ? updatedTable : table
            )
        );
        setShowEditModal(false);
        setSelectedTable(null);
    };

    // Handle delete table
    const handleDeleteTable = (deletedTableId) => {
        setTables(
            tables.map((table) =>
                table.id === deletedTableId
                    ? { ...table, deleteStatus: 1 }
                    : table
            )
        );
        setShowDeleteModal(false);
        setSelectedTable(null);
    };

    // Handle edit button click
    const handleEditClick = (table) => {
        setSelectedTable(table);
        setShowEditModal(true);
    };

    // Handle delete button click
    const handleDeleteClick = (table) => {
        setSelectedTable(table);
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
                        Restaurant Table Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage restaurant tables for head offices and branch
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
                    Add New Table
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
                                {
                                    tables.filter((t) => t.deleteStatus === 0)
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
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Head Office Tables
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    tables.filter(
                                        (t) =>
                                            t.headOfficeId &&
                                            t.deleteStatus === 0
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
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Branch Office Tables
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    tables.filter(
                                        (t) =>
                                            t.branchId && t.deleteStatus === 0
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
                                Active Tables
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    tables.filter(
                                        (t) =>
                                            t.activeStatus === 1 &&
                                            t.deleteStatus === 0
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <input
                            type="text"
                            placeholder="Search tables..."
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
                </div>
            </div>

            {/* Tables Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Restaurant Tables ({filteredTables.length})
                    </h3>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Table Name</th>
                                    <th>Full Name</th>
                                    <th>Head Office</th>
                                    <th>Branch Office</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTables.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-8 text-gray-500"
                                        >
                                            No restaurant tables found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTables.map((table) => (
                                        <tr key={table.id}>
                                            <td>
                                                <div className="font-bold">
                                                    {table.tableShortName ||
                                                        "N/A"}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-medium">
                                                    {table.tableShortFullName ||
                                                        "N/A"}
                                                </div>
                                            </td>
                                            <td>
                                                {getOfficeName(
                                                    table.headOfficeId,
                                                    "HeadOffice"
                                                )}
                                            </td>
                                            <td>
                                                {getOfficeName(
                                                    table.branchId,
                                                    "BranchOffice"
                                                )}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        table.activeStatus === 1
                                                            ? "badge-success"
                                                            : "badge-warning"
                                                    }`}
                                                >
                                                    {table.activeStatus === 1
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(
                                                                table
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                table
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
                <CreateRestaurantTableComponent
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateTable}
                    officeProfiles={officeProfiles}
                />
            )}

            {showEditModal && selectedTable && (
                <EditRestaurantTableComponent
                    table={selectedTable}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedTable(null);
                    }}
                    onSuccess={handleEditTable}
                    officeProfiles={officeProfiles}
                />
            )}

            {showDeleteModal && selectedTable && (
                <DeleteRestaurantTableComponent
                    table={selectedTable}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedTable(null);
                    }}
                    onSuccess={handleDeleteTable}
                />
            )}
        </div>
    );
}
