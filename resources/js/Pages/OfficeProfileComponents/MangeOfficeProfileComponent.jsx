import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { AdminDashboardLayout } from "../HeadOffice/AdminComponents";
import CreateOfficeProfileComponent from "./CreateOfficeProfileComponent";
import EditOfficeProfileComponent from "./EditOfficeProfileComponent";
import DeleteOfficeProfileComponent from "./DeleteOfficeProfileComponent";

export default function MangeOfficeProfileComponent({
    user,
    officeProfiles = [],
}) {
    const [profiles, setProfiles] = useState(officeProfiles);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");

    // Update profiles when officeProfiles prop changes
    useEffect(() => {
        setProfiles(officeProfiles);
    }, [officeProfiles]);

    // Filter profiles based on search and type
    const filteredProfiles = profiles.filter((profile) => {
        const matchesSearch =
            profile.companyName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            profile.contactFirstName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            profile.contactLastName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            profile.contactEmail
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesType =
            filterType === "all" || profile.profileType === filterType;

        return matchesSearch && matchesType && profile.deleteStatus === 0;
    });

    // Handle create profile
    const handleCreateProfile = (newProfile) => {
        setProfiles((prevProfiles) => [...prevProfiles, newProfile]);
        setShowCreateModal(false);
    };

    // Handle edit profile
    const handleEditProfile = (updatedProfile) => {
        setProfiles(
            profiles.map((profile) =>
                profile.id === updatedProfile.id ? updatedProfile : profile
            )
        );
        setShowEditModal(false);
        setSelectedProfile(null);
    };

    // Handle delete profile
    const handleDeleteProfile = (deletedProfileId) => {
        setProfiles(
            profiles.map((profile) =>
                profile.id === deletedProfileId
                    ? { ...profile, deleteStatus: 1 }
                    : profile
            )
        );
        setShowDeleteModal(false);
        setSelectedProfile(null);
    };

    // Handle edit button click
    const handleEditClick = (profile) => {
        setSelectedProfile(profile);
        setShowEditModal(true);
    };

    // Handle delete button click
    const handleDeleteClick = (profile) => {
        setSelectedProfile(profile);
        setShowDeleteModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Office Profile Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage head offices and branch offices
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
                    Add New Profile
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
                                Total Profiles
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    profiles.filter((p) => p.deleteStatus === 0)
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
                                Head Offices
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    profiles.filter(
                                        (p) =>
                                            p.profileType === "HeadOffice" &&
                                            p.deleteStatus === 0
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
                                Branch Offices
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    profiles.filter(
                                        (p) =>
                                            p.profileType === "BranchOffice" &&
                                            p.deleteStatus === 0
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
                                Active Profiles
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    profiles.filter(
                                        (p) =>
                                            p.activeStatus === 1 &&
                                            p.deleteStatus === 0
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search profiles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="sm:w-48">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="all">All Types</option>
                            <option value="HeadOffice">Head Office</option>
                            <option value="BranchOffice">Branch Office</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Profiles Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Office Profiles ({filteredProfiles.length})
                    </h3>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Type</th>
                                    <th>Contact Person</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProfiles.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-8 text-gray-500"
                                        >
                                            No office profiles found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProfiles.map((profile) => (
                                        <tr key={profile.id}>
                                            <td>
                                                <div>
                                                    <div className="font-bold">
                                                        {profile.companyName ||
                                                            "N/A"}
                                                    </div>
                                                    <div className="text-sm opacity-50">
                                                        {profile.regNo ||
                                                            "No Registration"}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        profile.profileType ===
                                                        "HeadOffice"
                                                            ? "badge-primary"
                                                            : "badge-secondary"
                                                    }`}
                                                >
                                                    {profile.profileType}
                                                </span>
                                            </td>
                                            <td>
                                                <div>
                                                    <div className="font-medium">
                                                        {
                                                            profile.contactFirstName
                                                        }{" "}
                                                        {
                                                            profile.contactLastName
                                                        }
                                                    </div>
                                                    <div className="text-sm opacity-50">
                                                        {profile.contactMobileNo ||
                                                            "No Mobile"}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {profile.contactEmail || "N/A"}
                                            </td>
                                            <td>{profile.phoneNo || "N/A"}</td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        profile.activeStatus ===
                                                        1
                                                            ? "badge-success"
                                                            : "badge-warning"
                                                    }`}
                                                >
                                                    {profile.activeStatus === 1
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(
                                                                profile
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                profile
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
                <CreateOfficeProfileComponent
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateProfile}
                />
            )}

            {showEditModal && selectedProfile && (
                <EditOfficeProfileComponent
                    profile={selectedProfile}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedProfile(null);
                    }}
                    onSuccess={handleEditProfile}
                />
            )}

            {showDeleteModal && selectedProfile && (
                <DeleteOfficeProfileComponent
                    profile={selectedProfile}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedProfile(null);
                    }}
                    onSuccess={handleDeleteProfile}
                />
            )}
        </div>
    );
}
