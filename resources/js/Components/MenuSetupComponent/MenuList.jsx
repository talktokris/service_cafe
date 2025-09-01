import React, { useState } from "react";

export default function MenuList({ menus, onEdit, onDelete, onAdd }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredMenus = menus.filter(
        (menu) =>
            menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            menu.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white shadow-sm rounded-lg">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        Menu Items
                    </h3>
                    <button onClick={onAdd} className="btn btn-primary">
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        Add Menu Item
                    </button>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                    />
                </div>

                {/* Menu Items Table */}
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMenus.map((menu) => (
                                <tr key={menu.id}>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            {menu.image && (
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img
                                                            src={menu.image}
                                                            alt={menu.name}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold">
                                                    {menu.name}
                                                </div>
                                                <div className="text-sm opacity-50">
                                                    {menu.description}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-outline">
                                            {menu.category}
                                        </span>
                                    </td>
                                    <td className="font-bold">${menu.price}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                menu.is_available
                                                    ? "badge-success"
                                                    : "badge-error"
                                            }`}
                                        >
                                            {menu.is_available
                                                ? "Available"
                                                : "Unavailable"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onEdit(menu)}
                                                className="btn btn-ghost btn-xs"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    onDelete(menu.id)
                                                }
                                                className="btn btn-ghost btn-xs text-error"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredMenus.length === 0 && (
                    <div className="text-center py-8">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No menu items found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by adding your first menu item.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
