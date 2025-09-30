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
    const getLevelColor = (level) => {
        switch (level) {
            case 1:
                return "bg-red-500";
            case 2:
                return "bg-blue-500";
            case 3:
                return "bg-orange-500";
            case 4:
                return "bg-green-500";
            case 5:
                return "bg-purple-500";
            default:
                return "bg-gray-500";
        }
    };

    // State for managing expanded/collapsed nodes
    const [expandedNodes, setExpandedNodes] = useState(new Set());

    // Ref for the tree container
    const treeContainerRef = useRef(null);

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

    // Center the tree view on component mount
    useEffect(() => {
        const centerTree = () => {
            if (treeContainerRef.current) {
                const containerWidth = 1700;
                const viewportWidth = treeContainerRef.current.clientWidth;
                const centerPosition = Math.max(
                    0,
                    (containerWidth - viewportWidth) / 2
                );

                treeContainerRef.current.scrollLeft = centerPosition;
                treeContainerRef.current.setAttribute("data-scrolled", "true");
            }
        };

        centerTree();
        const timeoutId1 = setTimeout(centerTree, 100);
        const timeoutId2 = setTimeout(centerTree, 500);
        const timeoutId3 = setTimeout(centerTree, 1000);

        window.addEventListener("resize", centerTree);

        return () => {
            clearTimeout(timeoutId1);
            clearTimeout(timeoutId2);
            clearTimeout(timeoutId3);
            window.removeEventListener("resize", centerTree);
        };
    }, []);

    // Custom node component
    const CustomNode = ({ node }) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes.has(node.id);

        return (
            <div className="custom-node">
                <div
                    className={`${getLevelColor(
                        node.level
                    )} text-white px-2 py-1.5 rounded shadow-sm min-w-[100px] text-center border border-white relative`}
                >
                    <div className="font-semibold text-xs leading-tight">
                        {node.name}
                    </div>
                    <div className="text-[10px] opacity-90 leading-tight">
                        {node.member_type === "paid" ? "Paid" : "Free"}
                    </div>
                    <div className="text-[9px] opacity-75 leading-tight">
                        ID: {node.id}
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
                    min-width: 800px;
                    width: 1700px;
                    overflow-x: scroll;
                    overflow-y: scroll;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    scroll-behavior: smooth;
                    scroll-snap-type: x mandatory;
                }

                .org-tree-container:not([data-scrolled]) {
                    scroll-left: 50%;
                }

                .org-tree-container .org-tree-node {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-width: 80px;
                    max-width: 100px;
                    flex-shrink: 0;
                }

                .org-tree-container .org-tree-children {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 15px;
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
                                    <div
                                        className="org-tree-container"
                                        ref={treeContainerRef}
                                    >
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
                            Level Legend
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-red-500 rounded"></div>
                                <span className="text-sm text-gray-700">
                                    Level 1 (Root)
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                <span className="text-sm text-gray-700">
                                    Level 2
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                <span className="text-sm text-gray-700">
                                    Level 3
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-green-500 rounded"></div>
                                <span className="text-sm text-gray-700">
                                    Level 4
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                                <span className="text-sm text-gray-700">
                                    Level 5
                                </span>
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
