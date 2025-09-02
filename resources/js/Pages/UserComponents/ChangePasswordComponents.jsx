import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function ChangePasswordComponents({ user, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        new_password: "",
        new_password_confirmation: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (!formData.new_password) {
            newErrors.new_password = "New password is required";
        } else if (formData.new_password.length < 8) {
            newErrors.new_password =
                "New password must be at least 8 characters";
        }

        if (formData.new_password !== formData.new_password_confirmation) {
            newErrors.new_password_confirmation = "New passwords do not match";
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
            router.post(`/users/${user.id}/reset-password`, formData, {
                onSuccess: (page) => {
                    if (page.props.flash?.success) {
                        console.log(
                            "Success message:",
                            page.props.flash.success
                        );
                    }
                    onSuccess();
                },
                onError: (errors) => {
                    setErrors(errors);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        } catch (error) {
            console.error("Error resetting password:", error);
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
                            Reset Password
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
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* New Password */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    New Password *
                                </span>
                            </label>
                            <input
                                type="password"
                                name="new_password"
                                value={formData.new_password}
                                onChange={handleInputChange}
                                className={`input input-bordered w-full ${
                                    errors.new_password ? "input-error" : ""
                                }`}
                                placeholder="Enter new password"
                            />
                            {errors.new_password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.new_password}
                                </p>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Confirm New Password *
                                </span>
                            </label>
                            <input
                                type="password"
                                name="new_password_confirmation"
                                value={formData.new_password_confirmation}
                                onChange={handleInputChange}
                                className={`input input-bordered w-full ${
                                    errors.new_password_confirmation
                                        ? "input-error"
                                        : ""
                                }`}
                                placeholder="Confirm new password"
                            />
                            {errors.new_password_confirmation && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.new_password_confirmation}
                                </p>
                            )}
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-blue-50 rounded-lg p-3">
                            <h5 className="text-sm font-medium text-blue-900 mb-2">
                                Password Requirements:
                            </h5>
                            <ul className="text-xs text-blue-800 space-y-1">
                                <li>• At least 8 characters long</li>
                                <li>
                                    • New password and confirmation must match
                                </li>
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
                                        Resetting...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
