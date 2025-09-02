import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import CreateUserControlComponents from "./CreateUserControlComponents";
import ViewUserControlComponents from "./ViewUserControlComponents";
import EditUserControlComponents from "./EditUserControlComponents";
import DeleteUserControlComponents from "./DeleteUserControlComponents";
import ChangePasswordComponents from "./ChangePasswordComponents";
import ChangeRoleComponents from "./ChangeRoleComponents";

export default function ManageUserControlComponents({
    user,
    users = [],
    officeProfiles = [],
}) {
    const [usersData, setUsersData] = useState(users);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] =
        useState(false);
    const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Filter states
    const [filterHeadOffice, setFilterHeadOffice] = useState("all");
    const [filterBranchOffice, setFilterBranchOffice] = useState("all");
    const [filteredData, setFilteredData] = useState(users);

    // Update users when users prop changes
    useEffect(() => {
        setUsersData(users);
        setFilteredData(users);
    }, [users]);

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
        const filtered = usersData.filter((user) => {
            const matchesHeadOffice =
                filterHeadOffice === "all" ||
                user.headOfficeId == filterHeadOffice;
            const matchesBranchOffice =
                filterBranchOffice === "all" ||
                user.branchId == filterBranchOffice;

            return (
                matchesHeadOffice &&
                matchesBranchOffice &&
                user.deleteStatus === 0 &&
                user.user_type !== "member"
            );
        });
        setFilteredData(filtered);
    };

    // Reset filters
    const resetFilters = () => {
        setFilterHeadOffice("all");
        setFilterBranchOffice("all");
        setFilteredData(
            usersData.filter(
                (user) => user.deleteStatus === 0 && user.user_type !== "member"
            )
        );
    };

    // Handle create user
    const handleCreateUser = (newUser) => {
        console.log("New user received in handleCreateUser:", newUser);
        setUsersData((prevUsers) => {
            const updatedUsers = [...prevUsers, newUser];
            console.log("Updated users data:", updatedUsers);
            return updatedUsers;
        });

        // Also update filtered data immediately
        setFilteredData((prevFiltered) => {
            const newFiltered = [...prevFiltered, newUser];
            console.log("Updated filtered data:", newFiltered);
            return newFiltered;
        });

        setShowCreateModal(false);
    };

    // Handle edit user
    const handleEditUser = (updatedUser) => {
        setUsersData((prevUsers) => {
            const updatedUsers = prevUsers.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
            );
            console.log("Updated users data after edit:", updatedUsers);
            return updatedUsers;
        });

        // Also update filtered data immediately
        setFilteredData((prevFiltered) => {
            const updatedFiltered = prevFiltered.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
            );
            console.log("Updated filtered data after edit:", updatedFiltered);
            return updatedFiltered;
        });

        setShowEditModal(false);
        setSelectedUser(null);
    };

    // Handle delete user
    const handleDeleteUser = (deletedUserId) => {
        setUsersData((prevUsers) => {
            const updatedUsers = prevUsers.map((user) =>
                user.id === deletedUserId ? { ...user, deleteStatus: 1 } : user
            );
            console.log("Updated users data after delete:", updatedUsers);
            return updatedUsers;
        });

        // Also update filtered data immediately
        setFilteredData((prevFiltered) => {
            const updatedFiltered = prevFiltered.map((user) =>
                user.id === deletedUserId ? { ...user, deleteStatus: 1 } : user
            );
            console.log("Updated filtered data after delete:", updatedFiltered);
            return updatedFiltered;
        });

        setShowDeleteModal(false);
        setSelectedUser(null);
    };

    // Handle change password
    const handleChangePassword = () => {
        setShowChangePasswordModal(false);
        setSelectedUser(null);
    };

    // Handle change role
    const handleChangeRole = (updatedUser) => {
        setUsersData((prevUsers) => {
            const updatedUsers = prevUsers.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
            );
            console.log("Updated users data after role change:", updatedUsers);
            return updatedUsers;
        });

        // Also update filtered data immediately
        setFilteredData((prevFiltered) => {
            const updatedFiltered = prevFiltered.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
            );
            console.log(
                "Updated filtered data after role change:",
                updatedFiltered
            );
            return updatedFiltered;
        });

        setShowChangeRoleModal(false);
        setSelectedUser(null);
    };

    // Handle view button click
    const handleViewClick = (user) => {
        setSelectedUser(user);
        setShowViewModal(true);
    };

    // Handle edit button click
    const handleEditClick = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    // Handle delete button click
    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    // Handle change password button click
    const handleChangePasswordClick = (user) => {
        setSelectedUser(user);
        setShowChangePasswordModal(true);
    };

    // Handle change role button click
    const handleChangeRoleClick = (user) => {
        setSelectedUser(user);
        setShowChangeRoleModal(true);
    };

    // Get office name by ID
    const getOfficeName = (officeId, type) => {
        if (!officeId) return "N/A";
        const office = officeProfiles.find((profile) => profile.id == officeId);
        return office ? office.companyName : "Unknown";
    };

    // Get user type display name
    const getUserTypeDisplay = (userType) => {
        const typeMap = {
            headoffice: "Head Office",
            branchOffice: "Branch Office",
            member: "Member",
        };
        return typeMap[userType] || userType;
    };

    // Get role display name
    const getRoleDisplay = (user) => {
        if (user.roles && user.roles.length > 0) {
            return user.roles[0].name;
        }
        return "No Role";
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        User Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage users for head offices and branch offices
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
                    Add New User
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
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Total Users
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    usersData.filter(
                                        (u) =>
                                            u.deleteStatus === 0 &&
                                            u.user_type !== "member"
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
                                Active Users
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    usersData.filter(
                                        (u) =>
                                            u.activeStatus === 1 &&
                                            u.deleteStatus === 0 &&
                                            u.user_type !== "member"
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
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Head Office Users
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    usersData.filter(
                                        (u) =>
                                            u.user_type === "headoffice" &&
                                            u.deleteStatus === 0
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
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Branch Office Users
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    usersData.filter(
                                        (u) =>
                                            u.user_type === "branchOffice" &&
                                            u.deleteStatus === 0
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Users ({filteredData.length})
                    </h3>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>User Type</th>
                                    <th>Role</th>
                                    <th>Head Office</th>
                                    <th>Branch Office</th>
                                    <th>Status</th>
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
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((user) => (
                                        <tr key={user.id}>
                                            <td>
                                                <div className="font-bold">
                                                    {user.first_name}{" "}
                                                    {user.last_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {user.name}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="font-medium">
                                                    {user.email}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        user.user_type ===
                                                        "headoffice"
                                                            ? "badge-primary"
                                                            : "badge-secondary"
                                                    }`}
                                                >
                                                    {getUserTypeDisplay(
                                                        user.user_type
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="font-medium">
                                                    {getRoleDisplay(user)}
                                                </span>
                                            </td>
                                            <td>
                                                {getOfficeName(
                                                    user.headOfficeId,
                                                    "HeadOffice"
                                                )}
                                            </td>
                                            <td>
                                                {getOfficeName(
                                                    user.branchId,
                                                    "BranchOffice"
                                                )}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        user.activeStatus === 1
                                                            ? "badge-success"
                                                            : "badge-warning"
                                                    }`}
                                                >
                                                    {user.activeStatus === 1
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex flex-wrap gap-1">
                                                    <button
                                                        onClick={() =>
                                                            handleViewClick(
                                                                user
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-xs text-green-600 hover:bg-green-50"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(
                                                                user
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleChangePasswordClick(
                                                                user
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-xs text-purple-600 hover:bg-purple-50"
                                                    >
                                                        Password
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleChangeRoleClick(
                                                                user
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-xs text-orange-600 hover:bg-orange-50"
                                                    >
                                                        Role
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                user
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
                <CreateUserControlComponents
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateUser}
                    officeProfiles={officeProfiles}
                />
            )}

            {showViewModal && selectedUser && (
                <ViewUserControlComponents
                    user={selectedUser}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedUser(null);
                    }}
                    officeProfiles={officeProfiles}
                />
            )}

            {showEditModal && selectedUser && (
                <EditUserControlComponents
                    user={selectedUser}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedUser(null);
                    }}
                    onSuccess={handleEditUser}
                    officeProfiles={officeProfiles}
                />
            )}

            {showDeleteModal && selectedUser && (
                <DeleteUserControlComponents
                    user={selectedUser}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedUser(null);
                    }}
                    onSuccess={handleDeleteUser}
                />
            )}

            {showChangePasswordModal && selectedUser && (
                <ChangePasswordComponents
                    user={selectedUser}
                    onClose={() => {
                        setShowChangePasswordModal(false);
                        setSelectedUser(null);
                    }}
                    onSuccess={handleChangePassword}
                />
            )}

            {showChangeRoleModal && selectedUser && (
                <ChangeRoleComponents
                    user={selectedUser}
                    onClose={() => {
                        setShowChangeRoleModal(false);
                        setSelectedUser(null);
                    }}
                    onSuccess={handleChangeRole}
                    officeProfiles={officeProfiles}
                />
            )}
        </div>
    );
}
