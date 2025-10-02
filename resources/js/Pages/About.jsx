import React from "react";
import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function About() {
    return (
        <PublicLayout title="About Us - Serve Cafe">
            <Head title="About Us" />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            About Serve Cafe
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
                            Revolutionizing the dining experience through technology, 
                            community, and exceptional service since our inception.
                        </p>
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6 text-gray-900">
                                Our Story
                            </h2>
                            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                <p>
                                    Serve Cafe was born from a simple vision: to create a dining 
                                    experience that goes beyond just great food. We wanted to build 
                                    a community where technology enhances hospitality, where every 
                                    customer becomes part of our extended family.
                                </p>
                                <p>
                                    Founded in 2023, we started with a revolutionary idea - 
                                    combining traditional cafe culture with innovative digital 
                                    solutions. Our journey began with the belief that dining 
                                    should be seamless, rewarding, and community-driven.
                                </p>
                                <p>
                                    Today, we're proud to serve thousands of satisfied customers 
                                    across 15 locations, each one a testament to our commitment 
                                    to excellence and innovation in the food service industry.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-8 text-white">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold mb-2">15</div>
                                        <div className="text-sm opacity-90">Locations</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold mb-2">2500+</div>
                                        <div className="text-sm opacity-90">Members</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold mb-2">89K+</div>
                                        <div className="text-sm opacity-90">Orders</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold mb-2">4.9★</div>
                                        <div className="text-sm opacity-90">Rating</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision Section */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16">
                        <div className="bg-white rounded-3xl p-12 shadow-xl">
                            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-8">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                To revolutionize the dining industry by creating an ecosystem where 
                                exceptional food meets innovative technology, fostering a community 
                                of satisfied customers and successful entrepreneurs through our 
                                comprehensive digital platform and forever earning program.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-12 shadow-xl">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-8">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold mb-6 text-gray-900">Our Vision</h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                To become the leading digital dining platform globally, where 
                                every meal is an opportunity for connection, growth, and prosperity. 
                                We envision a future where dining experiences create lasting 
                                relationships and sustainable income opportunities for our community.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Values Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                            Our Core Values
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            These principles guide everything we do and shape our commitment to excellence.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Customer First</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Every decision we make puts our customers' satisfaction and 
                                success at the center of our priorities.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Innovation</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We continuously innovate to provide cutting-edge solutions 
                                that enhance the dining experience.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Community</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Building strong relationships and fostering a sense of 
                                belonging within our growing community.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Integrity</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Operating with transparency, honesty, and ethical practices 
                                in all our business dealings.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Excellence</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Striving for the highest standards in food quality, 
                                service delivery, and customer satisfaction.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Sustainability</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Committed to sustainable practices that benefit our 
                                environment and future generations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                            Meet Our Leadership
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            The passionate team behind Serve Cafe's innovation and success.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
                            <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl font-bold">
                                JD
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-gray-900">John Doe</h3>
                            <p className="text-red-600 font-semibold mb-4">Chief Executive Officer</p>
                            <p className="text-gray-600 leading-relaxed">
                                Visionary leader with 15+ years in hospitality and technology, 
                                driving Serve Cafe's mission to revolutionize dining experiences.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
                            <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl font-bold">
                                JS
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-gray-900">Jane Smith</h3>
                            <p className="text-orange-600 font-semibold mb-4">Chief Technology Officer</p>
                            <p className="text-gray-600 leading-relaxed">
                                Technology expert specializing in fintech and digital platforms, 
                                responsible for our innovative wallet and referral systems.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
                            <div className="w-32 h-32 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl font-bold">
                                MJ
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-gray-900">Michael Johnson</h3>
                            <p className="text-yellow-600 font-semibold mb-4">Head of Operations</p>
                            <p className="text-gray-600 leading-relaxed">
                                Operations specialist ensuring seamless service delivery 
                                across all locations and maintaining our high-quality standards.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Join Our Story
                    </h2>
                    <p className="text-xl md:text-2xl mb-12 text-white/90">
                        Be part of the Serve Cafe community and help us write the next chapter 
                        of innovative dining experiences.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <a
                            href="/register"
                            className="btn bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-none font-semibold text-xl px-12 py-6 rounded-full transition-all duration-300 transform hover:scale-105"
                        >
                            Become a Member
                        </a>
                        <a
                            href="/contact"
                            className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold text-xl px-12 py-6 rounded-full transition-all duration-300"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
