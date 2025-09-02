import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import AdminSidebar from "./AdminSidebar";

export default function AdminDashboardLayout({
    children,
    title = "Admin Dashboard",
    user = null,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div
            className="min-h-screen bg-gray-50 flex flex-col"
            data-theme="light"
        >
            <Head title={title} />

            {/* Header */}
            <AdminHeader user={user} onMenuToggle={toggleSidebar} />

            {/* Main Content Area */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <AdminSidebar
                    isOpen={sidebarOpen}
                    onClose={closeSidebar}
                    user={user}
                />

                {/* Main Content */}
                <main className="flex-1 lg:ml-0">
                    <div className="p-6">{children}</div>
                </main>
            </div>

            {/* Footer */}
            <AdminFooter />
        </div>
    );
}
