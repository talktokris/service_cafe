import React, { useState } from "react";

export default function AddMenuItemComponents({
    table,
    onClose,
    onSuccess,
    menuItems = [],
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filter menu items based on search term
    const filteredMenuItems = menuItems.filter((item) =>
        item.menuName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    const handleMenuItemSelect = (menuItem) => {
        setSelectedMenuItem(menuItem);
        setQuantity(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedMenuItem) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Mock API call - replace with actual API
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Call success callback
            onSuccess({
                tableId: table.id,
                menuItemId: selectedMenuItem.id,
                quantity: quantity,
                total: selectedMenuItem.sellingPrice * quantity,
            });

            // Reset form
            setSelectedMenuItem(null);
            setQuantity(1);
            setSearchTerm("");
        } catch (error) {
            console.error("Error adding menu item:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Add Menu Item - Table {table.tableShortName}
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
                    {/* Search Filter */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search menu items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered w-full"
                        />
                    </div>

                    {/* Menu Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {filteredMenuItems.length === 0 ? (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                No menu items found
                            </div>
                        ) : (
                            filteredMenuItems.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleMenuItemSelect(item)}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                                        selectedMenuItem?.id === item.id
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-gray-900">
                                            {item.menuName}
                                        </h3>
                                        <span
                                            className={`badge ${
                                                item.menuType === "food"
                                                    ? "badge-primary"
                                                    : "badge-secondary"
                                            }`}
                                        >
                                            {item.menuType}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {item.tableShortFullName || "Menu item"}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-green-600">
                                            {formatCurrency(item.sellingPrice)}
                                        </span>
                                        {item.menuType === "drink" &&
                                            item.drinkAmount && (
                                                <span className="text-sm text-gray-500">
                                                    {item.drinkAmount}ml
                                                </span>
                                            )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Selected Item Details */}
                    {selectedMenuItem && (
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Selected Item Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Menu Item
                                    </label>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {selectedMenuItem.menuName}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Price
                                    </label>
                                    <p className="text-lg font-semibold text-green-600">
                                        {formatCurrency(
                                            selectedMenuItem.sellingPrice
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Quantity
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1)
                                                )
                                            }
                                            className="btn btn-sm btn-outline"
                                        >
                                            -
                                        </button>
                                        <span className="text-lg font-semibold px-4">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setQuantity(quantity + 1)
                                            }
                                            className="btn btn-sm btn-outline"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Total Amount
                                    </label>
                                    <p className="text-lg font-semibold text-blue-600">
                                        {formatCurrency(
                                            selectedMenuItem.sellingPrice *
                                                quantity
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

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
                            onClick={handleSubmit}
                            className="btn btn-primary"
                            disabled={!selectedMenuItem || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading loading-spinner loading-sm mr-2"></span>
                                    Adding...
                                </>
                            ) : (
                                "Add to Order"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
