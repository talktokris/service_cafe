import React from "react";

export default function ViewMemberModal({ member, onClose }) {
    if (!member) {
        return null;
    }

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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Member Details: {member.first_name}{" "}
                            {member.last_name}
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

                <div className="p-8 space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4 border border-gray-200 rounded-lg bg-gray-50 p-6">
                        <h3 className="text-lg font-medium text-gray-900">
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        First Name
                                    </span>
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {member.first_name || "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Last Name
                                    </span>
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {member.last_name || "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Full Name
                                    </span>
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {member.name || "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Gender</span>
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {member.gender
                                        ? member.gender
                                              .charAt(0)
                                              .toUpperCase() +
                                          member.gender.slice(1)
                                        : "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Country</span>
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {member.country || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {member.email || "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Phone</span>
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {member.phone || "N/A"}
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">
                                    <span className="label-text">Address</span>
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {member.address || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Member Information */}
                    <div className="space-y-4 border border-gray-200 rounded-lg bg-gray-50 p-6">
                        <h3 className="text-lg font-medium text-gray-900">
                            Member Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Referral Code
                                    </span>
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {member.referral_code || "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Member Type
                                    </span>
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    <span
                                        className={`badge ${
                                            member.member_type === "paid_member"
                                                ? "badge-primary"
                                                : "badge-secondary"
                                        }`}
                                    >
                                        {getMemberTypeDisplay(
                                            member.member_type
                                        )}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Role</span>
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {getRoleDisplay(member)}
                                </p>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Status</span>
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    <span
                                        className={`badge ${
                                            member.activeStatus === 1
                                                ? "badge-success"
                                                : "badge-warning"
                                        }`}
                                    >
                                        {member.activeStatus === 1
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="space-y-4 border border-gray-200 rounded-lg bg-gray-50 p-6">
                        <h3 className="text-lg font-medium text-gray-900">
                            Account Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        User Type
                                    </span>
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    <span className="badge badge-info">
                                        {member.user_type
                                            ?.charAt(0)
                                            .toUpperCase() +
                                            member.user_type?.slice(1) || "N/A"}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Created At
                                    </span>
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {member.created_at
                                        ? new Date(
                                              member.created_at
                                          ).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Last Updated
                                    </span>
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {member.updated_at
                                        ? new Date(
                                              member.updated_at
                                          ).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Actions */}
                <div className="p-6 border-t border-gray-200">
                    <div className="flex justify-end">
                        <button onClick={onClose} className="btn btn-primary">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
