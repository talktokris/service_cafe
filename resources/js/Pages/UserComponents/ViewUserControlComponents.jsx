import React from "react";

export default function ViewUserControlComponents({
    user,
    onClose,
    officeProfiles = [],
}) {
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

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!user) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            User Details: {user.first_name} {user.last_name}
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

                <div className="p-6 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    First Name
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user.first_name || "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Last Name
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user.last_name || "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Full Name
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user.name || "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Gender
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user.gender
                                        ? user.gender.charAt(0).toUpperCase() +
                                          user.gender.slice(1)
                                        : "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Country
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user.country || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Email
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user.email || "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Phone
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user.phone || "N/A"}
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-500">
                                    Address
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user.address || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Office Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Office Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    User Type
                                </label>
                                <p className="mt-1">
                                    <span
                                        className={`badge ${
                                            user.user_type === "headoffice"
                                                ? "badge-primary"
                                                : "badge-secondary"
                                        }`}
                                    >
                                        {getUserTypeDisplay(user.user_type)}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Role
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {getRoleDisplay(user)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Head Office
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {getOfficeName(
                                        user.headOfficeId,
                                        "HeadOffice"
                                    )}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Branch Office
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {getOfficeName(
                                        user.branchId,
                                        "BranchOffice"
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Status Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Status
                                </label>
                                <p className="mt-1">
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
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Member Type
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user.member_type || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Timestamps
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Created At
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {formatDate(user.created_at)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Updated At
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {formatDate(user.updated_at)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end pt-6 border-t border-gray-200">
                        <button onClick={onClose} className="btn btn-primary">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
