import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

export default function FindMemberComponent({ onClose, onSelectMember }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch members on component mount
    useEffect(() => {
        fetchMembers();
    }, []);

    // Filter members based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredMembers(members);
        } else {
            const filtered = members.filter((member) => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    (member.referral_code &&
                        member.referral_code
                            .toLowerCase()
                            .includes(searchLower)) ||
                    (member.first_name &&
                        member.first_name
                            .toLowerCase()
                            .includes(searchLower)) ||
                    (member.name &&
                        member.name.toLowerCase().includes(searchLower)) ||
                    (member.last_name &&
                        member.last_name.toLowerCase().includes(searchLower)) ||
                    (member.email &&
                        member.email.toLowerCase().includes(searchLower))
                );
            });
            setFilteredMembers(filtered);
        }
    }, [searchTerm, members]);

    const fetchMembers = async () => {
        try {
            setIsLoading(true);

            // Get CSRF token from meta tag
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content") || "";

            const response = await fetch("/api/members", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                credentials: "same-origin", // Include cookies for authentication
            });

            if (response.ok) {
                const data = await response.json();
                setMembers(data.members || []);
                setFilteredMembers(data.members || []);
            } else {
                setMembers([]);
                setFilteredMembers([]);
            }
        } catch (error) {
            setMembers([]);
            setFilteredMembers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectMember = (member) => {
        setSelectedMember(member);
    };

    const handleConfirm = () => {
        if (selectedMember) {
            onSelectMember(selectedMember);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[75vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Find Member Customer
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg
                                className="w-6 h-6"
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
                    </div>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Search by referral code, name, or email..."
                        />
                        <svg
                            className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
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
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="text-center py-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-500 mt-2 text-sm">
                                Loading members...
                            </p>
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="text-center py-6">
                            <svg
                                className="w-12 h-12 mx-auto text-gray-300 mb-3"
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
                            <p className="text-gray-500 text-sm">
                                {searchTerm
                                    ? "No members found matching your search"
                                    : "No members available"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {filteredMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className={`border rounded-md p-2 cursor-pointer transition-all border-l-3 ${
                                        selectedMember?.id === member.id
                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                            : member.member_type === "paid"
                                            ? "border-l-emerald-500 bg-emerald-50 hover:bg-emerald-100 border-gray-200 hover:border-emerald-300 hover:shadow-md"
                                            : "border-l-gray-300 bg-gray-50 hover:bg-gray-100 opacity-75 border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                    }`}
                                    onClick={() => handleSelectMember(member)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <div
                                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    member.member_type ===
                                                    "paid"
                                                        ? "bg-emerald-100"
                                                        : "bg-gray-100"
                                                }`}
                                            >
                                                <svg
                                                    className={`w-3 h-3 ${
                                                        member.member_type ===
                                                        "paid"
                                                            ? "text-emerald-600"
                                                            : "text-gray-600"
                                                    }`}
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
                                            </div>
                                            <div className="ml-2 min-w-0 flex-1">
                                                <div className="flex items-center">
                                                    <h3
                                                        className={`font-medium text-sm truncate ${
                                                            member.member_type ===
                                                            "paid"
                                                                ? "text-emerald-900"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        {member.name ||
                                                            `${member.first_name} ${member.last_name}`.trim()}
                                                    </h3>
                                                    <span
                                                        className={`ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0 ${
                                                            member.member_type ===
                                                            "paid"
                                                                ? "bg-emerald-100 text-emerald-800"
                                                                : "bg-gray-200 text-gray-600"
                                                        }`}
                                                    >
                                                        {member.member_type ===
                                                        "paid"
                                                            ? "💎"
                                                            : "🆓"}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {member.referral_code}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedMember?.id === member.id && (
                                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                                                <svg
                                                    className="w-3 h-3 text-white"
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
                                        )}
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Email:
                                            </span>
                                            <span className="text-gray-900 truncate ml-2">
                                                {member.email}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Phone:
                                            </span>
                                            <span className="text-gray-900">
                                                {member.phone || "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 flex-shrink-0">
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!selectedMember}
                        >
                            <svg
                                className="w-4 h-4 mr-1 inline"
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
                            Confirm Selection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
