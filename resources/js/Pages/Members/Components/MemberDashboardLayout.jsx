import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import MemberHeader from "./MemberHeader";
import MemberSidebar from "./MemberSidebar";
import MemberFooter from "./MemberFooter";

export default function MemberDashboardLayout({
    children,
    title = "Member Dashboard",
    user = null,
    memberType = "free",
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
            <MemberHeader
                user={user}
                onMenuToggle={toggleSidebar}
                memberType={memberType}
            />

            {/* Main Content Area */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <MemberSidebar
                    isOpen={sidebarOpen}
                    onClose={closeSidebar}
                    user={user}
                    memberType={memberType}
                />

                {/* Main Content */}
                <main className="flex-1 lg:ml-0">
                    <div className="p-1">{children}</div>
                </main>
            </div>

            {/* Footer */}
            <MemberFooter />
        </div>
    );
}
