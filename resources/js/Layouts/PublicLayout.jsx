import React from "react";
import { Head } from "@inertiajs/react";
import { Header, Footer } from "@/Components/CommonComponent";

export default function PublicLayout({ children, title = "Serve Cafe" }) {
    return (
        <div
            className="min-h-screen flex flex-col bg-base-100"
            data-theme="light"
        >
            <Head title={title} />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
