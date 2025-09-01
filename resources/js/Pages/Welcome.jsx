import React from "react";
import AppLayout from "../Layouts/AppLayout";

export default function Welcome() {
    return (
        <AppLayout title="Welcome">
            <div className="hero min-h-[60vh] bg-base-200 rounded-lg">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">
                            Welcome to ServeCafe
                        </h1>
                        <p className="py-6">
                            Your complete restaurant management solution. Manage
                            orders, inventory, staff, and customers all in one
                            place.
                        </p>
                        <button className="btn btn-primary">Get Started</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">📊 Dashboard</h2>
                        <p>
                            Monitor your restaurant's performance with real-time
                            analytics and insights.
                        </p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary btn-sm">
                                View
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">🍽️ Orders</h2>
                        <p>
                            Manage incoming orders, track status, and ensure
                            timely delivery.
                        </p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary btn-sm">
                                Manage
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">👥 Staff</h2>
                        <p>
                            Manage your team, schedules, and staff performance
                            efficiently.
                        </p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary btn-sm">
                                Manage
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* DaisyUI Test Section */}
            <div className="mt-12 p-6 bg-base-200 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">
                    🎨 DaisyUI Components Test
                </h2>
                <div className="flex flex-wrap gap-4">
                    <button className="btn btn-primary">Primary Button</button>
                    <button className="btn btn-secondary">
                        Secondary Button
                    </button>
                    <button className="btn btn-accent">Accent Button</button>
                    <button className="btn btn-ghost">Ghost Button</button>
                    <button className="btn btn-outline">Outline Button</button>
                </div>
                <div className="mt-4">
                    <div className="alert alert-info">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="stroke-current shrink-0 w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        <span>✅ DaisyUI is working perfectly!</span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
