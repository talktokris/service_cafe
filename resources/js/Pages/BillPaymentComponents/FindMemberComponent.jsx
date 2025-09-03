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
        console.log("FindMemberComponent mounted, fetching members...");
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
            console.log("CSRF Token:", csrfToken);

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
                console.log("Members fetched successfully:", data);
                setMembers(data.members || []);
                setFilteredMembers(data.members || []);
            } else {
                console.error(
                    "Failed to fetch members. Status:",
                    response.status
                );
                const errorData = await response.text();
                console.error("Error response:", errorData);
                setMembers([]);
                setFilteredMembers([]);
            }
        } catch (error) {
            console.error("Error fetching members:", error);
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
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
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
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered w-full pl-10"
                            placeholder="Search by referral code, name, or email..."
                        />
                        <svg
                            className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="text-center py-8">
                            <span className="loading loading-spinner loading-lg"></span>
                            <p className="text-gray-500 mt-2">
                                Loading members...
                            </p>
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="text-center py-8">
                            <svg
                                className="w-16 h-16 mx-auto text-gray-300 mb-4"
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
                            <p className="text-gray-500">
                                {searchTerm
                                    ? "No members found matching your search"
                                    : "No members available"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                        selectedMember?.id === member.id
                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                    }`}
                                    onClick={() => handleSelectMember(member)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                <svg
                                                    className="w-6 h-6 text-purple-600"
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
                                            <div className="ml-3">
                                                <h3 className="font-semibold text-gray-900">
                                                    {member.first_name}{" "}
                                                    {member.last_name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {member.referral_code}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedMember?.id === member.id && (
                                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                <svg
                                                    className="w-4 h-4 text-white"
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

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">
                                                Email:
                                            </span>
                                            <span className="text-gray-900">
                                                {member.email}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">
                                                Phone:
                                            </span>
                                            <span className="text-gray-900">
                                                {member.phone || "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">
                                                Country:
                                            </span>
                                            <span className="text-gray-900">
                                                {member.country || "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">
                                                Member Type:
                                            </span>
                                            <span className="font-medium text-green-600">
                                                {member.member_type || "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex-shrink-0">
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="btn bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={!selectedMember}
                        >
                            <svg
                                className="w-5 h-5 mr-2"
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
