import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function CreateStockItemSettingsComponent({
    onClose,
    onSuccess,
    officeProfiles = [],
}) {
    const [formData, setFormData] = useState({
        headOfficeId: "",
        branchId: "",
        itemName: "",
        itemType: "food",
        activeStatus: 1,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get head offices and branch offices
    const headOffices = officeProfiles.filter(
        (profile) =>
            profile.profileType === "HeadOffice" && profile.deleteStatus === 0
    );
    const branchOffices = officeProfiles.filter(
        (profile) =>
            profile.profileType === "BranchOffice" && profile.deleteStatus === 0
    );

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
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

        if (!formData.headOfficeId) {
            newErrors.headOfficeId = "Head Office is required";
        }

        if (!formData.itemName) {
            newErrors.itemName = "Item name is required";
        }

        if (!formData.itemType) {
            newErrors.itemType = "Item type is required";
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

            router.post("/stock-item-settings", formData, {
                onSuccess: (page) => {
                    // Show success message
                    if (page.props.flash?.success) {
                        console.log(
                            "Success message:",
                            page.props.flash.success
                        );
                    }
                    console.log("Page props received:", page.props);
                    // Call the success callback with the new stock item data
                    if (page.props.stockItemSetting) {
                        console.log(
                            "Using stockItemSetting from page props:",
                            page.props.stockItemSetting
                        );
                        onSuccess(page.props.stockItemSetting);
                    } else {
                        // If no stock item data in response, create a mock stock item for the callback
                        const newStockItem = {
                            id: Date.now(), // Temporary ID
                            ...formData,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        };
                        console.log("Using mock stock item:", newStockItem);
                        onSuccess(newStockItem);
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
            console.error("Error creating stock item setting:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Create New Stock Item Setting
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

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Office Selection */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Office Selection
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Head Office *
                                    </span>
                                </label>
                                <select
                                    name="headOfficeId"
                                    value={formData.headOfficeId}
                                    onChange={handleInputChange}
                                    className={`select select-bordered w-full ${
                                        errors.headOfficeId
                                            ? "select-error"
                                            : ""
                                    }`}
                                >
                                    <option value="">Select Head Office</option>
                                    {headOffices.map((office) => (
                                        <option
                                            key={office.id}
                                            value={office.id}
                                        >
                                            {office.companyName}
                                        </option>
                                    ))}
                                </select>
                                {errors.headOfficeId && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.headOfficeId}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Branch Office
                                    </span>
                                </label>
                                <select
                                    name="branchId"
                                    value={formData.branchId}
                                    onChange={handleInputChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">
                                        Select Branch Office (Optional)
                                    </option>
                                    {branchOffices.map((office) => (
                                        <option
                                            key={office.id}
                                            value={office.id}
                                        >
                                            {office.companyName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Item Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Item Information
                        </h3>

                        <div>
                            <label className="label">
                                <span className="label-text">Item Name *</span>
                            </label>
                            <input
                                type="text"
                                name="itemName"
                                value={formData.itemName}
                                onChange={handleInputChange}
                                className={`input input-bordered w-full ${
                                    errors.itemName ? "input-error" : ""
                                }`}
                                placeholder="e.g., Rice, Coffee, Sugar"
                            />
                            {errors.itemName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.itemName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">Item Type *</span>
                            </label>
                            <select
                                name="itemType"
                                value={formData.itemType}
                                onChange={handleInputChange}
                                className={`select select-bordered w-full ${
                                    errors.itemType ? "select-error" : ""
                                }`}
                            >
                                <option value="food">Food</option>
                                <option value="drink">Drink</option>
                            </select>
                            {errors.itemType && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.itemType}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Status
                        </h3>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="activeStatus"
                                checked={formData.activeStatus === 1}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        activeStatus: e.target.checked ? 1 : 0,
                                    }))
                                }
                                className="checkbox checkbox-primary mr-3"
                            />
                            <span className="text-sm text-gray-700">
                                Active Status
                            </span>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
                                    Creating...
                                </>
                            ) : (
                                "Create Stock Item"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
