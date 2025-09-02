import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

export default function EditStockRecordComponents({
    stockRecord,
    onClose,
    onSuccess,
    officeProfiles = [],
    stockItemSettings = [],
}) {
    const [formData, setFormData] = useState({
        headOfficeId: "",
        branchId: "",
        stockItemSettingId: "",
        itemType: "food",
        itemAmount: 0,
        itemMassWeightKG: 0,
        itemLiquidWeightML: 0,
        quantity: 0,
        itemAmountTotal: 0,
        itemMassWeightKGTotal: 0,
        itemLiquidWeightMLTotal: 0,
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

    // Initialize form data when stockRecord prop changes
    useEffect(() => {
        if (stockRecord) {
            setFormData({
                headOfficeId: stockRecord.headOfficeId || "",
                branchId: stockRecord.branchId || "",
                stockItemSettingId: stockRecord.stockItemSettingId || "",
                itemType: stockRecord.itemType || "food",
                itemAmount: stockRecord.itemAmount || 0,
                itemMassWeightKG: stockRecord.itemMassWeightKG || 0,
                itemLiquidWeightML: stockRecord.itemLiquidWeightML || 0,
                quantity: stockRecord.quantity || 0,
                itemAmountTotal: stockRecord.itemAmountTotal || 0,
                itemMassWeightKGTotal: stockRecord.itemMassWeightKGTotal || 0,
                itemLiquidWeightMLTotal:
                    stockRecord.itemLiquidWeightMLTotal || 0,
                activeStatus: stockRecord.activeStatus || 0,
            });
        }
    }, [stockRecord]);

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

    // Handle stock item selection change
    const handleStockItemChange = (e) => {
        const stockItemId = e.target.value;
        const selectedStockItem = stockItemSettings.find(
            (item) => item.id == stockItemId
        );

        setFormData((prev) => ({
            ...prev,
            stockItemSettingId: stockItemId,
            itemType: selectedStockItem ? selectedStockItem.itemType : "food",
        }));
    };

    // Calculate totals when quantity or amounts change
    const calculateTotals = () => {
        const quantity = parseFloat(formData.quantity) || 0;
        const itemAmount = parseFloat(formData.itemAmount) || 0;
        const itemMassWeightKG = parseFloat(formData.itemMassWeightKG) || 0;
        const itemLiquidWeightML = parseFloat(formData.itemLiquidWeightML) || 0;

        setFormData((prev) => ({
            ...prev,
            itemAmountTotal: itemAmount * quantity,
            itemMassWeightKGTotal: itemMassWeightKG * quantity,
            itemLiquidWeightMLTotal: itemLiquidWeightML * quantity,
        }));
    };

    // Update totals when relevant fields change
    React.useEffect(() => {
        calculateTotals();
    }, [
        formData.quantity,
        formData.itemAmount,
        formData.itemMassWeightKG,
        formData.itemLiquidWeightML,
    ]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.headOfficeId) {
            newErrors.headOfficeId = "Head Office is required";
        }

        if (!formData.stockItemSettingId) {
            newErrors.stockItemSettingId = "Stock Item is required";
        }

        if (formData.itemAmount < 0) {
            newErrors.itemAmount = "Item amount cannot be negative";
        }

        if (formData.quantity < 0) {
            newErrors.quantity = "Quantity cannot be negative";
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
            router.put(`/stock-records/${stockRecord.id}`, formData, {
                onSuccess: (page) => {
                    // Show success message
                    if (page.props.flash?.success) {
                        console.log(page.props.flash.success);
                    }
                    // Call the success callback with the updated stock record data
                    if (page.props.stockRecord) {
                        onSuccess(page.props.stockRecord);
                    } else {
                        // If no stock record data in response, create updated stock record for the callback
                        const updatedStockRecord = {
                            ...stockRecord,
                            ...formData,
                            updated_at: new Date().toISOString(),
                        };
                        onSuccess(updatedStockRecord);
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
            console.error("Error updating stock record:", error);
            setIsSubmitting(false);
        }
    };

    if (!stockRecord) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Edit Stock Record
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

                    {/* Stock Item Selection */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Stock Item Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Stock Item *
                                    </span>
                                </label>
                                <select
                                    name="stockItemSettingId"
                                    value={formData.stockItemSettingId}
                                    onChange={handleStockItemChange}
                                    className={`select select-bordered w-full ${
                                        errors.stockItemSettingId
                                            ? "select-error"
                                            : ""
                                    }`}
                                >
                                    <option value="">Select Stock Item</option>
                                    {stockItemSettings.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.itemName} ({item.itemType})
                                        </option>
                                    ))}
                                </select>
                                {errors.stockItemSettingId && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.stockItemSettingId}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Item Type
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.itemType}
                                    className="input input-bordered w-full bg-gray-100"
                                    readOnly
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Auto-filled based on selected stock item
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Item Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Item Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Item Amount (Rs)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="itemAmount"
                                    value={formData.itemAmount}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.itemAmount ? "input-error" : ""
                                    }`}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                />
                                {errors.itemAmount && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.itemAmount}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Mass Weight (KG)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="itemMassWeightKG"
                                    value={formData.itemMassWeightKG}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="0"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Liquid Weight (ML)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="itemLiquidWeightML"
                                    value={formData.itemLiquidWeightML}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">Quantity *</span>
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className={`input input-bordered w-full ${
                                    errors.quantity ? "input-error" : ""
                                }`}
                                placeholder="0"
                                min="0"
                            />
                            {errors.quantity && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.quantity}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Calculated Totals */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Calculated Totals
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Total Amount (Rs)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.itemAmountTotal}
                                    className="input input-bordered w-full bg-gray-100"
                                    readOnly
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Total Mass Weight (KG)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.itemMassWeightKGTotal}
                                    className="input input-bordered w-full bg-gray-100"
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Total Liquid Weight (ML)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.itemLiquidWeightMLTotal}
                                    className="input input-bordered w-full bg-gray-100"
                                    readOnly
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
                                "Update Stock Record"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
