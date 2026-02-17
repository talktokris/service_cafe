import React, { useState } from "react";
import { usePage } from "@inertiajs/react";

export default function EditMenuItemComponents({
    menuItem,
    onClose,
    onSuccess,
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [quantity, setQuantity] = useState(menuItem.quantity || 1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !menuItem.id) {
            alert("User session or menu item not found");
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

            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content") || "";

            // Calculate tax amount using govTaxPercentage from menu item
            const govTaxPercentage = menuItem.menuItem?.govTaxPercentage || 0;
            const taxAmount =
                Math.round(
                    (govTaxPercentage / 100) *
                        menuItem.sellingPrice *
                        quantity *
                        100
                ) / 100;
            const subTotalAmount =
                Math.round(
                    (menuItem.sellingPrice * quantity + taxAmount) * 100
                ) / 100;

            const updateData = {
                quantity: quantity,
                subTotalAmount: subTotalAmount,
                taxAmount: taxAmount,
            };

            const response = await fetch(`/order-items/${menuItem.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                },
                credentials: "same-origin",
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                const result = await response.json();
                onSuccess({
                    ...menuItem,
                    quantity: quantity,
                    subTotalAmount: subTotalAmount,
                    taxAmount: taxAmount,
                });
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to update menu item");
            }
        } catch (error) {
            console.error("Error updating menu item:", error);
            alert("An error occurred while updating the menu item");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Edit Menu Item
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

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Menu Item Details */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Menu Item Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Menu Item
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {menuItem.menuItem?.menuName ||
                                        "Unknown Item"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Price
                                </label>
                                <p className="text-lg font-semibold text-green-600">
                                    {formatCurrency(menuItem.sellingPrice)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Current Quantity
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {menuItem.quantity}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Current Total
                                </label>
                                <p className="text-lg font-semibold text-blue-600">
                                    {formatCurrency(
                                        menuItem.subTotalAmount ||
                                            menuItem.sellingPrice *
                                                menuItem.quantity
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quantity Update */}
                    <div className="mb-6">
                        <label className="text-sm font-medium text-gray-500 mb-2 block">
                            Update Quantity
                        </label>
                        <div className="flex items-center space-x-4">
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity(Math.max(1, quantity - 1))
                                }
                                className="btn btn-outline btn-lg"
                            >
                                -
                            </button>
                            <div className="text-center">
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(
                                            parseInt(e.target.value) || 1
                                        )
                                    }
                                    className="input input-bordered text-center text-2xl font-bold w-24"
                                    min="1"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setQuantity(quantity + 1)}
                                className="btn btn-outline btn-lg"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* New Total */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">
                                    Subtotal:
                                </span>
                                <span className="text-lg font-semibold text-gray-700">
                                    {formatCurrency(
                                        menuItem.sellingPrice * quantity
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">
                                    Tax (
                                    {menuItem.menuItem?.govTaxPercentage || 0}
                                    %):
                                </span>
                                <span className="text-lg font-semibold text-orange-600">
                                    {formatCurrency(
                                        ((menuItem.menuItem?.govTaxPercentage ||
                                            0) /
                                            100) *
                                            menuItem.sellingPrice *
                                            quantity
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                                <span className="text-lg font-medium text-gray-700">
                                    New Total:
                                </span>
                                <span className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(
                                        menuItem.sellingPrice * quantity +
                                            ((menuItem.menuItem
                                                ?.govTaxPercentage || 0) /
                                                100) *
                                                menuItem.sellingPrice *
                                                quantity
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3">
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
                                "Update Item"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
