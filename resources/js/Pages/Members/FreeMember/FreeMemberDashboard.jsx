import { Head } from "@inertiajs/react";
import MemberDashboardLayout from "../Components/MemberDashboardLayout";
import MemberDashboardComponent from "../Components/MemberDashboardComponent";

export default function FreeMemberDashboard({
    auth,
    stats,
    referrals,
    walletBalance,
}) {
    return (
        <MemberDashboardLayout
            title="Free Member Dashboard - Serve Cafe"
            user={auth.user}
            memberType="free"
            walletBalance={walletBalance}
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
