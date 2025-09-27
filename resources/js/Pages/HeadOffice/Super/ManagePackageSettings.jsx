import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { AdminDashboardLayout } from "../AdminComponents";
import AddPackageComponent from "../../ManagePackageComponent/AddPackageComponent";
import EditPackageComponent from "../../ManagePackageComponent/EditPackageComponent";
import DeletePackageComponent from "../../ManagePackageComponent/DeletePackageComponent";
import DeletePackageConfirmation from "../../ManagePackageComponent/DeletePackageConfirmation";
import LatestActivePackageCard from "../../ManagePackageComponent/LatestActivePackageCard";

export default function ManagePackageSettings({ auth, packages = [] }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Filter packages based on search and status
    const filteredPackages = packages.filter((pkg) => {
        const matchesSearch = pkg.package_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && pkg.status === 1) ||
            (statusFilter === "inactive" && pkg.status === 0);

        return matchesSearch && matchesStatus;
    });

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPackages.slice(
        indexOfFirstItem,
        indexOfLastItem
    );
    const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

    // Handle add package
    const handleAddPackage = () => {
        setSelectedPackage(null);
        setShowAddModal(true);
    };

    // Handle edit package
    const handleEditPackage = (pkg) => {
        setSelectedPackage(pkg);
        setShowEditModal(true);
    };

    // Handle delete package
    const handleDeletePackage = (pkg) => {
        setSelectedPackage(pkg);
        setShowDeleteModal(true);
    };

    // Handle delete confirmation
    const handleDeleteConfirm = (pkg) => {
        setSelectedPackage(pkg);
        setShowDeleteModal(false);
        setShowDeleteConfirmation(true);
    };

    // Handle modal close
    const handleModalClose = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setShowDeleteConfirmation(false);
        setSelectedPackage(null);
    };

    // Handle success operations
    const handleSuccess = () => {
        handleModalClose();
        window.location.reload();
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Get status badge
    const getStatusBadge = (status) => {
        if (status === 1) {
            return <span className="badge badge-success badge-sm">Active</span>;
        }
        return <span className="badge badge-warning badge-sm">Not Active</span>;
    };

    // Pagination handlers
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <AdminDashboardLayout
            title="Package Setup - Serve Cafe"
            user={auth.user}
        >
            <Head title="Package Setup" />

            <div>
                {/* Breadcrumb */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-red-600"
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
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Package Setup
                            </h1>
                            <nav className="flex items-center space-x-2 text-sm mt-1">
                                <Link
                                    href="/dashboard"
                                    className="font-medium text-gray-600 hover:text-gray-900"
                                >
                                    Home
                                </Link>
                                <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                <span className="font-medium text-gray-700">
                                    Package Setup
                                </span>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        {/* Total Packages */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-blue-600"
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
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Packages
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {packages.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Active Packages */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-green-600"
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
                                    <p className="text-sm font-medium text-gray-600">
                                        Active Packages
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {
                                            packages.filter(
                                                (p) => p.status === 1
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Inactive Packages */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-yellow-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Inactive Packages
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {
                                            packages.filter(
                                                (p) => p.status === 0
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Total Value */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-purple-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Value
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(
                                            packages.reduce(
                                                (sum, p) =>
                                                    sum +
                                                    (p.package_amount || 0),
                                                0
                                            )
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Latest Active Package Card */}
                    <div className="max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Latest Active Package
                        </h3>
                        <LatestActivePackageCard />
                    </div>

                    {/* Filters and Actions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Search and Filter */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search packages..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Create Package Button */}
                            <button
                                onClick={handleAddPackage}
                                className="px-6 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 flex items-center space-x-2"
                            >
                                <svg
                                    className="w-5 h-5"
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
                                <span>Create Package</span>
                            </button>
                        </div>
                    </div>

                    {/* Packages Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                Package Offers
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Showing {currentItems.length} of{" "}
                                {filteredPackages.length} packages
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Package Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Valid From
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Valid To
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentItems.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-12 text-center text-sm text-gray-500"
                                            >
                                                No packages found
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((pkg, index) => (
                                            <tr
                                                key={pkg.id}
                                                className={
                                                    index % 2 === 0
                                                        ? "bg-white"
                                                        : "bg-gray-50"
                                                }
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {pkg.package_name ||
                                                            "Unnamed Package"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {formatCurrency(
                                                            pkg.package_amount ||
                                                                0
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(
                                                        pkg.valid_from_date
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(
                                                        pkg.valid_to_date
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(pkg.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(pkg.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleEditPackage(
                                                                    pkg
                                                                )
                                                            }
                                                            className="text-amber-600 hover:text-amber-900 hover:bg-amber-50 px-2 py-1 rounded"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeletePackage(
                                                                    pkg
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900 hover:bg-red-50 px-2 py-1 rounded"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {indexOfFirstItem + 1} to{" "}
                                        {Math.min(
                                            indexOfLastItem,
                                            filteredPackages.length
                                        )}{" "}
                                        of {filteredPackages.length} results
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage - 1
                                                )
                                            }
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        {Array.from(
                                            { length: totalPages },
                                            (_, i) => i + 1
                                        ).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() =>
                                                    handlePageChange(page)
                                                }
                                                className={`px-3 py-1 border rounded-md text-sm ${
                                                    currentPage === page
                                                        ? "bg-amber-800 text-white border-amber-800"
                                                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage + 1
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showAddModal && (
                <AddPackageComponent
                    onClose={handleModalClose}
                    onSuccess={handleSuccess}
                />
            )}

            {showEditModal && selectedPackage && (
                <EditPackageComponent
                    package={selectedPackage}
                    onClose={handleModalClose}
                    onSuccess={handleSuccess}
                />
            )}

            {showDeleteModal && selectedPackage && (
                <DeletePackageComponent
                    package={selectedPackage}
                    onClose={handleModalClose}
                    onConfirm={() => handleDeleteConfirm(selectedPackage)}
                />
            )}

            {showDeleteConfirmation && selectedPackage && (
                <DeletePackageConfirmation
                    package={selectedPackage}
                    onClose={handleModalClose}
                    onSuccess={handleSuccess}
                />
            )}
        </AdminDashboardLayout>
    );
}
