import React, { useState } from "react";

export default function AddMenuItemComponents({
    table,
    user,
    order,
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

        if (!selectedMenuItem || !user || !order) {
            console.error("Missing required data:", {
                selectedMenuItem,
                user,
                order,
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Calculate tax amount using govTaxPercentage from menu item
            const govTaxPercentage = selectedMenuItem.govTaxPercentage || 0;
            const taxAmount =
                Math.round(
                    (govTaxPercentage / 100) *
                        selectedMenuItem.sellingPrice *
                        quantity *
                        100
                ) / 100;
            const subTotalAmount =
                Math.round(
                    (selectedMenuItem.sellingPrice * quantity + taxAmount) * 100
                ) / 100;

            // Prepare order item data
            const orderItemData = {
                headOfficeId: user.headOfficeId,
                branchId: user.branchId,
                createUserId: user.id,
                tableId: table.id,
                orderId: order.id,
                menuId: selectedMenuItem.id,
                buyingPrice: selectedMenuItem.buyingPrice,
                sellingPrice: selectedMenuItem.sellingPrice,
                adminProfitAmount: selectedMenuItem.adminProfitAmount,
                adminNetProfitAmount: selectedMenuItem.adminProfitAmount,
                userCommissionAmount: selectedMenuItem.userCommissionAmount,
                quantity: quantity,
                taxAmount: taxAmount,
                subTotalAmount: subTotalAmount,
            };

            console.log("Submitting order item:", orderItemData);

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

            const response = await fetch("/order-items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                    Accept: "application/json",
                },
                credentials: "same-origin",
                body: JSON.stringify(orderItemData),
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Response result:", result);

            if (result.success) {
                // Call success callback
                onSuccess({
                    tableId: table.id,
                    menuItemId: selectedMenuItem.id,
                    quantity: quantity,
                    total: subTotalAmount,
                    taxAmount: taxAmount,
                    orderItem: result.orderItem,
                });

                // Reset form
                setSelectedMenuItem(null);
                setQuantity(1);
                setSearchTerm("");
            } else {
                console.error("Error adding menu item:", result.message);
                alert(
                    "Error adding menu item: " +
                        (result.message || "Unknown error")
                );
            }
        } catch (error) {
            console.error("Error adding menu item:", error);
            alert("Error adding menu item: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full h-[700px] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
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

                {/* Main Content Area */}
                <div className="flex-1 flex overflow-hidden h-[600px]">
                    {/* Left Side - Menu Items */}
                    <div className="flex-1 p-6 border-r border-gray-200 flex flex-col">
                        {/* Search Filter */}
                        <div className="mb-4 flex-shrink-0">
                            <input
                                type="text"
                                placeholder="Search menu items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input input-bordered w-full"
                            />
                        </div>

                        {/* Scrollable Menu Items Grid */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-3">
                                {filteredMenuItems.length === 0 ? (
                                    <div className="col-span-2 text-center py-8 text-gray-500">
                                        No menu items found
                                    </div>
                                ) : (
                                    filteredMenuItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                                                selectedMenuItem?.id === item.id
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                            onClick={() =>
                                                handleMenuItemSelect(item)
                                            }
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-gray-900 text-sm">
                                                    {item.menuName}
                                                </h3>
                                                <span
                                                    className={`badge badge-sm ${
                                                        item.menuType === "food"
                                                            ? "badge-primary"
                                                            : "badge-secondary"
                                                    }`}
                                                >
                                                    {item.menuType}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mb-2">
                                                {item.tableShortFullName ||
                                                    "Menu item"}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-green-600">
                                                    {formatCurrency(
                                                        item.sellingPrice
                                                    )}
                                                </span>
                                                {item.menuType === "drink" &&
                                                    item.drinkAmount && (
                                                        <span className="text-xs text-gray-500">
                                                            {item.drinkAmount}ml
                                                        </span>
                                                    )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Selected Item Details */}
                    <div className="w-96 p-6 flex flex-col">
                        {selectedMenuItem ? (
                            <>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Selected Item Details
                                </h3>
                                <div className="space-y-4 flex-1">
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
                                        <div className="flex items-center space-x-2 mt-2">
                                            <button
                                                onClick={() =>
                                                    setQuantity(
                                                        Math.max(
                                                            1,
                                                            quantity - 1
                                                        )
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
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <svg
                                        className="w-16 h-16 mx-auto mb-4 text-gray-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                        />
                                    </svg>
                                    <p className="text-lg font-medium text-gray-900 mb-2">
                                        Select a Menu Item
                                    </p>
                                    <p className="text-gray-500">
                                        Click on any menu item from the list to
                                        see details and add to order
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fixed Bottom Actions */}
                <div className="p-6 border-t border-gray-200 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            {selectedMenuItem && (
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">
                                        Selected:
                                    </span>{" "}
                                    {selectedMenuItem.menuName}
                                    <span className="ml-2 font-semibold text-green-600">
                                        {formatCurrency(
                                            selectedMenuItem.sellingPrice *
                                                quantity
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex space-x-3">
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
        </div>
    );
}
