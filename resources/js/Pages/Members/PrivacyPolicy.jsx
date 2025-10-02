import React from "react";
import { Head } from "@inertiajs/react";
import MemberDashboardLayout from "./Components/MemberDashboardLayout";
import Breadcrumb from "./Components/Breadcrumb";

export default function PrivacyPolicy({ auth, memberType }) {
    return (
        <MemberDashboardLayout
            title="Privacy Policy - Serve Cafe"
            user={auth.user}
            memberType={memberType}
        >
            <Head title="Privacy Policy" />

            <div className="min-h-screen bg-gray-100">
                {/* Breadcrumb */}
                <Breadcrumb
                    title="Privacy Policy"
                    items={[
                        {
                            label: "Home",
                            href:
                                memberType === "free"
                                    ? "/member-f-dashboard"
                                    : "/member-p-dashboard",
                        },
                        { label: "Privacy Policy", href: "#" },
                    ]}
                />

                {/* Privacy Policy Content */}
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    {/* Header */}
                    <div className="bg-white shadow-sm sm:rounded-lg mb-6">
                        <div className="p-4 sm:p-6">
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
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <div className="text-center sm:text-left">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                        Privacy Policy
                                    </h1>
                                    <p className="text-sm sm:text-base text-gray-600">
                                        Your privacy is important to us. Learn
                                        how we collect, use, and protect your
                                        information.
                                    </p>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-xs sm:text-sm text-gray-500">
                                    Last updated: January 1, 2025
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-6">
                        {/* Introduction */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    1. Introduction
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    Welcome to Serve Cafe ("we," "our," or
                                    "us"). This Privacy Policy explains how we
                                    collect, use, disclose, and safeguard your
                                    information when you use our member platform
                                    and services. Please read this privacy
                                    policy carefully. If you do not agree with
                                    the terms of this privacy policy, please do
                                    not access the platform.
                                </p>
                            </div>
                        </div>

                        {/* Information We Collect */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    2. Information We Collect
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">
                                            Personal Information
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                            We may collect personal information
                                            that you provide directly to us,
                                            including:
                                        </p>
                                        <ul className="mt-2 ml-4 sm:ml-6 list-disc text-sm sm:text-base text-gray-700 space-y-1">
                                            <li>
                                                Name and contact information
                                                (email, phone number)
                                            </li>
                                            <li>
                                                Account credentials and profile
                                                information
                                            </li>
                                            <li>
                                                Payment and billing information
                                            </li>
                                            <li>
                                                Referral codes and network
                                                information
                                            </li>
                                            <li>Communication preferences</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">
                                            Usage Information
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                            We automatically collect information
                                            about your use of our platform,
                                            including:
                                        </p>
                                        <ul className="mt-2 ml-4 sm:ml-6 list-disc text-sm sm:text-base text-gray-700 space-y-1">
                                            <li>
                                                Device information and IP
                                                address
                                            </li>
                                            <li>
                                                Browser type and operating
                                                system
                                            </li>
                                            <li>
                                                Pages visited and time spent on
                                                platform
                                            </li>
                                            <li>
                                                Transaction history and wallet
                                                activity
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* How We Use Information */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    3. How We Use Your Information
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                                    We use the information we collect for
                                    various purposes, including:
                                </p>
                                <ul className="ml-4 sm:ml-6 list-disc text-sm sm:text-base text-gray-700 space-y-2">
                                    <li>
                                        Providing and maintaining our services
                                    </li>
                                    <li>
                                        Processing transactions and managing
                                        your wallet
                                    </li>
                                    <li>
                                        Managing your referral network and
                                        commissions
                                    </li>
                                    <li>
                                        Communicating with you about your
                                        account and services
                                    </li>
                                    <li>
                                        Improving our platform and user
                                        experience
                                    </li>
                                    <li>Complying with legal obligations</li>
                                    <li>
                                        Preventing fraud and ensuring platform
                                        security
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Information Sharing */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    4. Information Sharing and Disclosure
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                                    We do not sell, trade, or otherwise transfer
                                    your personal information to third parties
                                    except in the following circumstances:
                                </p>
                                <ul className="ml-4 sm:ml-6 list-disc text-sm sm:text-base text-gray-700 space-y-2">
                                    <li>With your explicit consent</li>
                                    <li>
                                        To trusted service providers who assist
                                        in operating our platform
                                    </li>
                                    <li>
                                        When required by law or to protect our
                                        rights
                                    </li>
                                    <li>
                                        In connection with a business transfer
                                        or merger
                                    </li>
                                    <li>
                                        To prevent fraud or illegal activities
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Data Security */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    5. Data Security
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    We implement appropriate technical and
                                    organizational security measures to protect
                                    your personal information against
                                    unauthorized access, alteration, disclosure,
                                    or destruction. However, no method of
                                    transmission over the internet or electronic
                                    storage is 100% secure, and we cannot
                                    guarantee absolute security.
                                </p>
                            </div>
                        </div>

                        {/* Your Rights */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    6. Your Rights and Choices
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                                    You have certain rights regarding your
                                    personal information:
                                </p>
                                <ul className="ml-4 sm:ml-6 list-disc text-sm sm:text-base text-gray-700 space-y-2">
                                    <li>
                                        Access and review your personal
                                        information
                                    </li>
                                    <li>
                                        Request correction of inaccurate
                                        information
                                    </li>
                                    <li>
                                        Request deletion of your personal
                                        information
                                    </li>
                                    <li>Opt-out of marketing communications</li>
                                    <li>Data portability (where applicable)</li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    7. Contact Us
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                                    If you have any questions about this Privacy
                                    Policy or our data practices, please contact
                                    us:
                                </p>
                                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                    <div className="space-y-2 text-sm sm:text-base">
                                        <p>
                                            <strong>Email:</strong>{" "}
                                            privacy@servecafe.com
                                        </p>
                                        <p>
                                            <strong>Phone:</strong>{" "}
                                            +977-1-234-5678
                                        </p>
                                        <p>
                                            <strong>Address:</strong> Serve Cafe
                                            Headquarters, Kathmandu, Nepal
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MemberDashboardLayout>
    );
}
