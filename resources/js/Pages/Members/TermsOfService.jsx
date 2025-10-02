import React from "react";
import { Head } from "@inertiajs/react";
import MemberDashboardLayout from "./Components/MemberDashboardLayout";
import Breadcrumb from "./Components/Breadcrumb";

export default function TermsOfService({ auth, memberType }) {
    return (
        <MemberDashboardLayout
            title="Terms of Service - Serve Cafe"
            user={auth.user}
            memberType={memberType}
        >
            <Head title="Terms of Service" />

            <div className="min-h-screen bg-gray-100">
                {/* Breadcrumb */}
                <Breadcrumb
                    title="Terms of Service"
                    items={[
                        {
                            label: "Home",
                            href:
                                memberType === "free"
                                    ? "/member-f-dashboard"
                                    : "/member-p-dashboard",
                        },
                        { label: "Terms of Service", href: "#" },
                    ]}
                />

                {/* Terms of Service Content */}
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    {/* Header */}
                    <div className="bg-white shadow-sm sm:rounded-lg mb-6">
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
                                <div className="bg-green-500 rounded-full p-2 sm:p-3 mb-3 sm:mb-0 sm:mr-4">
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
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <div className="text-center sm:text-left">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                        Terms of Service
                                    </h1>
                                    <p className="text-sm sm:text-base text-gray-600">
                                        Please read these terms carefully before
                                        using our platform and services.
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
                        {/* Acceptance of Terms */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    1. Acceptance of Terms
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    By accessing and using Serve Cafe's member
                                    platform ("Service"), you accept and agree
                                    to be bound by the terms and provision of
                                    this agreement. If you do not agree to abide
                                    by the above, please do not use this
                                    service.
                                </p>
                            </div>
                        </div>

                        {/* Description of Service */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    2. Description of Service
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                                    Serve Cafe provides a member platform that
                                    includes:
                                </p>
                                <ul className="ml-4 sm:ml-6 list-disc text-sm sm:text-base text-gray-700 space-y-2">
                                    <li>
                                        Referral program and network management
                                    </li>
                                    <li>
                                        Digital wallet and transaction services
                                    </li>
                                    <li>
                                        Member dashboard and account management
                                    </li>
                                    <li>Commission tracking and earnings</li>
                                    <li>Support and customer service</li>
                                </ul>
                            </div>
                        </div>

                        {/* User Responsibilities */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    3. User Responsibilities
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                                    As a user of our platform, you agree to:
                                </p>
                                <ul className="ml-4 sm:ml-6 list-disc text-sm sm:text-base text-gray-700 space-y-2">
                                    <li>
                                        Provide accurate and truthful
                                        information
                                    </li>
                                    <li>
                                        Maintain the security of your account
                                        credentials
                                    </li>
                                    <li>
                                        Use the platform in compliance with
                                        applicable laws
                                    </li>
                                    <li>
                                        Not engage in fraudulent or deceptive
                                        practices
                                    </li>
                                    <li>
                                        Respect other users and their privacy
                                    </li>
                                    <li>
                                        Not attempt to hack or compromise
                                        platform security
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Membership Types */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    4. Membership Types and Benefits
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">
                                            Free Membership
                                        </h3>
                                        <ul className="ml-4 sm:ml-6 list-disc text-sm sm:text-base text-gray-700 space-y-1">
                                            <li>
                                                Basic referral program access
                                            </li>
                                            <li>
                                                Limited earning opportunities
                                            </li>
                                            <li>Standard support services</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">
                                            Paid Membership
                                        </h3>
                                        <ul className="ml-4 sm:ml-6 list-disc text-sm sm:text-base text-gray-700 space-y-1">
                                            <li>Enhanced referral benefits</li>
                                            <li>Higher commission rates</li>
                                            <li>Priority support services</li>
                                            <li>Advanced platform features</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Referral Program */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    5. Referral Program Terms
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                                    Our referral program is subject to the
                                    following conditions:
                                </p>
                                <ul className="ml-4 sm:ml-6 list-disc text-sm sm:text-base text-gray-700 space-y-2">
                                    <li>
                                        Referrals must be legitimate and comply
                                        with our guidelines
                                    </li>
                                    <li>
                                        Commission rates may vary based on
                                        membership type
                                    </li>
                                    <li>
                                        Payments are processed according to our
                                        payment schedule
                                    </li>
                                    <li>
                                        We reserve the right to modify
                                        commission structures
                                    </li>
                                    <li>
                                        Fraudulent referrals will result in
                                        account suspension
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Payment Terms */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    6. Payment and Billing Terms
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                                    Payment terms and conditions:
                                </p>
                                <ul className="ml-4 sm:ml-6 list-disc text-sm sm:text-base text-gray-700 space-y-2">
                                    <li>
                                        All fees are non-refundable unless
                                        otherwise stated
                                    </li>
                                    <li>
                                        Payments are processed securely through
                                        our platform
                                    </li>
                                    <li>
                                        You are responsible for applicable taxes
                                    </li>
                                    <li>
                                        We may change pricing with 30 days
                                        notice
                                    </li>
                                    <li>
                                        Wallet balances are subject to our
                                        withdrawal policies
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Prohibited Activities */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    7. Prohibited Activities
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                                    The following activities are strictly
                                    prohibited:
                                </p>
                                <ul className="ml-4 sm:ml-6 list-disc text-sm sm:text-base text-gray-700 space-y-2">
                                    <li>Creating fake accounts or referrals</li>
                                    <li>
                                        Attempting to manipulate the referral
                                        system
                                    </li>
                                    <li>
                                        Sharing account credentials with others
                                    </li>
                                    <li>Using automated tools or bots</li>
                                    <li>
                                        Engaging in money laundering or illegal
                                        activities
                                    </li>
                                    <li>
                                        Violating intellectual property rights
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Termination */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    8. Account Termination
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    We reserve the right to terminate or suspend
                                    your account at any time for violation of
                                    these terms, fraudulent activity, or any
                                    other reason we deem necessary. You may also
                                    terminate your account at any time by
                                    contacting our support team.
                                </p>
                            </div>
                        </div>

                        {/* Limitation of Liability */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    9. Limitation of Liability
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    Serve Cafe shall not be liable for any
                                    indirect, incidental, special,
                                    consequential, or punitive damages,
                                    including without limitation, loss of
                                    profits, data, use, goodwill, or other
                                    intangible losses, resulting from your use
                                    of the service.
                                </p>
                            </div>
                        </div>

                        {/* Changes to Terms */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    10. Changes to Terms
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    We reserve the right to modify these terms
                                    at any time. We will notify users of
                                    significant changes via email or platform
                                    notification. Your continued use of the
                                    service after changes constitutes acceptance
                                    of the new terms.
                                </p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                    11. Contact Information
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                                    For questions about these Terms of Service,
                                    please contact us:
                                </p>
                                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                    <div className="space-y-2 text-sm sm:text-base">
                                        <p>
                                            <strong>Email:</strong>{" "}
                                            legal@servecafe.com
                                        </p>
                                        <p>
                                            <strong>Phone:</strong>{" "}
                                            +977-1-234-5678
                                        </p>
                                        <p>
                                            <strong>Address:</strong> Serve Cafe
                                            Legal Department, Kathmandu, Nepal
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
