import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <PublicLayout title="Welcome to Serve Cafe">
            {/* Hero Section */}
            <div className="hero min-h-[60vh] bg-gradient-to-br from-primary to-secondary text-primary-content">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <div className="flex justify-center mb-6">
                            <img
                                src="/assets/logo.png"
                                alt="Serve Cafe Logo"
                                className="w-24 h-24 object-contain"
                            />
                        </div>
                        <h1 className="text-5xl font-bold mb-6">Serve Cafe</h1>
                        <p className="text-xl mb-8">
                            Your premier destination for exceptional dining
                            experiences. Join our community and enjoy exclusive
                            benefits.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {auth.user ? (
                                <Link
                                    href={
                                        auth.user.user_type === "member" &&
                                        auth.user.member_type === "free"
                                            ? "/member-f-dashboard"
                                            : auth.user.user_type ===
                                                  "member" &&
                                              auth.user.member_type === "paid"
                                            ? "/member-p-dashboard"
                                            : "/test-dashboard"
                                    }
                                    className="btn btn-accent btn-lg"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="btn btn-accent btn-lg"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="btn btn-outline btn-accent btn-lg"
                                    >
                                        Join Now
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Test Registration Link */}
                        <div className="mt-4">
                            <p className="text-sm text-primary-content/80 mb-2">
                                Test registration with referral code:
                            </p>
                            <Link
                                href="/join/test123"
                                className="btn btn-sm btn-outline btn-primary-content"
                            >
                                Join with Referral Code: test123
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-base-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            Why Choose Serve Cafe?
                        </h2>
                        <p className="text-xl text-base-content/70">
                            Experience the perfect blend of technology and
                            hospitality
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body text-center">
                                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-primary-content"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="card-title justify-center mb-2">
                                    Digital Wallet
                                </h3>
                                <p className="text-base-content/70">
                                    Prepaid wallet system for seamless payments
                                    and exclusive member benefits.
                                </p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body text-center">
                                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-secondary-content"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="card-title justify-center mb-2">
                                    Referral Program
                                </h3>
                                <p className="text-base-content/70">
                                    Multi-level marketing system with commission
                                    rewards for bringing new members.
                                </p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body text-center">
                                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-accent-content"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="card-title justify-center mb-2">
                                    Analytics Dashboard
                                </h3>
                                <p className="text-base-content/70">
                                    Comprehensive reporting and analytics for
                                    all user types and business operations.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-20 bg-primary text-primary-content">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                        <div className="stat">
                            <div className="stat-title text-primary-content/70">
                                Total Members
                            </div>
                            <div className="stat-value">2,647</div>
                            <div className="stat-desc text-primary-content/70">
                                ↗︎ 400 (22%)
                            </div>
                        </div>
                        <div className="stat">
                            <div className="stat-title text-primary-content/70">
                                Orders Today
                            </div>
                            <div className="stat-value">89</div>
                            <div className="stat-desc text-primary-content/70">
                                ↗︎ 12 (15%)
                            </div>
                        </div>
                        <div className="stat">
                            <div className="stat-title text-primary-content/70">
                                Active Branches
                            </div>
                            <div className="stat-value">15</div>
                            <div className="stat-desc text-primary-content/70">
                                ↗︎ 3 (25%)
                            </div>
                        </div>
                        <div className="stat">
                            <div className="stat-title text-primary-content/70">
                                Revenue
                            </div>
                            <div className="stat-value">$89,400</div>
                            <div className="stat-desc text-primary-content/70">
                                ↗︎ $12,000 (15%)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
