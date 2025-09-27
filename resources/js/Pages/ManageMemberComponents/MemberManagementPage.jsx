import React, { useState, useEffect } from "react";
import ViewMemberModal from "./ViewMemberModal";
import EditMemberModal from "./EditMemberModal";
import ResetPasswordModal from "./ResetPasswordModal";

export default function ManageMemberComponents({ user, members = [] }) {
    const [membersData, setMembersData] = useState(members);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    // Filter states
    const [searchName, setSearchName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchReferralCode, setSearchReferralCode] = useState("");
    const [filteredData, setFilteredData] = useState(members);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Update members when members prop changes
    useEffect(() => {
        setMembersData(members);
        setFilteredData(members);
    }, [members]);

    // Apply filters
    const applyFilters = () => {
        const filtered = membersData.filter((member) => {
            const matchesName =
                !searchName ||
                member.name?.toLowerCase().includes(searchName.toLowerCase()) ||
                member.first_name
                    ?.toLowerCase()
                    .includes(searchName.toLowerCase()) ||
                member.last_name
                    ?.toLowerCase()
                    .includes(searchName.toLowerCase());

            const matchesEmail =
                !searchEmail ||
                member.email?.toLowerCase().includes(searchEmail.toLowerCase());

            const matchesReferralCode =
                !searchReferralCode ||
                member.referral_code
                    ?.toLowerCase()
                    .includes(searchReferralCode.toLowerCase());

            return (
                matchesName &&
                matchesEmail &&
                matchesReferralCode &&
                member.deleteStatus === 0 &&
                member.user_type === "member"
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    };

    // Reset filters
    const resetFilters = () => {
        setSearchName("");
        setSearchEmail("");
        setSearchReferralCode("");
        setFilteredData(
            membersData.filter(
                (member) =>
                    member.deleteStatus === 0 && member.user_type === "member"
            )
        );
        setCurrentPage(1);
    };

    // Handle edit member
    const handleEditMember = (updatedMember) => {
        setMembersData((prevMembers) => {
            const updatedMembers = prevMembers.map((member) =>
                member.id === updatedMember.id ? updatedMember : member
            );
            return updatedMembers;
        });

        // Also update filtered data immediately
        setFilteredData((prevFiltered) => {
            const updatedFiltered = prevFiltered.map((member) =>
                member.id === updatedMember.id ? updatedMember : member
            );
            return updatedFiltered;
        });

        setShowEditModal(false);
        setSelectedMember(null);
    };

    // Handle reset password
    const handleResetPassword = () => {
        setShowResetPasswordModal(false);
        setSelectedMember(null);
    };

    // Handle view button click
    const handleViewClick = (member) => {
        setSelectedMember(member);
        setShowViewModal(true);
    };

    // Handle edit button click
    const handleEditClick = (member) => {
        setSelectedMember(member);
        setShowEditModal(true);
    };

    // Handle reset password button click
    const handleResetPasswordClick = (member) => {
        setSelectedMember(member);
        setShowResetPasswordModal(true);
    };

    // Handle view transactions button click
    const handleViewTransactionsClick = (member) => {
        const encodedUserId = btoa(member.id.toString());
        window.location.href = `/member-transactions/${encodedUserId}`;
    };

    // Get member type display name
    const getMemberTypeDisplay = (memberType) => {
        const typeMap = {
            paid_member: "Paid Member",
            free_member: "Free Member",
        };
        return typeMap[memberType] || memberType;
    };

    // Get role display name
    const getRoleDisplay = (member) => {
        if (member.roles && member.roles.length > 0) {
            return member.roles[0].name;
        }
        return "No Role";
    };

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Pagination handlers
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div>
            {/* Main Content */}
            <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Total Members
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {
                                        membersData.filter(
                                            (m) =>
                                                m.deleteStatus === 0 &&
                                                m.user_type === "member"
                                        ).length
                                    }
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
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
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Active Members
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {
                                        membersData.filter(
                                            (m) =>
                                                m.activeStatus === 1 &&
                                                m.deleteStatus === 0 &&
                                                m.user_type === "member"
                                        ).length
                                    }
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
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
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Paid Members
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {
                                        membersData.filter(
                                            (m) =>
                                                m.member_type ===
                                                    "paid_member" &&
                                                m.deleteStatus === 0 &&
                                                m.user_type === "member"
                                        ).length
                                    }
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
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
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Free Members
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {
                                        membersData.filter(
                                            (m) =>
                                                m.member_type ===
                                                    "free_member" &&
                                                m.deleteStatus === 0 &&
                                                m.user_type === "member"
                                        ).length
                                    }
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-orange-600"
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
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Search by Name
                                </span>
                            </label>
                            <input
                                type="text"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                className="input input-bordered w-full"
                                placeholder="Enter name..."
                            />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Search by Email
                                </span>
                            </label>
                            <input
                                type="text"
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                                className="input input-bordered w-full"
                                placeholder="Enter email..."
                            />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Search by Referral Code
                                </span>
                            </label>
                            <input
                                type="text"
                                value={searchReferralCode}
                                onChange={(e) =>
                                    setSearchReferralCode(e.target.value)
                                }
                                className="input input-bordered w-full"
                                placeholder="Enter referral code..."
                            />
                        </div>
                        <div className="flex items-end space-x-2">
                            <button
                                onClick={applyFilters}
                                className="btn bg-amber-800 hover:bg-amber-900 text-white border-amber-800 hover:border-amber-900"
                            >
                                Filter
                            </button>
                            <button
                                onClick={resetFilters}
                                className="btn btn-outline border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Members Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Members ({filteredData.length})
                        </h3>
                    </div>
                    <div className="p-8">
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Gender</th>
                                        <th>Country</th>
                                        <th>Referral Code</th>
                                        <th>Member Type</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="9"
                                                className="text-center py-8 text-gray-500"
                                            >
                                                No members found
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((member) => (
                                            <tr key={member.id}>
                                                <td>
                                                    <div className="font-bold">
                                                        {member.first_name}{" "}
                                                        {member.last_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {member.name}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="font-medium">
                                                        {member.email}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="font-medium">
                                                        {member.gender
                                                            ? member.gender
                                                                  .charAt(0)
                                                                  .toUpperCase() +
                                                              member.gender.slice(
                                                                  1
                                                              )
                                                            : "N/A"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="font-medium">
                                                        {member.country ||
                                                            "N/A"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="font-medium">
                                                        {member.referral_code ||
                                                            "N/A"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            member.member_type ===
                                                            "paid_member"
                                                                ? "badge-primary"
                                                                : "badge-secondary"
                                                        }`}
                                                    >
                                                        {getMemberTypeDisplay(
                                                            member.member_type
                                                        )}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="font-medium">
                                                        {getRoleDisplay(member)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            member.activeStatus ===
                                                            1
                                                                ? "badge-success"
                                                                : "badge-warning"
                                                        }`}
                                                    >
                                                        {member.activeStatus ===
                                                        1
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex flex-wrap gap-1">
                                                        <button
                                                            onClick={() =>
                                                                handleViewClick(
                                                                    member
                                                                )
                                                            }
                                                            className="btn btn-ghost btn-xs text-amber-700 hover:bg-amber-50"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleEditClick(
                                                                    member
                                                                )
                                                            }
                                                            className="btn btn-ghost btn-xs text-amber-700 hover:bg-amber-50"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleResetPasswordClick(
                                                                    member
                                                                )
                                                            }
                                                            className="btn btn-ghost btn-xs text-amber-700 hover:bg-amber-50"
                                                        >
                                                            Reset Password
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleViewTransactionsClick(
                                                                    member
                                                                )
                                                            }
                                                            className="btn btn-ghost btn-xs text-blue-700 hover:bg-blue-50"
                                                        >
                                                            View Transactions
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <div className="text-sm text-gray-700">
                                    Showing {indexOfFirstItem + 1} to{" "}
                                    {Math.min(
                                        indexOfLastItem,
                                        filteredData.length
                                    )}{" "}
                                    of {filteredData.length} results
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        className="btn btn-sm btn-outline border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    ).map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            onClick={() =>
                                                handlePageChange(pageNumber)
                                            }
                                            className={`btn btn-sm ${
                                                currentPage === pageNumber
                                                    ? "bg-amber-800 hover:bg-amber-900 text-white border-amber-800 hover:border-amber-900"
                                                    : "btn-outline border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white"
                                            }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className="btn btn-sm btn-outline border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modals */}
                {showViewModal && selectedMember && (
                    <ViewMemberModal
                        member={selectedMember}
                        onClose={() => {
                            setShowViewModal(false);
                            setSelectedMember(null);
                        }}
                    />
                )}

                {showEditModal && selectedMember && (
                    <EditMemberModal
                        member={selectedMember}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedMember(null);
                        }}
                        onSuccess={handleEditMember}
                    />
                )}

                {showResetPasswordModal && selectedMember && (
                    <ResetPasswordModal
                        member={selectedMember}
                        onClose={() => {
                            setShowResetPasswordModal(false);
                            setSelectedMember(null);
                        }}
                        onSuccess={handleResetPassword}
                    />
                )}
            </div>
        </div>
    );
}
