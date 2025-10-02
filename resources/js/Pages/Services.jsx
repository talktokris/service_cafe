import React from "react";
import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function Services() {
    return (
        <PublicLayout title="Our Services - Serve Cafe">
            <Head title="Our Services" />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Our Services
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
                            Comprehensive digital dining solutions designed to enhance your 
                            experience and create lasting value for our community.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Services Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                            What We Offer
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Experience our comprehensive ecosystem of digital dining services, 
                            each designed to provide maximum value and convenience.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 mb-20">
                        {/* Digital Wallet Service */}
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-12">
                            <div className="flex items-start mb-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-6">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold mb-4 text-gray-900">Smart Digital Wallet</h3>
                                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                        Our secure prepaid wallet system revolutionizes how you pay and earn. 
                                        Enjoy seamless transactions, instant payments, and exclusive rewards.
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl p-6">
                                    <h4 className="font-bold text-gray-900 mb-2">Instant Payments</h4>
                                    <p className="text-gray-600 text-sm">Quick and secure transactions without cash or cards</p>
                                </div>
                                <div className="bg-white rounded-xl p-6">
                                    <h4 className="font-bold text-gray-900 mb-2">Top-up Options</h4>
                                    <p className="text-gray-600 text-sm">Multiple convenient ways to add funds to your wallet</p>
                                </div>
                                <div className="bg-white rounded-xl p-6">
                                    <h4 className="font-bold text-gray-900 mb-2">Transaction History</h4>
                                    <p className="text-gray-600 text-sm">Detailed records of all your spending and earnings</p>
                                </div>
                                <div className="bg-white rounded-xl p-6">
                                    <h4 className="font-bold text-gray-900 mb-2">Reward Points</h4>
                                    <p className="text-gray-600 text-sm">Earn points with every purchase for future benefits</p>
                                </div>
                            </div>
                        </div>

                        {/* Referral Program Service */}
                        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-12">
                            <div className="flex items-start mb-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mr-6">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold mb-4 text-gray-900">Forever Earning Program</h3>
                                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                        Our innovative multi-level referral system allows you to build a 
                                        sustainable income stream by sharing Serve Cafe with others.
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl p-6">
                                    <h4 className="font-bold text-gray-900 mb-2">Commission Rewards</h4>
                                    <p className="text-gray-600 text-sm">Earn from every successful referral and their activities</p>
                                </div>
                                <div className="bg-white rounded-xl p-6">
                                    <h4 className="font-bold text-gray-900 mb-2">Multi-Level System</h4>
                                    <p className="text-gray-600 text-sm">Build your network and earn from multiple levels</p>
                                </div>
                                <div className="bg-white rounded-xl p-6">
                                    <h4 className="font-bold text-gray-900 mb-2">Performance Tracking</h4>
                                    <p className="text-gray-600 text-sm">Monitor your referral success and earnings</p>
                                </div>
                                <div className="bg-white rounded-xl p-6">
                                    <h4 className="font-bold text-gray-900 mb-2">Bonus Incentives</h4>
                                    <p className="text-gray-600 text-sm">Special rewards for top performers and milestones</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Food & Beverage Services */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                            Food & Beverage Excellence
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Exceptional culinary experiences crafted with the finest ingredients 
                            and delivered with innovative service solutions.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Premium Cuisine</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Carefully curated menu featuring international and local specialties, 
                                prepared by experienced chefs with premium ingredients.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Quick Service</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Efficient order processing and fast delivery times without 
                                compromising on quality or presentation.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Custom Orders</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Personalized dining experience with customizable options 
                                to meet dietary preferences and special requirements.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Technology Services */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                            Technology Solutions
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Cutting-edge technology platforms that power our innovative 
                            dining and earning ecosystem.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Analytics Dashboard</h3>
                            <p className="text-gray-600 text-center leading-relaxed mb-6">
                                Comprehensive real-time analytics providing insights into 
                                your earnings, spending patterns, and network performance.
                            </p>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                                    Real-time earnings tracking
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                                    Network performance metrics
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                                    Detailed transaction reports
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Mobile App</h3>
                            <p className="text-gray-600 text-center leading-relaxed mb-6">
                                User-friendly mobile application for seamless ordering, 
                                payment processing, and account management on the go.
                            </p>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                                    Easy order placement
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                                    Wallet management
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                                    Referral sharing tools
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Security System</h3>
                            <p className="text-gray-600 text-center leading-relaxed mb-6">
                                Advanced security measures protecting your data, transactions, 
                                and earnings with industry-leading encryption.
                            </p>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                                    End-to-end encryption
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                                    Secure payment processing
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                                    Data privacy protection
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Membership Tiers */}
            <div className="py-24 bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Membership Plans
                        </h2>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            Choose the membership plan that best suits your needs and 
                            unlock exclusive benefits and earning opportunities.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
                            <h3 className="text-3xl font-bold mb-6 text-center">Free Member</h3>
                            <div className="text-center mb-8">
                                <span className="text-5xl font-bold">Free</span>
                                <div className="text-white/80">Always</div>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    Basic wallet functionality
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    Limited referral earnings
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    Access to all locations
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    Customer support
                                </li>
                            </ul>
                            <div className="text-center">
                                <a href="/register" className="btn bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full">
                                    Join Free
                                </a>
                            </div>
                        </div>

                        <div className="bg-yellow-400 text-gray-900 rounded-3xl p-12 transform scale-105 shadow-2xl">
                            <div className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full inline-block mb-6">
                                RECOMMENDED
                            </div>
                            <h3 className="text-3xl font-bold mb-6 text-center">Premium Member</h3>
                            <div className="text-center mb-8">
                                <span className="text-5xl font-bold">$29</span>
                                <div className="text-gray-700">per month</div>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    Full wallet features + bonuses
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    Unlimited referral earnings
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    Advanced analytics dashboard
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    Priority customer support
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    Exclusive member discounts
                                </li>
                            </ul>
                            <div className="text-center">
                                <a href="/register" className="btn bg-red-600 text-white hover:bg-red-700 font-semibold px-8 py-3 rounded-full">
                                    Upgrade Now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                        Ready to Experience Our Services?
                    </h2>
                    <p className="text-xl text-gray-600 mb-12">
                        Join thousands of satisfied members and start enjoying the benefits 
                        of our comprehensive digital dining ecosystem today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <a
                            href="/register"
                            className="btn bg-red-600 hover:bg-red-700 text-white font-semibold text-xl px-12 py-6 rounded-full transition-all duration-300 transform hover:scale-105"
                        >
                            Get Started Now
                        </a>
                        <a
                            href="/contact"
                            className="btn btn-outline border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold text-xl px-12 py-6 rounded-full transition-all duration-300"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}