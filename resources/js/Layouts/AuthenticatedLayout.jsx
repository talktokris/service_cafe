import { Head } from "@inertiajs/react";
import { Header, Footer } from "@/Components/CommonComponent";

export default function AuthenticatedLayout({ header, children, user }) {
    return (
        <div
            className="min-h-screen flex flex-col bg-base-100"
            data-theme="light"
        >
            <Head title="Dashboard - Serve Cafe" />

            {/* Header with user info */}
            <Header user={user} />

            {/* Page Header */}
            {header && (
                <div className="bg-base-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
