import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // Close all accordions when searching
        setOpenIndex(null);
    };

    const faqData = [
        {
            category: "Getting Started",
            questions: [
                {
                    question: "How do I create an account with Serve Cafe?",
                    answer: "Creating an account is simple! You can sign up directly on our website or use a referral code from an existing member. Just visit our registration page, fill in your details, and verify your email address. Once verified, you can start using your digital wallet and exploring our services.",
                },
                {
                    question: "What is a referral code and do I need one?",
                    answer: "A referral code is a unique code provided by existing members that allows you to join their network. While not required, using a referral code connects you with a mentor in our community and may provide additional benefits. You can also join without a referral code.",
                },
                {
                    question: "Is there a membership fee?",
                    answer: "We offer both free and premium membership options. Free membership gives you access to basic features including the digital wallet and limited referral earnings. Premium membership ($29/month) unlocks full features, unlimited earning potential, and exclusive benefits.",
                },
                {
                    question: "How quickly can I start earning?",
                    answer: "You can start earning immediately after account verification! Share your referral code with friends and family, and earn commissions when they join and make purchases. Premium members have access to unlimited earning potential through our multi-level referral system.",
                },
            ],
        },
        {
            category: "Digital Wallet",
            questions: [
                {
                    question: "How does the digital wallet work?",
                    answer: "Our digital wallet is a prepaid system that allows you to add funds and make seamless payments at any Serve Cafe location. You can top up your wallet using various methods including bank transfers, credit cards, or cash deposits at our locations. All transactions are secure and tracked in real-time.",
                },
                {
                    question: "What are the ways to add money to my wallet?",
                    answer: "You can add funds through multiple convenient methods: online bank transfers, credit/debit card payments, mobile money services, cash deposits at our physical locations, or through earnings from your referral activities. All top-up methods are secure and instant.",
                },
                {
                    question: "Can I withdraw money from my wallet?",
                    answer: "Yes, you can withdraw your earnings and unused wallet balance. Withdrawals can be made to your registered bank account or collected as cash from our locations. Processing times vary by method, typically 1-3 business days for bank transfers and instant for cash pickups.",
                },
                {
                    question: "Is my money safe in the digital wallet?",
                    answer: "Absolutely! We use bank-level security with end-to-end encryption, secure payment processing, and strict data privacy measures. Your funds are protected by advanced security protocols, and we maintain insurance coverage for additional peace of mind.",
                },
            ],
        },
        {
            category: "Referral Program",
            questions: [
                {
                    question: "How does the referral system work?",
                    answer: "Our referral system allows you to earn commissions by inviting others to join Serve Cafe. When someone uses your referral code to sign up and makes purchases, you earn a percentage. Premium members can build multi-level networks and earn from their referrals' referrals, creating unlimited earning potential.",
                },
                {
                    question: "What commissions can I earn from referrals?",
                    answer: "Commission rates vary based on membership level and activity type. Free members earn basic commissions on direct referrals. Premium members earn higher rates and can earn from multiple levels in their network. Specific rates are detailed in your member dashboard and updated regularly.",
                },
                {
                    question: "How and when do I receive referral payments?",
                    answer: "Referral earnings are automatically credited to your digital wallet in real-time as transactions occur. You can track all earnings in your dashboard and withdraw funds according to our standard withdrawal procedures. There's no minimum earning threshold for wallet credits.",
                },
                {
                    question:
                        "Is there a limit to how many people I can refer?",
                    answer: "No! There's no limit to the number of people you can refer. Free members can refer unlimited people but earn only from direct referrals. Premium members can build unlimited networks with multi-level earning potential. The more you share, the more you can earn.",
                },
            ],
        },
        {
            category: "Food & Services",
            questions: [
                {
                    question: "What types of food do you serve?",
                    answer: "We offer a diverse menu featuring both international and local cuisine. Our menu includes appetizers, main courses, desserts, beverages, and specialty items. All dishes are prepared with premium ingredients by experienced chefs. Menu items may vary by location, and we regularly update our offerings.",
                },
                {
                    question:
                        "Do you accommodate special dietary requirements?",
                    answer: "Yes! We cater to various dietary needs including vegetarian, vegan, gluten-free, and other special requirements. Our menu clearly indicates dietary options, and our staff can help you choose suitable items. For severe allergies or specific needs, please inform our team when ordering.",
                },
                {
                    question: "How do I place an order?",
                    answer: "You can place orders through multiple channels: in-person at our locations, through our mobile app, or via our website. Simply browse the menu, select items, customize as needed, and pay using your digital wallet or other accepted payment methods. Orders are processed quickly and efficiently.",
                },
                {
                    question: "What are your operating hours?",
                    answer: "Operating hours vary by location, but most of our cafes are open from 7:00 AM to 10:00 PM daily. Some locations may have extended hours or different schedules. Check the specific hours for your preferred location in our app or website, or contact them directly.",
                },
            ],
        },
        {
            category: "Technical Support",
            questions: [
                {
                    question: "What should I do if I forgot my password?",
                    answer: "If you forgot your password, click on 'Forgot Password' on the login page. Enter your registered email address, and we'll send you a secure reset link. Follow the instructions in the email to create a new password. If you don't receive the email, check your spam folder or contact support.",
                },
                {
                    question: "How do I update my profile information?",
                    answer: "Log in to your account and navigate to 'Profile Settings' in your dashboard. Here you can update your personal information, contact details, payment methods, and preferences. Some changes may require verification for security purposes. Remember to save your changes before exiting.",
                },
                {
                    question: "What if I'm having trouble with the mobile app?",
                    answer: "First, try closing and reopening the app, or restart your device. Ensure you have the latest version from your app store. Clear the app cache if problems persist. For ongoing issues, contact our technical support team with your device information and a description of the problem.",
                },
                {
                    question: "Who do I contact for technical issues?",
                    answer: "For technical support, you can reach us through multiple channels: email support@servecafe.com, phone +977 9766389515, live chat on our website, or visit any of our physical locations. Our technical support team is available 24/7 to help resolve any issues quickly.",
                },
            ],
        },
    ];

    // Filter FAQ data based on search term
    const filteredFaqData = faqData
        .map((category) => ({
            ...category,
            questions: category.questions.filter(
                (faq) =>
                    faq.question
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        }))
        .filter((category) => category.questions.length > 0);

    // Get total number of matching questions
    const totalMatchingQuestions = filteredFaqData.reduce(
        (total, category) => total + category.questions.length,
        0
    );

    // Function to highlight search terms in text
    const highlightText = (text, searchTerm) => {
        if (!searchTerm) return text;

        const regex = new RegExp(`(${searchTerm})`, "gi");
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 px-1 rounded">
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    return (
        <PublicLayout
            title="FAQ - Serve Cafe | Restaurant in Khumaltar | Cafe in Kathmandu Nepal"
            description="Frequently Asked Questions about Serve Cafe - The best restaurant in Khumaltar, Kathmandu. Find answers about our services, digital wallet, referral program, membership, and dining experience in Nepal."
            keywords="serve cafe faq, restaurant khumaltar faq, cafe kathmandu questions, serve cafe help, digital wallet faq, referral program questions, restaurant nepal faq, cafe nepal help"
            canonical="https://servecafe.com/faq"
        >
            <Head title="FAQ - Serve Cafe | Restaurant in Khumaltar | Cafe in Kathmandu" />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
                            Find answers to common questions about Serve Cafe's
                            services, digital wallet, and referral program.
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">
                            How can we help you?
                        </h2>
                        <div className="relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-20"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="bg-gray-400 text-white p-2 rounded-full hover:bg-gray-500 transition-colors"
                                        title="Clear search"
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
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                )}
                                <button className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors">
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
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {searchTerm && (
                            <div className="mt-4">
                                <p className="text-gray-600">
                                    {totalMatchingQuestions > 0
                                        ? `Found ${totalMatchingQuestions} matching question${
                                              totalMatchingQuestions !== 1
                                                  ? "s"
                                                  : ""
                                          }`
                                        : "No matching questions found"}
                                </p>
                            </div>
                        )}
                        <p className="text-gray-600 mt-4">
                            Can't find what you're looking for?{" "}
                            <a
                                href="/contact"
                                className="text-red-600 hover:underline"
                            >
                                Contact our support team
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* FAQ Categories */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredFaqData.length > 0 ? (
                        filteredFaqData.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 text-center">
                                    {category.category}
                                </h2>
                                <div className="max-w-4xl mx-auto space-y-4">
                                    {category.questions.map((faq, faqIndex) => {
                                        const globalIndex = `${categoryIndex}-${faqIndex}`;
                                        const isOpen =
                                            openIndex === globalIndex;

                                        return (
                                            <div
                                                key={faqIndex}
                                                className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                                            >
                                                <button
                                                    onClick={() =>
                                                        toggleAccordion(
                                                            globalIndex
                                                        )
                                                    }
                                                    className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-100 transition-colors duration-200"
                                                >
                                                    <span className="text-lg font-semibold text-gray-900 pr-8">
                                                        {highlightText(
                                                            faq.question,
                                                            searchTerm
                                                        )}
                                                    </span>
                                                    <svg
                                                        className={`w-6 h-6 text-red-600 transform transition-transform duration-200 flex-shrink-0 ${
                                                            isOpen
                                                                ? "rotate-180"
                                                                : ""
                                                        }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </button>
                                                {isOpen && (
                                                    <div className="px-8 pb-6">
                                                        <div className="pt-4 border-t border-gray-200">
                                                            <p className="text-gray-600 leading-relaxed">
                                                                {highlightText(
                                                                    faq.answer,
                                                                    searchTerm
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    className="w-12 h-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                No results found
                            </h3>
                            <p className="text-gray-600 mb-6">
                                We couldn't find any questions matching "
                                {searchTerm}". Try different keywords or browse
                                our categories.
                            </p>
                            <button
                                onClick={() => setSearchTerm("")}
                                className="btn bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition-colors"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Links Section */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                            Need More Help?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Explore these additional resources or get in touch
                            with our support team.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">
                                User Guide
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Comprehensive guides and tutorials to help you
                                get the most out of Serve Cafe.
                            </p>
                            <a
                                href="/guide"
                                className="btn bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-full"
                            >
                                View Guide
                            </a>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">
                                Live Chat
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Coming Soon - Real-time chat support will be
                                available soon.
                            </p>
                            <button
                                className="btn bg-orange-600 text-white hover:bg-orange-700 px-6 py-2 rounded-full"
                                disabled
                            >
                                Coming Soon
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
                            <h3 className="text-xl font-bold mb-4 text-gray-900">
                                Email Support
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Send us detailed questions and receive
                                comprehensive responses from our team.
                            </p>
                            <a
                                href="mailto:support@servecafe.com"
                                className="btn bg-yellow-600 text-white hover:bg-yellow-700 px-6 py-2 rounded-full"
                            >
                                Send Email
                            </a>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">
                                Phone Support
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Call our support hotline for urgent matters and
                                direct assistance from our team.
                            </p>
                            <a
                                href="tel:+9779766389515"
                                className="btn bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-full"
                            >
                                Call Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact CTA */}
            <div className="py-24 bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Still Have Questions?
                    </h2>
                    <p className="text-xl md:text-2xl mb-12 text-white/90">
                        Our support team is here to help you 24/7. Get in touch
                        and we'll respond as quickly as possible.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <a
                            href="/contact"
                            className="btn bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-none font-semibold text-xl px-12 py-6 rounded-full transition-all duration-300 transform hover:scale-105"
                        >
                            Contact Support
                        </a>
                        <a
                            href="/register"
                            className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold text-xl px-12 py-6 rounded-full transition-all duration-300"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
