import { Head } from "@inertiajs/react";
import MemberDashboardLayout from "../Components/MemberDashboardLayout";
import Breadcrumb from "../Components/Breadcrumb";
import OrdersComponents from "../OrdersComponents";

export default function TrackOrdersPaid({ auth, orders, filters }) {
    const memberType = auth.user.member_type || "paid";

    return (
        <MemberDashboardLayout
            title="Track Orders - Serve Cafe"
            user={auth.user}
            memberType={memberType}
        >
            <Head title="Track Orders" />

            <div>
                {/* Breadcrumb */}
                <Breadcrumb
                    title="Track Orders"
                    links={["Home", "Orders"]}
                    icon={
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
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                        </svg>
                    }
                />

                {/* Main Content */}
                <div className="p-3 sm:p-4 lg:p-6 w-[100vw] overflow-hidden">
                    <OrdersComponents
                        auth={auth}
                        orders={orders}
                        filters={filters}
                    />
                </div>
            </div>
        </MemberDashboardLayout>
    );
}
