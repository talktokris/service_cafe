import React from "react";
import { Head, Link } from "@inertiajs/react";
import { AdminDashboardLayout } from "../AdminComponents";
import MemberManagementPage from "../../ManageMemberComponents/MemberManagementPage";

export default function ManageMembers({ user, members = [] }) {
    return (
        <AdminDashboardLayout title="Manage Members - Serve Cafe" user={user}>
            <Head title="Manage Members" />

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
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Member Management
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
                                        Members
                                    </span>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Member Management Component */}
            <MemberManagementPage user={user} members={members} />
        </AdminDashboardLayout>
    );
}
