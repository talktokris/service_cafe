import { Head } from "@inertiajs/react";
import MemberDashboardLayout from "../Components/MemberDashboardLayout";
import MemberDashboardComponent from "../Components/MemberDashboardComponent";

export default function PaidMemberDashboard({
    auth,
    stats,
    wallet,
    walletBalance,
    referrals,
}) {
    return (
        <MemberDashboardLayout
            title="Paid Member Dashboard - Serve Cafe"
            user={auth.user}
            memberType="paid"
            walletBalance={walletBalance}
        >
            <Head title="Paid Member Dashboard" />
            <MemberDashboardComponent
                user={auth.user}
                stats={stats}
                referrals={referrals}
                memberType="paid"
            />
        </MemberDashboardLayout>
    );
}
