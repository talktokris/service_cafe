import React, { useState, useEffect } from "react";

export default function MenuForm({ menu, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        is_available: true,
        image: null,
    });

    useEffect(() => {
        if (menu) {
            setFormData({
                name: menu.name || "",
                description: menu.description || "",
                price: menu.price || "",
                category: menu.category || "",
                is_available:
                    menu.is_available !== undefined ? menu.is_available : true,
                image: menu.image || null,
            });
        }
    }, [menu]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData((prev) => ({
                    ...prev,
                    image: e.target.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-white shadow-sm rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                    {menu ? "Edit Menu Item" : "Add New Menu Item"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Menu Item Name *
                                </span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input input-bordered"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Category *</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="select select-bordered"
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="appetizers">Appetizers</option>
                                <option value="main-course">Main Course</option>
                                <option value="desserts">Desserts</option>
                                <option value="beverages">Beverages</option>
                                <option value="salads">Salads</option>
                                <option value="soups">Soups</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="textarea textarea-bordered"
                            rows="3"
                            placeholder="Describe the menu item..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Price *</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    $
                                </span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="input input-bordered pl-8"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Availability</span>
                            </label>
                            <div className="flex items-center space-x-4">
                                <label className="cursor-pointer label">
                                    <input
                                        type="checkbox"
                                        name="is_available"
                                        checked={formData.is_available}
                                        onChange={handleChange}
                                        className="checkbox checkbox-primary"
                                    />
                                    <span className="label-text ml-2">
                                        Available for order
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Menu Item Image</span>
                        </label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="file-input file-input-bordered w-full max-w-xs"
                            />
                            {formData.image && (
                                <div className="avatar">
                                    <div className="w-16 h-16 rounded-lg">
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {menu ? "Update Menu Item" : "Add Menu Item"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
