import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <PublicLayout title="Welcome to Serve Cafe - Your Premier Digital Dining Experience">
            {/* Enhanced Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative min-h-[90vh] flex items-center">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <div className="text-center lg:text-left">
                                <div className="flex justify-center lg:justify-start mb-8">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                                        <img
                                            src="/assets/logo.png"
                                            alt="Serve Cafe Logo"
                                            className="w-16 h-16 object-contain"
                                        />
                                    </div>
                                </div>
                                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                                    Welcome to{" "}
                                    <span className="text-yellow-300">Serve Cafe</span>
                                </h1>
                                <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-2xl">
                                    Experience the future of dining with our innovative digital platform. 
                                    Earn rewards, enjoy exclusive benefits, and be part of our growing community.
                                </p>
                                
                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                                    {auth.user ? (
                                        <Link
                                            href={
                                                auth.user.user_type === "member" &&
                                                auth.user.member_type === "free"
                                                    ? "/member-f-dashboard"
                                                    : auth.user.user_type === "member" &&
                                                      auth.user.member_type === "paid"
                                                    ? "/member-p-dashboard"
                                                    : "/test-dashboard"
                                            }
                                            className="btn bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-none font-semibold text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
                                        >
                                            Go to Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route("login")}
                                                className="btn bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-none font-semibold text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                href={route("register")}
                                                className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold text-lg px-8 py-4 rounded-full transition-all duration-300"
                                            >
                                                Join Now
                                            </Link>
                                        </>
                                    )}
                                </div>

                                {/* Features Preview */}
                                <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                        <span>Digital Wallet</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                        <span>Earn Rewards</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                        <span>Multi-level Benefits</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Visual Elements */}
                            <div className="hidden lg:flex justify-center items-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl transform rotate-6 opacity-30"></div>
                                    <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="bg-white/20 rounded-2xl p-6 text-center">
                                                <div className="text-3xl font-bold mb-2">2,500+</div>
                                                <div className="text-sm opacity-90">Active Members</div>
                                            </div>
                                            <div className="bg-white/20 rounded-2xl p-6 text-center">
                                                <div className="text-3xl font-bold mb-2">15</div>
                                                <div className="text-sm opacity-90">Locations</div>
                                            </div>
                                            <div className="bg-white/20 rounded-2xl p-6 text-center">
                                                <div className="text-3xl font-bold mb-2">50K+</div>
                                                <div className="text-sm opacity-90">Orders Served</div>
                                            </div>
                                            <div className="bg-white/20 rounded-2xl p-6 text-center">
                                                <div className="text-3xl font-bold mb-2">4.8★</div>
                                                <div className="text-sm opacity-90">Rating</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Test Registration Link - Development Only */}
                        {!auth.user && (
                            <div className="mt-12 text-center">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
                                    <p className="text-sm text-white/80 mb-2">
                                        Try with referral code for testing:
                                    </p>
                                    <Link
                                        href="/join/test123"
                                        className="btn btn-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
                                    >
                                        Join with Code: test123
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced Features Section */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                            Why Choose Serve Cafe?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Experience the perfect blend of technology and hospitality with 
                            our comprehensive digital dining ecosystem
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {/* Digital Wallet Feature */}
                        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">
                                Smart Digital Wallet
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Secure prepaid wallet system for seamless payments, 
                                instant transactions, and exclusive member rewards.
                            </p>
                        </div>

                        {/* Referral Program Feature */}
                        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg
                                    className="w-10 h-10 text-white"
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
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">
                                Forever Earning Program
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Multi-level referral system with unlimited earning potential 
                                and commission rewards for every successful referral.
                            </p>
                        </div>

                        {/* Analytics Dashboard Feature */}
                        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">
                                Advanced Analytics
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Comprehensive dashboard with real-time analytics, 
                                earning tracking, and detailed business insights.
                            </p>
                        </div>

                        {/* Premium Service Feature */}
                        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg
                                    className="w-10 h-10 text-white"
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
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">
                                Premium Dining
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Exceptional food quality, curated menu selections, 
                                and personalized service at every location.
                            </p>
                        </div>

                        {/* Community Feature */}
                        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">
                                Growing Community
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Join thousands of satisfied members in our growing 
                                network of food enthusiasts and entrepreneurs.
                            </p>
                        </div>

                        {/* Support Feature */}
                        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">
                                24/7 Support
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Dedicated customer support team available around 
                                the clock to assist with any questions or issues.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Stats Section */}
            <div className="py-24 bg-gradient-to-r from-red-600 to-orange-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Our Growing Success</h2>
                        <p className="text-xl text-white/90">Join thousands of satisfied customers and successful entrepreneurs</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4">
                                <div className="text-4xl md:text-5xl font-bold mb-2">2,647+</div>
                                <div className="text-lg font-medium">Active Members</div>
                                <div className="text-sm text-white/70 mt-2">
                                    <span className="text-green-300">↗ 22% growth</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4">
                                <div className="text-4xl md:text-5xl font-bold mb-2">89K+</div>
                                <div className="text-lg font-medium">Orders Completed</div>
                                <div className="text-sm text-white/70 mt-2">
                                    <span className="text-green-300">↗ 15% this month</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4">
                                <div className="text-4xl md:text-5xl font-bold mb-2">15</div>
                                <div className="text-lg font-medium">Branch Locations</div>
                                <div className="text-sm text-white/70 mt-2">
                                    <span className="text-green-300">3 new this year</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4">
                                <div className="text-4xl md:text-5xl font-bold mb-2">4.9★</div>
                                <div className="text-lg font-medium">Customer Rating</div>
                                <div className="text-sm text-white/70 mt-2">
                                    <span className="text-green-300">98% satisfaction</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Getting started with Serve Cafe is simple. Follow these easy steps to begin your journey.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold">
                                    1
                                </div>
                                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gray-200"></div>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Sign Up</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Create your account using a referral code from an existing member or join directly through our platform.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold">
                                    2
                                </div>
                                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gray-200"></div>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Top Up Wallet</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Add funds to your digital wallet to start enjoying seamless payments and exclusive member benefits.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold">
                                    3
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Start Earning</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Enjoy dining, share your referral code, and start earning commissions from your network's activities.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                            What Our Members Say
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Hear from our satisfied members about their experience with Serve Cafe.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 mb-6 italic">
                                "The referral system is amazing! I've been earning passive income just by sharing my experience with friends. The food quality is consistently excellent too."
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                    S
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Sarah Johnson</div>
                                    <div className="text-sm text-gray-500">Premium Member</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 mb-6 italic">
                                "The digital wallet makes payments so convenient. No more carrying cash or cards. The analytics dashboard helps me track my earnings perfectly."
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                    M
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Michael Chen</div>
                                    <div className="text-sm text-gray-500">Active Member</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 mb-6 italic">
                                "Serve Cafe has transformed my dining experience. Great food, innovative technology, and excellent customer service. Highly recommended!"
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                    E
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Emily Rodriguez</div>
                                    <div className="text-sm text-gray-500">Long-time Member</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl md:text-2xl mb-12 text-white/90">
                        Join thousands of satisfied members and start your journey with Serve Cafe today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        {!auth.user && (
                            <>
                                <Link
                                    href={route("register")}
                                    className="btn bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-none font-semibold text-xl px-12 py-6 rounded-full transition-all duration-300 transform hover:scale-105"
                                >
                                    Join Now
                                </Link>
                                <Link
                                    href={route("login")}
                                    className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold text-xl px-12 py-6 rounded-full transition-all duration-300"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                        {auth.user && (
                            <Link
                                href={
                                    auth.user.user_type === "member" &&
                                    auth.user.member_type === "free"
                                        ? "/member-f-dashboard"
                                        : auth.user.user_type === "member" &&
                                          auth.user.member_type === "paid"
                                        ? "/member-p-dashboard"
                                        : "/test-dashboard"
                                }
                                className="btn bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-none font-semibold text-xl px-12 py-6 rounded-full transition-all duration-300 transform hover:scale-105"
                            >
                                Go to Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
