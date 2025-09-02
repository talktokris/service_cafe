import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function CreateMenuComponents({
    onClose,
    onSuccess,
    officeProfiles = [],
}) {
    const [formData, setFormData] = useState({
        headOfficeId: "",
        branchId: "",
        menuName: "",
        menuType: "food",
        drinkAmount: 0,
        buyingPrice: 0,
        adminProfitPercentage: 0,
        adminProfitAmount: 0,
        userCommissionPercentage: 0,
        userCommissionAmount: 0,
        sellingPrice: 0,
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
        const newValue = type === "checkbox" ? checked : value;

        setFormData((prev) => {
            const updatedData = {
                ...prev,
                [name]: newValue,
            };

            // Auto-calculate all fields when Buying Price, Admin Profit Percentage, or User Commission Percentage changes
            if (
                name === "buyingPrice" ||
                name === "adminProfitPercentage" ||
                name === "userCommissionPercentage"
            ) {
                const buyingPrice =
                    name === "buyingPrice"
                        ? parseFloat(newValue) || 0
                        : parseFloat(prev.buyingPrice) || 0;
                const adminProfitPercentage =
                    name === "adminProfitPercentage"
                        ? parseFloat(newValue) || 0
                        : parseFloat(prev.adminProfitPercentage) || 0;
                const userCommissionPercentage =
                    name === "userCommissionPercentage"
                        ? parseFloat(newValue) || 0
                        : parseFloat(prev.userCommissionPercentage) || 0;

                // Calculate Admin Profit Amount
                const adminProfitAmount =
                    Math.round(
                        (adminProfitPercentage / 100) * buyingPrice * 100
                    ) / 100;
                updatedData.adminProfitAmount = adminProfitAmount;

                // Calculate Selling Price
                const sellingPrice =
                    Math.round((buyingPrice + adminProfitAmount) * 100) / 100;
                updatedData.sellingPrice = sellingPrice;

                // Calculate User Commission Amount
                const userCommissionAmount =
                    Math.round(
                        (userCommissionPercentage / 100) * buyingPrice * 100
                    ) / 100;
                updatedData.userCommissionAmount = userCommissionAmount;
            }

            return updatedData;
        });

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

        if (!formData.menuName) {
            newErrors.menuName = "Menu name is required";
        }

        if (!formData.menuType) {
            newErrors.menuType = "Menu type is required";
        }

        if (formData.buyingPrice < 0) {
            newErrors.buyingPrice = "Buying price cannot be negative";
        }

        if (formData.sellingPrice < 0) {
            newErrors.sellingPrice = "Selling price cannot be negative";
        }

        if (
            formData.adminProfitPercentage < 0 ||
            formData.adminProfitPercentage > 100
        ) {
            newErrors.adminProfitPercentage =
                "Admin profit percentage must be between 0 and 100";
        }

        if (
            formData.userCommissionPercentage < 0 ||
            formData.userCommissionPercentage > 100
        ) {
            newErrors.userCommissionPercentage =
                "User commission percentage must be between 0 and 100";
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
            router.post("/menu-items", formData, {
                onSuccess: (page) => {
                    // Show success message
                    if (page.props.flash?.success) {
                        console.log(
                            "Success message:",
                            page.props.flash.success
                        );
                    }
                    console.log("Page props received:", page.props);
                    // Call the success callback with the new menu item data
                    if (page.props.menuItem) {
                        console.log(
                            "Using menuItem from page props:",
                            page.props.menuItem
                        );
                        onSuccess(page.props.menuItem);
                    } else {
                        // If no menu item data in response, create a mock menu item for the callback
                        const newMenuItem = {
                            id: Date.now(), // Temporary ID
                            ...formData,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        };
                        console.log("Using mock menu item:", newMenuItem);
                        onSuccess(newMenuItem);
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
            console.error("Error creating menu item:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Create New Menu Item
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

                    {/* Menu Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Menu Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Menu Name *
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="menuName"
                                    value={formData.menuName}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.menuName ? "input-error" : ""
                                    }`}
                                    placeholder="e.g., Chicken Burger, Coffee"
                                />
                                {errors.menuName && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.menuName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Menu Type *
                                    </span>
                                </label>
                                <select
                                    name="menuType"
                                    value={formData.menuType}
                                    onChange={handleInputChange}
                                    className={`select select-bordered w-full ${
                                        errors.menuType ? "select-error" : ""
                                    }`}
                                >
                                    <option value="food">Food</option>
                                    <option value="drink">Drink</option>
                                </select>
                                {errors.menuType && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.menuType}
                                    </p>
                                )}
                            </div>
                        </div>

                        {formData.menuType === "drink" && (
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Drink Amount (ml)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="drinkAmount"
                                    value={formData.drinkAmount}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="e.g., 250"
                                    step="0.01"
                                />
                            </div>
                        )}
                    </div>

                    {/* Pricing Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Pricing Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Buying Price (₹)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="buyingPrice"
                                    value={formData.buyingPrice}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.buyingPrice ? "input-error" : ""
                                    }`}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                />
                                {errors.buyingPrice && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.buyingPrice}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Selling Price (₹)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="sellingPrice"
                                    value={formData.sellingPrice}
                                    readOnly
                                    className="input input-bordered w-full bg-gray-100"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                />
                                {errors.sellingPrice && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.sellingPrice}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profit & Commission */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Profit & Commission
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Admin Profit Percentage (%)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="adminProfitPercentage"
                                    value={formData.adminProfitPercentage}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.adminProfitPercentage
                                            ? "input-error"
                                            : ""
                                    }`}
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                />
                                {errors.adminProfitPercentage && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.adminProfitPercentage}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Admin Profit Amount (₹)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="adminProfitAmount"
                                    value={formData.adminProfitAmount}
                                    readOnly
                                    className="input input-bordered w-full bg-gray-100"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        User Commission Percentage (%)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="userCommissionPercentage"
                                    value={formData.userCommissionPercentage}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.userCommissionPercentage
                                            ? "input-error"
                                            : ""
                                    }`}
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                />
                                {errors.userCommissionPercentage && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.userCommissionPercentage}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        User Commission Amount (₹)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="userCommissionAmount"
                                    value={formData.userCommissionAmount}
                                    readOnly
                                    className="input input-bordered w-full bg-gray-100"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                />
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
                                "Create Menu Item"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
