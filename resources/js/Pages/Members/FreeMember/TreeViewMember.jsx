import React, { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import MemberDashboardLayout from "../Components/MemberDashboardLayout";
import Breadcrumb from "../Components/Breadcrumb";
import { Tree, TreeNode } from "react-organizational-chart";

export default function TreeViewMember({
    auth,
    memberType,
    treeData,
    currentRootUserId,
    parentInfo,
    loggedInUserId,
}) {
    const getBoxColor = (node) => {
        // Check if user is active (paid and activeStatus = 1)
        const isActive = node.member_type === "paid" && node.activeStatus === 1;

        if (!isActive) {
            // Inactive users - faded gray
            return "bg-gray-300 opacity-60";
        }

        // Active users - attractive gradient color
        return "bg-gradient-to-br from-teal-500 to-cyan-600";
    };

    const getBadgeColor = (badgeInfo) => {
        if (!badgeInfo) return null;
        return badgeInfo.color;
    };

    // State for managing expanded/collapsed nodes
    const [expandedNodes, setExpandedNodes] = useState(new Set());

    const toggleNode = (nodeId) => {
        setExpandedNodes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    };

    // Navigate down - make clicked node the new root
    const navigateDown = (nodeId) => {
        router.visit(`/tree-view?start_user_id=${nodeId}`, {
            preserveState: false,
            preserveScroll: false,
        });
    };

    // Navigate up - go to parent user
    const navigateUp = () => {
        if (parentInfo && parentInfo.id) {
            router.visit(`/tree-view?start_user_id=${parentInfo.id}`, {
                preserveState: false,
                preserveScroll: false,
            });
        }
    };

    // Reset to logged-in user's view
    const resetToMyView = () => {
        router.visit("/tree-view", {
            preserveState: false,
            preserveScroll: false,
        });
    };

    // No centering needed since width is 100%

    // Custom node component
    const CustomNode = ({ node }) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes.has(node.id);
        const isActive = node.member_type === "paid" && node.activeStatus === 1;

        return (
            <div className="custom-node">
                <div
                    className={`${getBoxColor(
                        node
                    )} text-white px-3 py-2 rounded-lg shadow-md min-w-[160px] text-left border border-white relative`}
                >
                    {/* Badge Icon on Left Side */}
                    {node.highestBadge && (
                        <div
                            className={`absolute -left-3 top-1/2 transform -translate-y-1/2 w-7 h-7 rounded-full bg-gradient-to-br ${node.highestBadge.color} border-2 border-white shadow-lg flex items-center justify-center`}
                            title={node.highestBadge.name}
                        >
                            <span className="text-white text-[10px] font-bold">
                                {node.highestBadge.initial}
                            </span>
                        </div>
                    )}

                    <div
                        className={`font-bold text-sm leading-tight mb-1 ml-5 ${
                            !isActive ? "text-gray-600" : ""
                        }`}
                    >
                        {node.name}
                    </div>
                    <div
                        className={`text-xs font-medium leading-tight mb-2 ml-5 ${
                            !isActive
                                ? "text-gray-600 opacity-80"
                                : "text-white opacity-90"
                        }`}
                    >
                        <span className="inline-flex items-center gap-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {node.member_type === "paid" ? (
                                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                                ) : (
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                )}
                            </svg>
                            {node.member_type === "paid" ? "Paid" : "Free"}
                        </span>
                    </div>
                    <div
                        className={`text-[11px] leading-snug flex items-center gap-1.5 ml-5 ${
                            !isActive
                                ? "text-gray-700 opacity-80"
                                : "text-white opacity-90"
                        }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                        <span className="truncate">
                            {node.phone || "No phone"}
                        </span>
                    </div>
                    <div
                        className={`text-[11px] leading-snug flex items-center gap-1.5 ml-5 ${
                            !isActive
                                ? "text-gray-700 opacity-80"
                                : "text-white opacity-90"
                        }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                        <span className="truncate">
                            {node.email || "No email"}
                        </span>
                    </div>

                    {/* Toggle button for existing children */}
                    {hasChildren && (
                        <button
                            onClick={() => toggleNode(node.id)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors text-xs"
                            title={isExpanded ? "Collapse" : "Expand"}
                        >
                            <span className="text-gray-600 font-bold">
                                {isExpanded ? "−" : "+"}
                            </span>
                        </button>
                    )}

                    {/* Navigate down button - make this node the new root */}
                    {node.hasMoreLevels && (
                        <button
                            onClick={() => navigateDown(node.id)}
                            className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-yellow-400 border border-white rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors text-xs"
                            title="View this user's downline (5 levels)"
                        >
                            <span className="text-white font-bold">↓</span>
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // Recursive function to render tree nodes
    const renderTreeNode = (node) => {
        const isExpanded = expandedNodes.has(node.id);
        const hasChildren = node.children && node.children.length > 0;

        if (!hasChildren) {
            return <TreeNode label={<CustomNode node={node} />}></TreeNode>;
        }

        return (
            <TreeNode label={<CustomNode node={node} />}>
                {isExpanded &&
                    node.children.map((child, index) => (
                        <React.Fragment key={child.id || index}>
                            {renderTreeNode(child)}
                        </React.Fragment>
                    ))}
            </TreeNode>
        );
    };

    return (
        <MemberDashboardLayout
            title="Tree View - Serve Cafe"
            user={auth.user}
            memberType={memberType}
        >
            <Head title="Tree View" />

            <style jsx>{`
                .org-chart-wrapper {
                    width: 80vw;
                    overflow: hidden;
                    border-radius: 8px;
                }

                .org-chart-container {
                    width: 100%;
                    height: 500px;
                    overflow: auto;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    background: #fafafa;
                }

                .org-tree-container {
                    width: 100%;
                    padding: 20px;
                    display: flex;

                    align-items: center;
                }

                .org-tree-container .org-tree-node {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-width: 160px;
                    max-width: 180px;
                    flex-shrink: 0;
                }

                .org-tree-container .org-tree-children {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 20px;
                    width: 100%;
                }

                .custom-node {
                    display: flex;
                    justify-content: center;
                }

                .org-chart-container::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }

                .org-chart-container::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }

                .org-chart-container::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 4px;
                }

                .org-chart-container::-webkit-scrollbar-thumb:hover {
                    background: #a1a1a1;
                }
            `}</style>

            <div>
                <Breadcrumb
                    title="Referral Tree View"
                    links={["Home", "Tree View"]}
                    icon={
                        <svg
                            className="w-6 h-6 text-red-600"
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
                    }
                />

                <div className="p-3 sm:p-4 lg:p-6">
                    {/* Navigation Controls */}
                    {(parentInfo || currentRootUserId !== loggedInUserId) && (
                        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    {/* Up Button */}
                                    {parentInfo && (
                                        <button
                                            onClick={navigateUp}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
                                                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                                                />
                                            </svg>
                                            <span>
                                                Go Up to {parentInfo.name}
                                            </span>
                                        </button>
                                    )}

                                    {/* Reset to My View Button */}
                                    {currentRootUserId !== loggedInUserId && (
                                        <button
                                            onClick={resetToMyView}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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
                                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                                />
                                            </svg>
                                            <span>My Tree</span>
                                        </button>
                                    )}
                                </div>

                                <div className="text-sm text-gray-600">
                                    {currentRootUserId === loggedInUserId ? (
                                        <span className="font-semibold text-green-600">
                                            📍 Viewing your tree
                                        </span>
                                    ) : (
                                        <span>
                                            📍 Viewing downline from User ID:{" "}
                                            {currentRootUserId}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="w-full">
                            <div className="org-chart-wrapper">
                                <div className="org-chart-container">
                                    <div className="org-tree-container">
                                        {treeData ? (
                                            <Tree
                                                lineWidth="1px"
                                                lineColor="#6b7280"
                                                lineBorderRadius="8px"
                                                nodePadding="10px"
                                                orientation="vertical"
                                            >
                                                {renderTreeNode(treeData)}
                                            </Tree>
                                        ) : (
                                            <div className="text-center py-10">
                                                <p className="text-gray-500">
                                                    No referral data available
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Legend
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded"></div>
                                <span className="text-sm text-gray-700">
                                    Active Member
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gray-300 rounded opacity-60"></div>
                                <span className="text-sm text-gray-700">
                                    Inactive Member
                                </span>
                            </div>
                        </div>
                        <div className="border-t pt-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3">
                                Badge Ranks (Highest to Lowest):
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center border border-white shadow-sm">
                                        <span className="text-white text-[9px] font-bold">
                                            E
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-700">
                                        Mount Everest
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center border border-white shadow-sm">
                                        <span className="text-white text-[9px] font-bold">
                                            K
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-700">
                                        Kanchenjunga
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center border border-white shadow-sm">
                                        <span className="text-white text-[9px] font-bold">
                                            M
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-700">
                                        Makalu
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center border border-white shadow-sm">
                                        <span className="text-white text-[9px] font-bold">
                                            D
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-700">
                                        Dhaulagiri
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center border border-white shadow-sm">
                                        <span className="text-white text-[9px] font-bold">
                                            M
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-700">
                                        Manaslu
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center border border-white shadow-sm">
                                        <span className="text-white text-[9px] font-bold">
                                            A
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-700">
                                        Annapurna
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-gray-300">
                                    <span className="text-white text-xs font-bold">
                                        ↓
                                    </span>
                                </div>
                                <span className="text-sm text-gray-700">
                                    Click to view this user's downline (resets
                                    view, shows 5 levels from this user)
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-gray-300">
                                    <span className="text-gray-600 text-sm font-bold">
                                        +
                                    </span>
                                </div>
                                <span className="text-sm text-gray-700">
                                    Click to expand/collapse children in current
                                    view
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MemberDashboardLayout>
    );
}
