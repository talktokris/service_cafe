import React from "react";
import { Head, Link } from "@inertiajs/react";
import { AdminDashboardLayout } from "../AdminComponents";
import ManageBillPaymentComponents from "../../BillPaymentComponents/ManageBillPaymentComponents";

export default function BillPayment({
    auth,
    restaurantTables = [],
    menuItems = [],
    orders = [],
    orderItems = [],
}) {
    const user = auth?.user;

    return (
        <AdminDashboardLayout title="Bill Payment - Serve Cafe" user={user}>
            <Head title="Bill Payment" />

            {/* Page Header */}
            <div className="mb-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Bill Payment
                                </h1>
                                <nav className="flex items-center space-x-2 text-sm">
                                    <Link
                                        href="/dashboard"
                                        className="text-gray-600 hover:text-gray-900 font-medium"
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
                                    <span className="text-gray-700 font-medium">
                                        Bill Payment
                                    </span>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bill Payment Management Component */}
            <ManageBillPaymentComponents
                user={user}
                restaurantTables={restaurantTables}
                menuItems={menuItems}
                orders={orders}
                orderItems={orderItems}
            />
        </AdminDashboardLayout>
    );
}
