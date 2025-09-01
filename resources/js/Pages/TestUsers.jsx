import React from "react";
import { Head } from "@inertiajs/react";

export default function TestUsers({ users }) {
    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <Head title="Test Users - ServeCafe" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        🍽️ ServeCafe Test Users
                    </h1>
                    <p className="text-lg text-gray-600">
                        Use these test accounts to login and test different user roles
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg inline-block">
                        <p className="text-blue-800 font-medium">
                            📝 Password for all users: <span className="font-bold">password</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* HeadOffice Users */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">HeadOffice</h2>
                                <p className="text-gray-600">Corporate Management</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {users.HeadOffice.map((user, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                            <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                                {user.role}
                                            </span>
                                        </div>
                                        <a
                                            href="/login"
                                            className="btn btn-sm btn-primary"
                                        >
                                            Login
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BrandOffice Users */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">BrandOffice</h2>
                                <p className="text-gray-600">Branch Management</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {users.BrandOffice.map((user, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                            <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                {user.role}
                                            </span>
                                        </div>
                                        <a
                                            href="/login"
                                            className="btn btn-sm btn-primary"
                                        >
                                            Login
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Members */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Members</h2>
                                <p className="text-gray-600">Customers & Referrals</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {users.Members.map((user, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                            <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                                                user.role === 'Paid Member' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <a
                                            href="/login"
                                            className="btn btn-sm btn-primary"
                                        >
                                            Login
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a
                            href="/login"
                            className="btn btn-primary btn-lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Go to Login
                        </a>
                        <a
                            href="/"
                            className="btn btn-secondary btn-lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home Page
                        </a>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-accent btn-lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh Page
                        </button>
                    </div>
                </div>

                {/* Features Overview */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 What to Test</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">HeadOffice Features:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• System-wide user management</li>
                                <li>• Branch creation and management</li>
                                <li>• Financial reports and analytics</li>
                                <li>• Commission processing</li>
                                <li>• Billing and invoice generation</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Member Features:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Wallet management (Paid Members)</li>
                                <li>• Referral tracking and MLM</li>
                                <li>• Commission earnings</li>
                                <li>• Order placement</li>
                                <li>• Upgrade to paid membership</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
