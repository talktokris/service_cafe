import { Head } from "@inertiajs/react";
import MemberDashboardLayout from "../Components/MemberDashboardLayout";
import MemberDashboardComponent from "../Components/MemberDashboardComponent";

export default function FreeMemberDashboard({ auth, stats, referrals }) {
    return (
        <MemberDashboardLayout
            title="Free Member Dashboard - Serve Cafe"
            user={auth.user}
            memberType="free"
        >
            <Head title="Free Member Dashboard" />
            <MemberDashboardComponent
                user={auth.user}
                stats={stats}
                referrals={referrals}
                memberType="free"
            />
        </MemberDashboardLayout>
    );
}
