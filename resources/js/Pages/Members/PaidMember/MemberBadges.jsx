import React from "react";
import { Head } from "@inertiajs/react";
import MemberDashboardLayout from "../Components/MemberDashboardLayout";
import Breadcrumb from "../Components/Breadcrumb";

export default function MemberBadges({
    auth,
    memberType,
    memberRank,
    userBadges,
}) {
    // Your own badges configuration
    const yourBadges = [
        {
            name: "Annapurna",
            initial: "A",
            key: "annapurna",
            isUnlocked: userBadges?.annapurna || false,
            color: "from-blue-500 to-blue-700",
            textColor: "text-blue-600",
            bgColor: "bg-blue-50",
            description: "Active Paid Member",
        },
        {
            name: "Manaslu",
            initial: "M",
            key: "manaslu",
            isUnlocked: userBadges?.manaslu || false,
            color: "from-green-500 to-green-700",
            textColor: "text-green-600",
            bgColor: "bg-green-50",
            description: "Leadership Achievement",
        },
        {
            name: "Dhaulagiri",
            initial: "D",
            key: "dhaulagiri",
            isUnlocked: userBadges?.dhaulagiri || false,
            color: "from-yellow-500 to-yellow-700",
            textColor: "text-yellow-600",
            bgColor: "bg-yellow-50",
            description: "Advanced Achievement",
        },
        {
            name: "Makalu",
            initial: "M",
            key: "makalu",
            isUnlocked: userBadges?.cho_oyu || false,
            color: "from-purple-500 to-purple-700",
            textColor: "text-purple-600",
            bgColor: "bg-purple-50",
            description: "Expert Achievement",
        },
        {
            name: "Kanchenjunga",
            initial: "K",
            key: "kanchenjunga",
            isUnlocked: userBadges?.makalu || false,
            color: "from-red-500 to-red-700",
            textColor: "text-red-600",
            bgColor: "bg-red-50",
            description: "Master Achievement",
        },
        {
            name: "Mount Everest",
            initial: "E",
            key: "mount_everest",
            isUnlocked: userBadges?.kanchenjunga || false,
            color: "from-indigo-500 to-indigo-700",
            textColor: "text-indigo-600",
            bgColor: "bg-indigo-50",
            description: "Elite Achievement",
        },
    ];

    // Upline badges configuration
    const uplineBadges = [
        {
            name: "Annapurna",
            initial: "A",
            userId: memberRank?.refferal_user_id,
            user: memberRank?.referral_user,
            color: "from-blue-500 to-blue-700",
            textColor: "text-blue-600",
            bgColor: "bg-blue-50",
            description: "Direct Referral",
        },
        {
            name: "Manaslu",
            initial: "M",
            userId: memberRank?.three_star_user_id,
            user: memberRank?.three_star_user,
            color: "from-green-500 to-green-700",
            textColor: "text-green-600",
            bgColor: "bg-green-50",
            description: "Leadership Upline",
        },
        {
            name: "Dhaulagiri",
            initial: "D",
            userId: memberRank?.five_star_user_id,
            user: memberRank?.five_star_user,
            color: "from-yellow-500 to-yellow-700",
            textColor: "text-yellow-600",
            bgColor: "bg-yellow-50",
            description: "Advanced Upline",
        },
        {
            name: "Makalu",
            initial: "M",
            userId: memberRank?.seven_star_user_id,
            user: memberRank?.seven_star_user,
            color: "from-purple-500 to-purple-700",
            textColor: "text-purple-600",
            bgColor: "bg-purple-50",
            description: "Expert Upline",
        },
        {
            name: "Kanchenjunga",
            initial: "K",
            userId: memberRank?.mega_star_user_id,
            user: memberRank?.mega_star_user,
            color: "from-red-500 to-red-700",
            textColor: "text-red-600",
            bgColor: "bg-red-50",
            description: "Master Upline",
        },
        {
            name: "Mount Everest",
            initial: "E",
            userId: memberRank?.giga_star_user_id,
            user: memberRank?.giga_star_user,
            color: "from-indigo-500 to-indigo-700",
            textColor: "text-indigo-600",
            bgColor: "bg-indigo-50",
            description: "Elite Upline",
        },
    ];

    const getUserName = (user) => {
        if (!user) return null;

        if (user.first_name && user.last_name) {
            return `${user.first_name} ${user.last_name}`;
        }

        return user.name || "Unknown User";
    };

    const YourBadgeCard = ({ badge }) => {
        return (
            <div
                className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    badge.isUnlocked ? "bg-white" : "bg-gray-100 opacity-60"
                }`}
            >
                {/* Mountain Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 200 200"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill={
                                badge.isUnlocked
                                    ? badge.textColor.replace("text-", "#")
                                    : "#9ca3af"
                            }
                            d="M0,150 L50,50 L100,100 L150,30 L200,150 Z"
                        />
                        <path
                            fill={
                                badge.isUnlocked
                                    ? badge.textColor.replace("text-", "#")
                                    : "#9ca3af"
                            }
                            opacity="0.5"
                            d="M0,180 L40,80 L80,120 L120,60 L160,140 L200,180 Z"
                        />
                    </svg>
                </div>

                {/* Content */}
                <div className="relative p-6">
                    {/* Badge Icon with Mountain Circular Design */}
                    <div className="flex justify-center mb-4">
                        <div
                            className={`relative w-24 h-24 rounded-full ${
                                badge.isUnlocked
                                    ? `bg-gradient-to-br ${badge.color}`
                                    : "bg-gradient-to-br from-gray-400 to-gray-600"
                            } shadow-xl flex items-center justify-center transform transition-transform hover:scale-110`}
                        >
                            {/* Mountain Icon in Background */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                <svg
                                    className="w-16 h-16 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,18H23L14,6Z" />
                                </svg>
                            </div>
                            {/* Initial Letter */}
                            <span className="relative z-10 text-4xl font-bold text-white">
                                {badge.initial}
                            </span>
                        </div>
                    </div>

                    {/* Badge Name */}
                    <h3
                        className={`text-2xl font-bold text-center mb-2 ${
                            badge.isUnlocked ? badge.textColor : "text-gray-500"
                        }`}
                    >
                        {badge.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 text-center mb-4">
                        {badge.description}
                    </p>

                    {/* Status */}
                    {badge.isUnlocked ? (
                        <div
                            className={`${badge.bgColor} rounded-lg p-4 text-center`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="font-semibold text-gray-800">
                                    Achievement Unlocked!
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-200 rounded-lg p-4 text-center">
                            <div className="flex items-center justify-center space-x-2 text-gray-500">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                                <p className="font-semibold">Not Unlocked</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Complete requirements to unlock
                            </p>
                        </div>
                    )}
                </div>

                {/* Locked/Unlocked Status Badge */}
                <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                        badge.isUnlocked
                            ? "bg-green-500 text-white"
                            : "bg-gray-400 text-white"
                    }`}
                >
                    {badge.isUnlocked ? "✓ Unlocked" : "🔒 Locked"}
                </div>
            </div>
        );
    };

    const UplineBadgeCard = ({ badge }) => {
        const userName = getUserName(badge.user);
        const isUnlocked = badge.userId !== null;

        return (
            <div
                className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    isUnlocked ? "bg-white" : "bg-gray-100 opacity-60"
                }`}
            >
                {/* Mountain Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 200 200"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill={
                                isUnlocked
                                    ? badge.textColor.replace("text-", "#")
                                    : "#9ca3af"
                            }
                            d="M0,150 L50,50 L100,100 L150,30 L200,150 Z"
                        />
                        <path
                            fill={
                                isUnlocked
                                    ? badge.textColor.replace("text-", "#")
                                    : "#9ca3af"
                            }
                            opacity="0.5"
                            d="M0,180 L40,80 L80,120 L120,60 L160,140 L200,180 Z"
                        />
                    </svg>
                </div>

                {/* Content */}
                <div className="relative p-6">
                    {/* Badge Icon with Mountain Circular Design */}
                    <div className="flex justify-center mb-4">
                        <div
                            className={`relative w-24 h-24 rounded-full ${
                                isUnlocked
                                    ? `bg-gradient-to-br ${badge.color}`
                                    : "bg-gradient-to-br from-gray-400 to-gray-600"
                            } shadow-xl flex items-center justify-center transform transition-transform hover:scale-110`}
                        >
                            {/* Mountain Icon in Background */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                <svg
                                    className="w-16 h-16 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,18H23L14,6Z" />
                                </svg>
                            </div>
                            {/* Initial Letter */}
                            <span className="relative z-10 text-4xl font-bold text-white">
                                {badge.initial}
                            </span>
                        </div>
                    </div>

                    {/* Badge Name */}
                    <h3
                        className={`text-2xl font-bold text-center mb-2 ${
                            isUnlocked ? badge.textColor : "text-gray-500"
                        }`}
                    >
                        {badge.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 text-center mb-4">
                        {badge.description}
                    </p>

                    {/* User Info - Only Name, No ID */}
                    {isUnlocked ? (
                        <div className={`${badge.bgColor} rounded-lg p-4`}>
                            <div className="flex items-center justify-center space-x-2">
                                <svg
                                    className="w-5 h-5 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                <p className="font-semibold text-gray-800">
                                    {userName}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-200 rounded-lg p-4 text-center">
                            <div className="flex items-center justify-center space-x-2 text-gray-500">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                                <p className="font-semibold">Not Available</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                No mentor at this level
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <MemberDashboardLayout
            title="Member Badges - Serve Cafe"
            user={auth.user}
            memberType={memberType}
        >
            <Head title="Member Badges" />

            <div>
                <Breadcrumb
                    title="Member Badges"
                    links={["Home", "Badges"]}
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
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                        </svg>
                    }
                />

                <div className="p-3 sm:p-4 lg:p-6">
                    {/* Header Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                🏔️ Mountain Peaks Achievement
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Climb the highest peaks of success! Each badge
                                represents a milestone in your journey to the
                                summit.
                            </p>
                        </div>
                    </div>

                    {/* Section 1: Your Badges */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-sm border border-green-200 p-6 mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                                <svg
                                    className="w-8 h-8 mr-3 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                    />
                                </svg>
                                Your Badges
                            </h3>
                            <p className="text-gray-600">
                                Your personal achievements and milestones
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {yourBadges.map((badge, index) => (
                                <YourBadgeCard key={index} badge={badge} />
                            ))}
                        </div>

                        {/* Personal Achievement Summary */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                                📊 Personal Achievement Summary
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-green-600">
                                        {
                                            yourBadges.filter(
                                                (b) => b.isUnlocked
                                            ).length
                                        }
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Badges Unlocked
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-gray-400">
                                        {
                                            yourBadges.filter(
                                                (b) => !b.isUnlocked
                                            ).length
                                        }
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Badges Locked
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-4 text-center col-span-2 md:col-span-1">
                                    <p className="text-3xl font-bold text-blue-600">
                                        {Math.round(
                                            (yourBadges.filter(
                                                (b) => b.isUnlocked
                                            ).length /
                                                yourBadges.length) *
                                                100
                                        )}
                                        %
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Completion Rate
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Upline Badges */}
                    <div>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-sm border border-purple-200 p-6 mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                                <svg
                                    className="w-8 h-8 mr-3 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                Upline Badges
                            </h3>
                            <p className="text-gray-600">
                                Your upline mentors and their achievements
                            </p>
                        </div>

                        {/* No Upline Badges Message */}
                        {!memberRank && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center mb-6">
                                <svg
                                    className="w-16 h-16 text-yellow-500 mx-auto mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                                    No Upline Badges Yet
                                </h3>
                                <p className="text-yellow-700">
                                    Your upline badges will appear here once
                                    they achieve milestones!
                                </p>
                            </div>
                        )}

                        {/* Upline Badges Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {uplineBadges.map((badge, index) => (
                                <UplineBadgeCard key={index} badge={badge} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MemberDashboardLayout>
    );
}
