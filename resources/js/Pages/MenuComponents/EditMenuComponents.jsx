import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

export default function EditMenuComponents({
    menuItem,
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
        govTaxPercentage: 0,
        govTaxAmount: 0,
        sellingWithTaxPrice: 0,
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

    // Initialize form data when menuItem prop changes
    useEffect(() => {
        if (menuItem) {
            setFormData({
                headOfficeId: menuItem.headOfficeId || "",
                branchId: menuItem.branchId || "",
                menuName: menuItem.menuName || "",
                menuType: menuItem.menuType || "food",
                drinkAmount: menuItem.drinkAmount || 0,
                buyingPrice: menuItem.buyingPrice || 0,
                adminProfitPercentage: menuItem.adminProfitPercentage || 0,
                adminProfitAmount: menuItem.adminProfitAmount || 0,
                userCommissionPercentage:
                    menuItem.userCommissionPercentage || 0,
                userCommissionAmount: menuItem.userCommissionAmount || 0,
                sellingPrice: menuItem.sellingPrice || 0,
                govTaxPercentage: menuItem.govTaxPercentage || "",
                govTaxAmount: menuItem.govTaxAmount || "",
                sellingWithTaxPrice: menuItem.sellingWithTaxPrice || 0,
                activeStatus: menuItem.activeStatus || 0,
            });
        }
    }, [menuItem]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setFormData((prev) => {
            const updatedData = {
                ...prev,
                [name]: newValue,
            };

            // Auto-calculate Admin Profit Percentage and Amount when Buying Price or Selling Price changes
            if (name === "buyingPrice" || name === "sellingPrice") {
                const buyingPrice = parseFloat(updatedData.buyingPrice) || 0;
                const sellingPrice = parseFloat(updatedData.sellingPrice) || 0;

                if (buyingPrice > 0 && sellingPrice > 0) {
                    // Calculate Admin Profit Amount (Selling Price - Buying Price)
                    const adminProfitAmount =
                        Math.round((sellingPrice - buyingPrice) * 100) / 100;
                    updatedData.adminProfitAmount = adminProfitAmount;

                    // Calculate Admin Profit Percentage ((Profit Amount / Buying Price) * 100)
                    const adminProfitPercentage =
                        Math.round(
                            (adminProfitAmount / buyingPrice) * 100 * 100
                        ) / 100;
                    updatedData.adminProfitPercentage = adminProfitPercentage;
                } else {
                    updatedData.adminProfitAmount = 0;
                    updatedData.adminProfitPercentage = 0;
                }

                // Recalculate other fields based on new selling price
                const userCommissionPercentage =
                    parseFloat(prev.userCommissionPercentage) || 0;
                const govTaxPercentage = parseFloat(prev.govTaxPercentage) || 0;

                // Calculate User Commission Amount
                const userCommissionAmount =
                    Math.round(
                        (userCommissionPercentage / 100) * buyingPrice * 100
                    ) / 100;
                updatedData.userCommissionAmount = userCommissionAmount;

                // Calculate Government Tax Amount
                const govTaxAmount =
                    Math.round((govTaxPercentage / 100) * sellingPrice * 100) /
                    100;
                updatedData.govTaxAmount = govTaxAmount;

                // Calculate Selling Price with Tax
                const sellingWithTaxPrice =
                    Math.round((sellingPrice + govTaxAmount) * 100) / 100;
                updatedData.sellingWithTaxPrice = sellingWithTaxPrice;
            }

            // Auto-calculate other fields when User Commission Percentage or Gov Tax Percentage changes
            if (
                name === "userCommissionPercentage" ||
                name === "govTaxPercentage"
            ) {
                const buyingPrice = parseFloat(updatedData.buyingPrice) || 0;
                const sellingPrice = parseFloat(updatedData.sellingPrice) || 0;
                const userCommissionPercentage =
                    parseFloat(updatedData.userCommissionPercentage) || 0;
                const govTaxPercentage =
                    parseFloat(updatedData.govTaxPercentage) || 0;

                // Calculate User Commission Amount
                const userCommissionAmount =
                    Math.round(
                        (userCommissionPercentage / 100) * buyingPrice * 100
                    ) / 100;
                updatedData.userCommissionAmount = userCommissionAmount;

                // Calculate Government Tax Amount
                const govTaxAmount =
                    Math.round((govTaxPercentage / 100) * sellingPrice * 100) /
                    100;
                updatedData.govTaxAmount = govTaxAmount;

                // Calculate Selling Price with Tax
                const sellingWithTaxPrice =
                    Math.round((sellingPrice + govTaxAmount) * 100) / 100;
                updatedData.sellingWithTaxPrice = sellingWithTaxPrice;
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

        if (formData.adminProfitPercentage < 0) {
            newErrors.adminProfitPercentage =
                "Admin profit percentage must be 0 or greater";
        }

        if (formData.userCommissionPercentage < 0) {
            newErrors.userCommissionPercentage =
                "User commission percentage must be 0 or greater";
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
            router.put(`/menu-items/${menuItem.id}`, formData, {
                onSuccess: (page) => {
                    // Show success message
                    if (page.props.flash?.success) {
                        console.log(page.props.flash.success);
                    }
                    // Call the success callback with the updated menu item data
                    if (page.props.menuItem) {
                        onSuccess(page.props.menuItem);
                    } else {
                        // If no menu item data in response, create updated menu item for the callback
                        const updatedMenuItem = {
                            ...menuItem,
                            ...formData,
                            updated_at: new Date().toISOString(),
                        };
                        onSuccess(updatedMenuItem);
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
            console.error("Error updating menu item:", error);
            setIsSubmitting(false);
        }
    };

    if (!menuItem) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Edit Menu Item: {menuItem.menuName}
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
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.sellingPrice ? "input-error" : ""
                                    }`}
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
                                    readOnly
                                    className="input input-bordered w-full bg-gray-100"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Auto-calculated from Buying Price and
                                    Selling Price
                                </p>
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
                                <p className="text-xs text-gray-500 mt-1">
                                    Auto-calculated from Buying Price and
                                    Selling Price
                                </p>
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

                    {/* Government Tax */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Government Tax
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Government Tax Percentage (%)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="govTaxPercentage"
                                    value={formData.govTaxPercentage}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Government Tax Amount (₹)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="govTaxAmount"
                                    value={formData.govTaxAmount}
                                    readOnly
                                    className="input input-bordered w-full bg-gray-100"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Selling Price with Tax (₹)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="sellingWithTaxPrice"
                                    value={formData.sellingWithTaxPrice}
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
                                    Updating...
                                </>
                            ) : (
                                "Update Menu Item"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
