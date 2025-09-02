import React from "react";
import { Head, Link } from "@inertiajs/react";
import { AdminDashboardLayout } from "../AdminComponents";

export default function MenuManagement({ user }) {
    return (
        <AdminDashboardLayout title="Menu Management - Serve Cafe" user={user}>
            <Head title="Menu Management" />

            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Menu Management
                        </h1>
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                <li className="inline-flex items-center">
                                    <Link
                                        href="/dashboard"
                                        className="text-gray-700 hover:text-red-600"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <svg
                                            className="w-6 h-6 text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span className="ml-1 text-gray-500 md:ml-2">
                                            Menu Management
                                        </span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <Link
                        href="/menu/create"
                        className="btn bg-red-600 hover:bg-red-700 text-white"
                    >
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
                        Add New Item
                    </Link>
                </div>
            </div>

            {/* Menu Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Beverages
                        </h3>
                        <span className="badge badge-primary">24 items</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        Coffee, Tea, Juices, and other drinks
                    </p>
                    <Link
                        href="/menu/beverages"
                        className="btn btn-outline btn-sm"
                    >
                        View Items
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Food Items
                        </h3>
                        <span className="badge badge-secondary">18 items</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        Sandwiches, Pastries, and main dishes
                    </p>
                    <Link href="/menu/food" className="btn btn-outline btn-sm">
                        View Items
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Snacks
                        </h3>
                        <span className="badge badge-accent">12 items</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        Light snacks and appetizers
                    </p>
                    <Link
                        href="/menu/snacks"
                        className="btn btn-outline btn-sm"
                    >
                        View Items
                    </Link>
                </div>
            </div>

            {/* Recent Menu Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Recent Menu Items
                    </h3>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img
                                                        src="/assets/coffee.jpg"
                                                        alt="Coffee"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">
                                                    Cappuccino
                                                </div>
                                                <div className="text-sm opacity-50">
                                                    Premium coffee
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Beverages</td>
                                    <td>₹120</td>
                                    <td>
                                        <span className="badge badge-success">
                                            Available
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <button className="btn btn-ghost btn-xs">
                                                Edit
                                            </button>
                                            <button className="btn btn-ghost btn-xs text-error">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img
                                                        src="/assets/sandwich.jpg"
                                                        alt="Sandwich"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">
                                                    Chicken Sandwich
                                                </div>
                                                <div className="text-sm opacity-50">
                                                    Fresh ingredients
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Food Items</td>
                                    <td>₹180</td>
                                    <td>
                                        <span className="badge badge-success">
                                            Available
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <button className="btn btn-ghost btn-xs">
                                                Edit
                                            </button>
                                            <button className="btn btn-ghost btn-xs text-error">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
