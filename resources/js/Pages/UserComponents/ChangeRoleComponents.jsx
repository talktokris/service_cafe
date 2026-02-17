import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function ChangeRoleComponents({
    user,
    onClose,
    onSuccess,
    officeProfiles = [],
}) {
    const [formData, setFormData] = useState({
        role: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get role options based on user's office information
    const getRoleOptions = () => {
        if (user.headOfficeId && user.branchId) {
            return [
                { value: "Branch Admin User", label: "Branch Admin User" },
                { value: "Branch Billing User", label: "Branch Billing User" },
            ];
        } else if (user.headOfficeId) {
            return [
                { value: "Super User", label: "Super User" },
                { value: "Admin User", label: "Admin User" },
                { value: "Account User", label: "Account User" },
                { value: "Billing User", label: "Billing User" },
            ];
        }
        return [];
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.role) {
            newErrors.role = "Role is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Refresh CSRF token before submit to avoid 419 when modal has been open a while
            try {
                const refreshRes = await fetch("/refresh-csrf", {
                    method: "GET",
                    headers: { Accept: "application/json" },
                    credentials: "same-origin",
                });
                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    if (data.csrf_token) {
                        const meta = document.querySelector('meta[name="csrf-token"]');
                        if (meta) meta.setAttribute("content", data.csrf_token);
                        if (window.axios) window.axios.defaults.headers.common["X-CSRF-TOKEN"] = data.csrf_token;
                    }
                }
            } catch (_) {
                // Continue with existing token if refresh fails
            }

            router.post(`/users/${user.id}/change-role`, formData, {
                onSuccess: (page) => {
                    if (page.props.flash?.success) {
                        console.log(
                            "Success message:",
                            page.props.flash.success
                        );
                    }
                    if (page.props.user) {
                        onSuccess(page.props.user);
                    } else {
                        const updatedUser = {
                            ...user,
                            role: formData.role,
                            updated_at: new Date().toISOString(),
                        };
                        onSuccess(updatedUser);
                    }
                },
                onError: (errors) => {
                    setErrors(errors);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        } catch (error) {
            console.error("Error changing role:", error);
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Change Role
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

                <div className="p-6">
                    {/* User Information */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-gray-900 mb-3">
                            User Information:
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Name:</span>
                                <span className="font-medium">
                                    {user.first_name} {user.last_name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Email:</span>
                                <span className="font-medium">
                                    {user.email}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    User Type:
                                </span>
                                <span className="font-medium">
                                    <span
                                        className={`badge ${
                                            user.user_type === "headoffice"
                                                ? "badge-primary"
                                                : "badge-secondary"
                                        }`}
                                    >
                                        {user.user_type === "headoffice"
                                            ? "Head Office"
                                            : user.user_type === "branchOffice"
                                            ? "Branch Office"
                                            : user.user_type}
                                    </span>
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Current Role:
                                </span>
                                <span className="font-medium">
                                    {user.roles && user.roles.length > 0
                                        ? user.roles[0].name
                                        : "No Role"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role Selection */}
                        <div>
                            <label className="label">
                                <span className="label-text">New Role *</span>
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className={`select select-bordered w-full ${
                                    errors.role ? "select-error" : ""
                                }`}
                            >
                                <option value="">Select New Role</option>
                                {getRoleOptions().map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.role}
                                </p>
                            )}
                        </div>

                        {/* Role Information */}
                        <div className="bg-blue-50 rounded-lg p-3">
                            <h5 className="text-sm font-medium text-blue-900 mb-2">
                                Available Roles:
                            </h5>
                            <ul className="text-xs text-blue-800 space-y-1">
                                {user.headOfficeId && user.branchId ? (
                                    <>
                                        <li>
                                            • Branch Admin User - Full access to
                                            branch operations
                                        </li>
                                        <li>
                                            • Branch Billing User - Billing and
                                            payment access
                                        </li>
                                    </>
                                ) : user.headOfficeId ? (
                                    <>
                                        <li>
                                            • Super User - Full system access
                                        </li>
                                        <li>
                                            • Admin User - Administrative access
                                        </li>
                                        <li>
                                            • Account User - Account management
                                            access
                                        </li>
                                        <li>
                                            • Billing User - Billing and payment
                                            access
                                        </li>
                                    </>
                                ) : (
                                    <li>
                                        • No roles available - User must be
                                        assigned to an office
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-ghost"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm mr-2"></span>
                                        Changing...
                                    </>
                                ) : (
                                    "Change Role"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
