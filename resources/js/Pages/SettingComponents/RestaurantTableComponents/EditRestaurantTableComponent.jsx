import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

export default function EditRestaurantTableComponent({
    table,
    onClose,
    onSuccess,
    officeProfiles = [],
}) {
    const [formData, setFormData] = useState({
        headOfficeId: "",
        branchId: "",
        tableShortName: "",
        tableShortFullName: "",
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

    // Initialize form data when table prop changes
    useEffect(() => {
        if (table) {
            setFormData({
                headOfficeId: table.headOfficeId || "",
                branchId: table.branchId || "",
                tableShortName: table.tableShortName || "",
                tableShortFullName: table.tableShortFullName || "",
                activeStatus: table.activeStatus || 0,
            });
        }
    }, [table]);

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

        if (!formData.tableShortName) {
            newErrors.tableShortName = "Table short name is required";
        } else if (formData.tableShortName.length > 20) {
            newErrors.tableShortName =
                "Table short name must be 20 characters or less";
        }

        if (!formData.tableShortFullName) {
            newErrors.tableShortFullName = "Table full name is required";
        } else if (formData.tableShortFullName.length > 150) {
            newErrors.tableShortFullName =
                "Table full name must be 150 characters or less";
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
            router.put(`/restaurant-tables/${table.id}`, formData, {
                onSuccess: (page) => {
                    // Show success message
                    if (page.props.flash?.success) {
                        console.log(page.props.flash.success);
                    }
                    // Call the success callback with the updated table data
                    if (page.props.restaurantTable) {
                        onSuccess(page.props.restaurantTable);
                    } else {
                        // If no table data in response, create updated table for the callback
                        const updatedTable = {
                            ...table,
                            ...formData,
                            updated_at: new Date().toISOString(),
                        };
                        onSuccess(updatedTable);
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
            console.error("Error updating restaurant table:", error);
            setIsSubmitting(false);
        }
    };

    if (!table) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Edit Restaurant Table: {table.tableShortName}
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

                    {/* Table Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Table Information
                        </h3>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Table Short Name *
                                </span>
                            </label>
                            <input
                                type="text"
                                name="tableShortName"
                                value={formData.tableShortName}
                                onChange={handleInputChange}
                                className={`input input-bordered w-full ${
                                    errors.tableShortName ? "input-error" : ""
                                }`}
                                placeholder="e.g., T1, T2, VIP1"
                                maxLength="20"
                            />
                            {errors.tableShortName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.tableShortName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Table Full Name *
                                </span>
                            </label>
                            <input
                                type="text"
                                name="tableShortFullName"
                                value={formData.tableShortFullName}
                                onChange={handleInputChange}
                                className={`input input-bordered w-full ${
                                    errors.tableShortFullName
                                        ? "input-error"
                                        : ""
                                }`}
                                placeholder="e.g., Table 1, Table 2, VIP Table 1"
                                maxLength="150"
                            />
                            {errors.tableShortFullName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.tableShortFullName}
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
                                    Updating...
                                </>
                            ) : (
                                "Update Table"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
