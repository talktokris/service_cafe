import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiry_type: "general",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [captchaAnswer, setCaptchaAnswer] = useState("");
    const [captchaQuestion, setCaptchaQuestion] = useState("");
    const [captchaCorrect, setCaptchaCorrect] = useState(false);

    // Generate simple math CAPTCHA
    const generateCaptcha = () => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operation = Math.random() > 0.5 ? "+" : "-";
        let question, answer;

        if (operation === "+") {
            question = `${num1} + ${num2}`;
            answer = num1 + num2;
        } else {
            question = `${num1} - ${num2}`;
            answer = num1 - num2;
        }

        setCaptchaQuestion(question);
        setCaptchaCorrect(false);
        setCaptchaAnswer("");
        return answer;
    };

    // Initialize CAPTCHA on component mount
    React.useEffect(() => {
        generateCaptcha();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error message when user starts typing
        if (errorMessage) {
            setErrorMessage("");
        }
    };

    const handleCaptchaChange = (e) => {
        const answer = e.target.value;
        setCaptchaAnswer(answer);

        // Check if CAPTCHA is correct
        const [num1, operation, num2] = captchaQuestion.split(" ");
        const expectedAnswer =
            operation === "+"
                ? parseInt(num1) + parseInt(num2)
                : parseInt(num1) - parseInt(num2);
        setCaptchaCorrect(parseInt(answer) === expectedAnswer);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        // Validate CAPTCHA
        if (!captchaCorrect) {
            setErrorMessage(
                "Please solve the CAPTCHA correctly before submitting."
            );
            return;
        }

        // Basic form validation
        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.subject.trim() ||
            !formData.message.trim()
        ) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                credentials: "same-origin",
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                setErrorMessage("");
                alert(result.message);

                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                    inquiry_type: "general",
                });

                // Generate new CAPTCHA
                generateCaptcha();
            } else {
                setErrorMessage(
                    result.message ||
                        "Sorry, there was an error sending your message. Please try again."
                );
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrorMessage(
                "Sorry, there was an error sending your message. Please try again later."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PublicLayout
            title="Contact Serve Cafe - Restaurant in Khumaltar | Cafe in Kathmandu Nepal"
            description="Contact Serve Cafe - The best restaurant in Khumaltar, Kathmandu. Visit us at Lalitpur 14 Khumaltar or call +977 9766389515. Get in touch for reservations, inquiries, and support. Located in the heart of Kathmandu."
            keywords="contact serve cafe, restaurant khumaltar contact, cafe kathmandu phone, serve cafe address, restaurant nepal contact, cafe nepal phone, khumaltar restaurant location, lalitpur cafe contact"
            canonical="https://servecafe.com/contact"
        >
            <Head title="Contact Serve Cafe - Restaurant in Khumaltar | Cafe in Kathmandu" />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Contact Us
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
                            Get in touch with our team. We're here to help you
                            with any questions about our services, membership,
                            or technical support.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Information Cards */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                            Get In Touch
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Choose the best way to reach us. Our team is
                            available 24/7 to assist you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {/* Phone Contact */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">
                                Call Us
                            </h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Speak directly with our support team for
                                immediate assistance.
                            </p>
                            <a
                                href="tel:+9779766389515"
                                className="text-red-600 font-semibold text-lg hover:underline"
                            >
                                +977 9766389515
                            </a>
                            <div className="mt-4 text-sm text-gray-500">
                                Available 24/7
                            </div>
                        </div>

                        {/* Email Contact */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">
                                Email Us
                            </h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Send us detailed questions and receive
                                comprehensive responses.
                            </p>
                            <a
                                href="mailto:info@servecafe.com"
                                className="text-orange-600 font-semibold text-lg hover:underline break-all"
                            >
                                info@servecafe.com
                            </a>
                            <div className="mt-4 text-sm text-gray-500">
                                Response within 2 hours
                            </div>
                        </div>

                        {/* Live Chat */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">
                                Live Chat
                            </h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Coming Soon - Real-time chat support will be
                                available soon.
                            </p>
                            <button
                                className="text-yellow-600 font-semibold text-lg hover:underline"
                                disabled
                            >
                                Coming Soon
                            </button>
                            <div className="mt-4 text-sm text-gray-500">
                                Instant responses
                            </div>
                        </div>

                        {/* Visit Us */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">
                                Visit Us
                            </h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Come to our headquarters for in-person support
                                and assistance.
                            </p>
                            <p className="text-green-600 font-semibold text-center">
                                Lalitpur 14 Khumaltar
                                <br />
                                Nepal
                            </p>
                            <div className="mt-4 text-sm text-gray-500">
                                Mon-Fri: 9AM-6PM
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Form Section */}
            <div className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                            Send Us a Message
                        </h2>
                        <p className="text-xl text-gray-600">
                            Fill out the form below and we'll get back to you as
                            soon as possible.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-3xl p-12">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Inquiry Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    Type of Inquiry
                                </label>
                                <select
                                    name="inquiry_type"
                                    value={formData.inquiry_type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="general">
                                        General Information
                                    </option>
                                    <option value="membership">
                                        Membership Questions
                                    </option>
                                    <option value="technical">
                                        Technical Support
                                    </option>
                                    <option value="billing">
                                        Billing & Payments
                                    </option>
                                    <option value="partnership">
                                        Partnership Opportunities
                                    </option>
                                    <option value="feedback">
                                        Feedback & Suggestions
                                    </option>
                                </select>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Enter your email address"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Brief subject of your message"
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows="6"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                    placeholder="Please provide details about your inquiry, including any relevant information that will help us assist you better."
                                ></textarea>
                            </div>

                            {/* CAPTCHA */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    Security Check *
                                </label>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 px-4 py-3 rounded-lg border-2 border-gray-300 font-mono text-lg font-bold min-w-[120px] text-center">
                                        {captchaQuestion} = ?
                                    </div>
                                    <input
                                        type="number"
                                        value={captchaAnswer}
                                        onChange={handleCaptchaChange}
                                        placeholder="Your answer"
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={generateCaptcha}
                                        className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors duration-200 font-semibold"
                                    >
                                        Refresh
                                    </button>
                                </div>
                                {captchaAnswer && !captchaCorrect && (
                                    <p className="text-red-500 text-sm mt-2">
                                        Incorrect answer. Please try again.
                                    </p>
                                )}
                                {captchaCorrect && (
                                    <p className="text-green-500 text-sm mt-2">
                                        ✓ CAPTCHA solved correctly
                                    </p>
                                )}
                            </div>

                            {/* Error Message */}
                            {errorMessage && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-red-500 mr-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <p className="text-red-700 font-medium">
                                            {errorMessage}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !captchaCorrect}
                                    className={`btn font-semibold text-xl px-12 py-6 rounded-full transition-all duration-300 transform hover:scale-105 ${
                                        isSubmitting || !captchaCorrect
                                            ? "bg-gray-400 text-white cursor-not-allowed"
                                            : "bg-red-600 hover:bg-red-700 text-white"
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        "Send Message"
                                    )}
                                </button>
                                <p className="text-sm text-gray-500 mt-4">
                                    We typically respond within 2 hours during
                                    business hours.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Map & Office Info Section */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Office Information */}
                        <div>
                            <h2 className="text-4xl font-bold mb-8 text-gray-900">
                                Our Headquarters
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4 mt-1">
                                        <svg
                                            className="w-6 h-6 text-white"
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
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            Address
                                        </h3>
                                        <p className="text-gray-600">
                                            Lalitpur 14 Khumaltar
                                            <br />
                                            Nepal
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4 mt-1">
                                        <svg
                                            className="w-6 h-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            Office Hours
                                        </h3>
                                        <div className="text-gray-600">
                                            <p>
                                                Monday - Friday: 9:00 AM - 6:00
                                                PM
                                            </p>
                                            <p>Saturday: 10:00 AM - 4:00 PM</p>
                                            <p>Sunday: Closed</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mr-4 mt-1">
                                        <svg
                                            className="w-6 h-6 text-white"
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
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            Support Availability
                                        </h3>
                                        <p className="text-gray-600">
                                            Live Chat - Coming Soon
                                            <br />
                                            Emergency support: +977 9766389515
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                            <div className="h-96 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Interactive Map
                                    </h3>
                                    <p className="text-gray-600">
                                        Click to view our location on Google
                                        Maps
                                        <br />
                                        and get directions to our office.
                                    </p>
                                    <a
                                        href="https://maps.app.goo.gl/ELrzWT71Z4GRC8ks5"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 btn bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-full inline-block"
                                    >
                                        View on Maps
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Join Serve Cafe?
                    </h2>
                    <p className="text-xl md:text-2xl mb-12 text-white/90">
                        Start your journey with us today and become part of our
                        growing community of satisfied members and successful
                        entrepreneurs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <a
                            href="/register"
                            className="btn bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-none font-semibold text-xl px-12 py-6 rounded-full transition-all duration-300 transform hover:scale-105"
                        >
                            Join Now
                        </a>
                        <a
                            href="/about"
                            className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold text-xl px-12 py-6 rounded-full transition-all duration-300"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
