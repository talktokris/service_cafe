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

            <div className="min-h-screen bg-gray-100">
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
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
                    {/* Compact Header Section */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
                            <div className="bg-blue-500 rounded-full p-2 sm:p-3 mb-3 sm:mb-0 sm:mr-4">
                                <svg
                                    className="w-6 h-6 sm:w-8 sm:h-8 text-white"
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
                            <div className="text-center sm:text-left">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                                    How Can We Help You?
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    We're here to assist you with any questions
                                    or concerns. Reach out to our support team!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Compact Contact Information */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-3 sm:p-4">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 text-center">
                            Contact Us
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                            {/* Email */}
                            <a
                                href={`mailto:${supportEmail}`}
                                className="flex items-center justify-center space-x-1 sm:space-x-2 bg-red-500 hover:bg-red-600 text-white p-2 sm:p-3 rounded-lg transition-colors duration-200"
                            >
                                <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
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
                                <span className="text-xs sm:text-sm font-medium">
                                    Email Support
                                </span>
                            </a>

                            {/* Phone */}
                            <a
                                href={`tel:${supportPhone.replace(/\s/g, "")}`}
                                className="flex items-center justify-center space-x-1 sm:space-x-2 bg-green-500 hover:bg-green-600 text-white p-2 sm:p-3 rounded-lg transition-colors duration-200"
                            >
                                <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
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
                                <span className="text-xs sm:text-sm font-medium">
                                    Call Us
                                </span>
                            </a>

                            {/* Address */}
                            <div className="flex items-center justify-center space-x-1 sm:space-x-2 bg-blue-500 text-white p-2 sm:p-3 rounded-lg">
                                <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
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
                                <span className="text-xs sm:text-sm font-medium">
                                    Visit Office
                                </span>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-3 text-center">
                            <div className="bg-gray-50 rounded-lg p-2">
                                <p className="text-xs text-gray-600 font-medium break-all">
                                    {supportEmail}
                                </p>
                                <p className="text-xs text-gray-500">
                                    24/7 Email Support
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                                <p className="text-xs text-gray-600 font-medium">
                                    {supportPhone}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Mon-Fri, 9AM-6PM
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                                <p className="text-xs text-gray-600 font-medium">
                                    Office Visit
                                </p>
                                <p className="text-xs text-gray-500">
                                    In-person assistance
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Compact FAQ Section */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-3 sm:p-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 text-center">
                            Quick Help
                        </h3>
                        <div className="space-y-3">
                            <div className="border-l-4 border-blue-500 pl-3 py-2 bg-blue-50 rounded-r-lg">
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                    How can I check my wallet balance?
                                </h4>
                                <p className="text-xs text-gray-600">
                                    View your balance in the header or click
                                    "View Balance" for detailed history.
                                </p>
                            </div>
                            <div className="border-l-4 border-green-500 pl-3 py-2 bg-green-50 rounded-r-lg">
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                    How do I upgrade to paid membership?
                                </h4>
                                <p className="text-xs text-gray-600">
                                    Navigate to "Upgrade to Paid" in your
                                    dashboard to explore premium options.
                                </p>
                            </div>
                            <div className="border-l-4 border-red-500 pl-3 py-2 bg-red-50 rounded-r-lg">
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                    What are your business hours?
                                </h4>
                                <p className="text-xs text-gray-600">
                                    Support: Mon-Fri, 9AM-6PM (Nepal Time).
                                    Email support available 24/7.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Compact Additional Help */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-3 sm:p-4">
                        <div className="text-center">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                                Still Need Help?
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3">
                                Can't find what you're looking for? Contact our
                                support team directly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <a
                                    href={`mailto:${supportEmail}`}
                                    className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-xs sm:text-sm"
                                >
                                    <svg
                                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
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
                                    className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200 text-xs sm:text-sm"
                                >
                                    <svg
                                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
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
