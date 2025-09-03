import React from "react";
import { Head } from "@inertiajs/react";
import { AdminDashboardLayout } from "../AdminComponents";
import DashboardComponent from "../../Dashboards/Admin/DashboardComponent";

export default function SuperUserDashboard({ user, stats }) {
    return (
        <AdminDashboardLayout
            title="Head Office Dashboard - Serve Cafe"
            user={user}
        >
            <Head title="Head Office Dashboard" />
            <DashboardComponent user={user} stats={stats} />
        </AdminDashboardLayout>
    );
}
