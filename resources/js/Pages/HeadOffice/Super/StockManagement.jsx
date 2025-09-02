import React from "react";
import { Head, Link } from "@inertiajs/react";
import { AdminDashboardLayout } from "../AdminComponents";

export default function StockManagement({ user }) {
    return (
        <AdminDashboardLayout title="Stock Management - Serve Cafe" user={user}>
            <Head title="Stock Management" />

            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Stock Management
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
                                            Stock Management
                                        </span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <Link
                        href="/stock-management/add"
                        className="btn bg-blue-600 hover:bg-blue-700 text-white"
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
                        Add Stock
                    </Link>
                </div>
            </div>

            {/* Stock Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Total Items
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                156
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                In Stock
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                142
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-yellow-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Low Stock
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                8
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-red-600"
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
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">
                                Out of Stock
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                6
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stock Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Coffee Beans
                        </h3>
                        <span className="badge badge-primary">24 items</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        Premium coffee beans and blends
                    </p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>In Stock:</span>
                            <span className="font-medium">22</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Low Stock:</span>
                            <span className="font-medium text-yellow-600">
                                2
                            </span>
                        </div>
                    </div>
                    <Link
                        href="/stock/coffee-beans"
                        className="btn btn-outline btn-sm mt-4 w-full"
                    >
                        View Items
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Dairy Products
                        </h3>
                        <span className="badge badge-secondary">18 items</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        Milk, cream, and dairy products
                    </p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>In Stock:</span>
                            <span className="font-medium">15</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Low Stock:</span>
                            <span className="font-medium text-yellow-600">
                                3
                            </span>
                        </div>
                    </div>
                    <Link
                        href="/stock/dairy"
                        className="btn btn-outline btn-sm mt-4 w-full"
                    >
                        View Items
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Bakery Items
                        </h3>
                        <span className="badge badge-accent">12 items</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        Bread, pastries, and baked goods
                    </p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>In Stock:</span>
                            <span className="font-medium">10</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Low Stock:</span>
                            <span className="font-medium text-yellow-600">
                                2
                            </span>
                        </div>
                    </div>
                    <Link
                        href="/stock/bakery"
                        className="btn btn-outline btn-sm mt-4 w-full"
                    >
                        View Items
                    </Link>
                </div>
            </div>

            {/* Stock Items Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Stock Items
                        </h3>
                        <div className="flex space-x-2">
                            <select className="select select-bordered select-sm">
                                <option>All Categories</option>
                                <option>Coffee Beans</option>
                                <option>Dairy Products</option>
                                <option>Bakery Items</option>
                                <option>Beverages</option>
                            </select>
                            <select className="select select-bordered select-sm">
                                <option>All Status</option>
                                <option>In Stock</option>
                                <option>Low Stock</option>
                                <option>Out of Stock</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Search items..."
                                className="input input-bordered input-sm w-64"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Category</th>
                                    <th>Current Stock</th>
                                    <th>Min. Stock</th>
                                    <th>Unit Price</th>
                                    <th>Status</th>
                                    <th>Last Updated</th>
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
                                                        src="/assets/coffee-beans.jpg"
                                                        alt="Coffee Beans"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">
                                                    Premium Arabica
                                                </div>
                                                <div className="text-sm opacity-50">
                                                    SKU: CB-001
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Coffee Beans</td>
                                    <td>25 kg</td>
                                    <td>10 kg</td>
                                    <td>₹450/kg</td>
                                    <td>
                                        <span className="badge badge-success">
                                            In Stock
                                        </span>
                                    </td>
                                    <td>2024-01-15</td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <button className="btn btn-ghost btn-xs">
                                                Edit
                                            </button>
                                            <button className="btn btn-ghost btn-xs">
                                                Update Stock
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
                                                        src="/assets/milk.jpg"
                                                        alt="Milk"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">
                                                    Fresh Milk
                                                </div>
                                                <div className="text-sm opacity-50">
                                                    SKU: DP-001
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Dairy Products</td>
                                    <td>5 liters</td>
                                    <td>10 liters</td>
                                    <td>₹60/liter</td>
                                    <td>
                                        <span className="badge badge-warning">
                                            Low Stock
                                        </span>
                                    </td>
                                    <td>2024-01-15</td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <button className="btn btn-ghost btn-xs">
                                                Edit
                                            </button>
                                            <button className="btn btn-ghost btn-xs">
                                                Update Stock
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
                                                        src="/assets/croissant.jpg"
                                                        alt="Croissant"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">
                                                    Butter Croissant
                                                </div>
                                                <div className="text-sm opacity-50">
                                                    SKU: BK-001
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Bakery Items</td>
                                    <td>0 pieces</td>
                                    <td>20 pieces</td>
                                    <td>₹35/piece</td>
                                    <td>
                                        <span className="badge badge-error">
                                            Out of Stock
                                        </span>
                                    </td>
                                    <td>2024-01-14</td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <button className="btn btn-ghost btn-xs">
                                                Edit
                                            </button>
                                            <button className="btn btn-ghost btn-xs">
                                                Update Stock
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
