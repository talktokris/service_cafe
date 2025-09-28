import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import MemberDashboardLayout from "../Components/MemberDashboardLayout";
import Breadcrumb from "../Components/Breadcrumb";

export default function ShareReferral({ auth, memberType }) {
    const user = auth.user;
    const referralLink = `http://servecafe.com/join/${user.referral_code}`;
    const shareMessage = `Join Serve Cafe Forever Earning Program! 🚀\n\nEarn money while enjoying great food and drinks. Start your journey with us today!\n\nJoin here: ${referralLink}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        alert("Referral link copied to clipboard!");
    };

    const shareWhatsApp = () => {
        const whatsappUrl = `https://wa.me/${user.phone.replace(
            /\D/g,
            ""
        )}?text=${encodeURIComponent(shareMessage)}`;
        window.open(whatsappUrl, "_blank");
    };

    const shareViber = () => {
        const viberUrl = `viber://chat?number=${user.phone.replace(
            /\D/g,
            ""
        )}&text=${encodeURIComponent(shareMessage)}`;
        window.open(viberUrl, "_blank");
    };

    const shareEmail = () => {
        const subject = "Join Serve Cafe Forever Earning Program";
        const emailBody = shareMessage;
        const emailUrl = `mailto:?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(emailBody)}`;
        window.open(emailUrl);
    };

    return (
        <MemberDashboardLayout
            title="Share Referral - Serve Cafe"
            user={user}
            memberType={memberType}
        >
            <Head title="Share Referral" />

            <div className="min-h-screen bg-gray-100">
                <Breadcrumb
                    title="Share Referral"
                    items={[
                        { label: "Home", href: "/member-p-dashboard" },
                        { label: "Share Referral", href: "#" },
                    ]}
                />

                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 py-12">
                    {/* Header Section */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-center">
                            <div className="flex justify-center mb-6">
                                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-4">
                                    <svg
                                        className="w-12 h-12 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Share Your Referral
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Invite friends and family to join Serve Cafe's
                                forever earning program. Earn rewards for every
                                successful referral!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Setup Note */}
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mb-6">
                    <div className="p-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="w-5 h-5 text-amber-600 mt-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-amber-800 mb-1">
                                        Setup Required
                                    </h3>
                                    <p className="text-sm text-amber-700">
                                        Please ensure your{" "}
                                        <strong>phone number</strong> and{" "}
                                        <strong>referral code</strong> are
                                        properly set up in your profile before
                                        sharing. This ensures the sharing links
                                        work correctly with your contact
                                        information.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Referral Link Card */}
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mb-6">
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                            Your Referral Link
                        </h2>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">
                                        Referral Code:{" "}
                                        <span className="font-semibold text-gray-800">
                                            {user.referral_code}
                                        </span>
                                    </p>
                                    <p className="text-lg font-mono text-gray-800 break-all">
                                        {referralLink}
                                    </p>
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span>Copy</span>
                                </button>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                Share this link with friends and earn rewards
                                when they join!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Share Options */}
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* WhatsApp */}
                            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                                <div className="bg-green-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    WhatsApp
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Share via WhatsApp with your contacts
                                </p>
                                <button
                                    onClick={shareWhatsApp}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                                >
                                    Share on WhatsApp
                                </button>
                            </div>

                            {/* Viber */}
                            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                                <div className="bg-purple-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M11.99 0C5.373 0 0 5.373 0 12s5.373 12 11.99 12C18.617 24 24 18.627 24 12S18.617 0 11.99 0zm6.93 6.93c-.584 0-1.13.14-1.62.389-.49.249-.88.6-1.17 1.03-.29.43-.44.91-.44 1.44 0 .53.15 1.01.44 1.44.29.43.68.78 1.17 1.03.49.25 1.036.389 1.62.389.584 0 1.13-.139 1.62-.389.49-.25.88-.6 1.17-1.03.29-.43.44-.91.44-1.44 0-.53-.15-1.01-.44-1.44-.29-.43-.68-.78-1.17-1.03-.49-.249-1.036-.389-1.62-.389z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Viber
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Share via Viber with your contacts
                                </p>
                                <button
                                    onClick={shareViber}
                                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                                >
                                    Share on Viber
                                </button>
                            </div>

                            {/* Email */}
                            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                                <div className="bg-blue-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-white"
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
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Email
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Send via email to your contacts
                                </p>
                                <button
                                    onClick={shareEmail}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                                >
                                    Share via Email
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                            Referral Benefits
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start space-x-3">
                                <div className="bg-green-100 rounded-full p-2">
                                    <svg
                                        className="w-5 h-5 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        Earn Commissions
                                    </h3>
                                    <p className="text-gray-600">
                                        Get rewarded for every successful
                                        referral
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-green-100 rounded-full p-2">
                                    <svg
                                        className="w-5 h-5 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        Build Your Network
                                    </h3>
                                    <p className="text-gray-600">
                                        Grow your earning potential with a
                                        strong network
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-green-100 rounded-full p-2">
                                    <svg
                                        className="w-5 h-5 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        Help Others
                                    </h3>
                                    <p className="text-gray-600">
                                        Share the opportunity with friends and
                                        family
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-green-100 rounded-full p-2">
                                    <svg
                                        className="w-5 h-5 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        Track Progress
                                    </h3>
                                    <p className="text-gray-600">
                                        Monitor your referral success and
                                        earnings
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MemberDashboardLayout>
    );
}
