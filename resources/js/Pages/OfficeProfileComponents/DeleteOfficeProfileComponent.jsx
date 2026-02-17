import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function DeleteOfficeProfileComponent({
    profile,
    onClose,
    onSuccess,
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);

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

            router.delete(`/office-profiles/${profile.id}`, {
                onSuccess: (page) => {
                    // Show success message
                    if (page.props.flash?.success) {
                        console.log(page.props.flash.success);
                    }
                    onSuccess(profile.id);
                },
                onError: (errors) => {
                    console.error("Error deleting office profile:", errors);
                },
                onFinish: () => {
                    setIsDeleting(false);
                },
                preserveScroll: true,
            });
        } catch (error) {
            console.error("Error deleting office profile:", error);
            setIsDeleting(false);
        }
    };

    if (!profile) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Delete Office Profile
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                            disabled={isDeleting}
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
                    {/* Warning Icon */}
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                        <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>

                    {/* Confirmation Message */}
                    <div className="text-center mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Are you sure you want to delete this office profile?
                        </h3>
                        <p className="text-sm text-gray-500">
                            This action will mark the profile as deleted. This
                            action cannot be undone.
                        </p>
                    </div>

                    {/* Profile Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-gray-900 mb-3">
                            Profile Details:
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Company:</span>
                                <span className="font-medium">
                                    {profile.companyName || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Type:</span>
                                <span className="font-medium">
                                    <span
                                        className={`badge ${
                                            profile.profileType === "HeadOffice"
                                                ? "badge-primary"
                                                : "badge-secondary"
                                        }`}
                                    >
                                        {profile.profileType}
                                    </span>
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Contact:</span>
                                <span className="font-medium">
                                    {profile.contactFirstName}{" "}
                                    {profile.contactLastName}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Email:</span>
                                <span className="font-medium">
                                    {profile.contactEmail || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="font-medium">
                                    <span
                                        className={`badge ${
                                            profile.activeStatus === 1
                                                ? "badge-success"
                                                : "badge-warning"
                                        }`}
                                    >
                                        {profile.activeStatus === 1
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-outline"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="btn bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <span className="loading loading-spinner loading-sm mr-2"></span>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                    Yes, Delete
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
