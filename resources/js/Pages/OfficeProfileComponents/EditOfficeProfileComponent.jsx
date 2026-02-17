import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

export default function EditOfficeProfileComponent({
    profile,
    onClose,
    onSuccess,
}) {
    const [formData, setFormData] = useState({
        companyName: "",
        profileType: "BranchOffice",
        regNo: "",
        address: "",
        phoneNo: "",
        contactFirstName: "",
        contactLastName: "",
        contactEmail: "",
        contactMobileNo: "",
        activeStatus: 1,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form data when profile prop changes
    useEffect(() => {
        if (profile) {
            setFormData({
                companyName: profile.companyName || "",
                profileType: profile.profileType || "BranchOffice",
                regNo: profile.regNo || "",
                address: profile.address || "",
                phoneNo: profile.phoneNo || "",
                contactFirstName: profile.contactFirstName || "",
                contactLastName: profile.contactLastName || "",
                contactEmail: profile.contactEmail || "",
                contactMobileNo: profile.contactMobileNo || "",
                activeStatus: profile.activeStatus || 0,
            });
        }
    }, [profile]);

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

        if (!formData.companyName.trim()) {
            newErrors.companyName = "Company name is required";
        }

        if (!formData.contactFirstName.trim()) {
            newErrors.contactFirstName = "Contact first name is required";
        }

        if (!formData.contactLastName.trim()) {
            newErrors.contactLastName = "Contact last name is required";
        }

        if (
            formData.contactEmail &&
            !/\S+@\S+\.\S+/.test(formData.contactEmail)
        ) {
            newErrors.contactEmail = "Please enter a valid email address";
        }

        if (
            formData.contactMobileNo &&
            !/^[0-9+\-\s()]+$/.test(formData.contactMobileNo)
        ) {
            newErrors.contactMobileNo = "Please enter a valid mobile number";
        }

        if (formData.phoneNo && !/^[0-9+\-\s()]+$/.test(formData.phoneNo)) {
            newErrors.phoneNo = "Please enter a valid phone number";
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

            router.put(`/office-profiles/${profile.id}`, formData, {
                onSuccess: (page) => {
                    // Show success message
                    if (page.props.flash?.success) {
                        console.log(page.props.flash.success);
                    }
                    // Call the success callback with the updated profile data
                    if (page.props.officeProfile) {
                        onSuccess(page.props.officeProfile);
                    } else {
                        // If no profile data in response, create updated profile for the callback
                        const updatedProfile = {
                            ...profile,
                            ...formData,
                            updated_at: new Date().toISOString(),
                        };
                        onSuccess(updatedProfile);
                    }
                },
                onError: (errors) => {
                    setErrors(errors);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
                preserveScroll: true,
            });
        } catch (error) {
            console.error("Error updating office profile:", error);
            setIsSubmitting(false);
        }
    };

    if (!profile) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Edit Office Profile
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
                    {/* Company Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Company Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.companyName ? "input-error" : ""
                                    }`}
                                    placeholder="Enter company name"
                                />
                                {errors.companyName && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.companyName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Profile Type
                                </label>
                                <select
                                    name="profileType"
                                    value={formData.profileType}
                                    onChange={handleInputChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="BranchOffice">
                                        Branch Office
                                    </option>
                                    <option value="HeadOffice">
                                        Head Office
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Registration Number
                                </label>
                                <input
                                    type="text"
                                    name="regNo"
                                    value={formData.regNo}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="Enter registration number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    name="phoneNo"
                                    value={formData.phoneNo}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.phoneNo ? "input-error" : ""
                                    }`}
                                    placeholder="Enter phone number"
                                />
                                {errors.phoneNo && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.phoneNo}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows="3"
                                className="textarea textarea-bordered w-full"
                                placeholder="Enter company address"
                            />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Contact Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    name="contactFirstName"
                                    value={formData.contactFirstName}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.contactFirstName
                                            ? "input-error"
                                            : ""
                                    }`}
                                    placeholder="Enter first name"
                                />
                                {errors.contactFirstName && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.contactFirstName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    name="contactLastName"
                                    value={formData.contactLastName}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.contactLastName
                                            ? "input-error"
                                            : ""
                                    }`}
                                    placeholder="Enter last name"
                                />
                                {errors.contactLastName && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.contactLastName}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.contactEmail ? "input-error" : ""
                                    }`}
                                    placeholder="Enter email address"
                                />
                                {errors.contactEmail && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.contactEmail}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mobile Number
                                </label>
                                <input
                                    type="text"
                                    name="contactMobileNo"
                                    value={formData.contactMobileNo}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.contactMobileNo
                                            ? "input-error"
                                            : ""
                                    }`}
                                    placeholder="Enter mobile number"
                                />
                                {errors.contactMobileNo && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.contactMobileNo}
                                    </p>
                                )}
                            </div>
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
                            <label className="text-sm font-medium text-gray-700">
                                Active Profile
                            </label>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-outline"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading loading-spinner loading-sm mr-2"></span>
                                    Updating...
                                </>
                            ) : (
                                "Update Profile"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
