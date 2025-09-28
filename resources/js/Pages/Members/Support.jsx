import { Head } from "@inertiajs/react";
import MemberDashboardLayout from "./Components/MemberDashboardLayout";
import Breadcrumb from "./Components/Breadcrumb";

export default function Support({
    auth,
    memberType,
    supportEmail,
    supportPhone,
    supportAddress,
}) {
    return (
        <MemberDashboardLayout
            title="Support - Serve Cafe"
            user={auth.user}
            memberType={memberType}
        >
            <Head title="Support" />

            <div>
                {/* Breadcrumb */}
                <Breadcrumb
                    title="Support"
                    items={[
                        {
                            label: "Home",
                            href:
                                memberType === "free"
                                    ? "/member-f-dashboard"
                                    : "/member-p-dashboard",
                        },
                        { label: "Support", href: "#" },
                    ]}
                />

                {/* Support Content */}
                <div className="space-y-8">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    className="w-10 h-10 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                How Can We Help You?
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                We're here to assist you with any questions or
                                concerns you may have. Reach out to our support
                                team and we'll get back to you as soon as
                                possible.
                            </p>
                        </div>
                    </div>

                    {/* Contact Information Cards */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Email Card */}
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Email Support
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Send us an email and we'll respond within 24
                                    hours
                                </p>
                                <a
                                    href={`mailto:${supportEmail}`}
                                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    {supportEmail}
                                </a>
                            </div>
                        </div>

                        {/* Phone Card */}
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Phone Support
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Call us for immediate assistance during
                                    business hours
                                </p>
                                <a
                                    href={`tel:${supportPhone.replace(
                                        /\s/g,
                                        ""
                                    )}`}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    {supportPhone}
                                </a>
                            </div>
                        </div>

                        {/* Address Card */}
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Visit Us
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Come visit our office for in-person
                                    assistance
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {supportAddress}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4 py-2">
                                <h3 className="font-semibold text-gray-900">
                                    How can I check my wallet balance?
                                </h3>
                                <p className="text-gray-600">
                                    You can view your current wallet balance in
                                    the header of any page, or click on "View
                                    Balance" in the wallet dropdown to see
                                    detailed transaction history.
                                </p>
                            </div>
                            <div className="border-l-4 border-green-500 pl-4 py-2">
                                <h3 className="font-semibold text-gray-900">
                                    How do I upgrade to a paid membership?
                                </h3>
                                <p className="text-gray-600">
                                    Navigate to the "Upgrade to Paid" section in
                                    your dashboard to explore our premium
                                    membership options and benefits.
                                </p>
                            </div>
                            <div className="border-l-4 border-red-500 pl-4 py-2">
                                <h3 className="font-semibold text-gray-900">
                                    What are your business hours?
                                </h3>
                                <p className="text-gray-600">
                                    Our support team is available Monday to
                                    Friday, 9:00 AM to 6:00 PM (Nepal Time).
                                    Email support is available 24/7.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Help Section */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-100">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Still Need Help?
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Can't find what you're looking for? Our support
                                team is here to help you with any questions or
                                issues.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href={`mailto:${supportEmail}`}
                                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Send Email
                                </a>
                                <a
                                    href={`tel:${supportPhone.replace(
                                        /\s/g,
                                        ""
                                    )}`}
                                    className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    Call Now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MemberDashboardLayout>
    );
}
