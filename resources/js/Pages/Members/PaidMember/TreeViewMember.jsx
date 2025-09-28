import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import MemberDashboardLayout from "../Components/MemberDashboardLayout";
import Breadcrumb from "../Components/Breadcrumb";
import { Tree, TreeNode } from "react-organizational-chart";

export default function TreeViewMember({ auth, memberType }) {
    // Dummy data for the organizational chart
    const orgChartData = {
        id: "root",
        name: "Francisco Haas",
        role: "Job Role Here",
        level: 1,
        children: [
            {
                id: "level2-1",
                name: "Emmitt Wilkinson",
                role: "Job Role Here",
                level: 2,
                children: [
                    {
                        id: "level3-1",
                        name: "Erick Clay",
                        role: "Job Role Here",
                        level: 3,
                        children: [
                            {
                                id: "level4-1",
                                name: "Willie Page",
                                role: "Job Role Here",
                                level: 4,
                            },
                            {
                                id: "level4-2",
                                name: "Bud Bowen",
                                role: "Job Role Here",
                                level: 4,
                            },
                        ],
                    },
                    {
                        id: "level3-2",
                        name: "Duncan Carrol",
                        role: "Job Role Here",
                        level: 3,
                        children: [
                            {
                                id: "level4-3",
                                name: "Gabrielle Holden",
                                role: "Job Role Here",
                                level: 4,
                            },
                            {
                                id: "level4-4",
                                name: "Elena Stafford",
                                role: "Job Role Here",
                                level: 4,
                            },
                        ],
                    },
                ],
            },
            {
                id: "level2-2",
                name: "Truman Freeman",
                role: "Job Role Here",
                level: 2,
                children: [
                    {
                        id: "level3-3",
                        name: "Lamont Cummings",
                        role: "Job Role Here",
                        level: 3,
                        children: [
                            {
                                id: "level4-5",
                                name: "Kory Keller",
                                role: "Job Role Here",
                                level: 4,
                            },
                            {
                                id: "level4-6",
                                name: "Vicky Pham",
                                role: "Job Role Here",
                                level: 4,
                            },
                        ],
                    },
                    {
                        id: "level3-4",
                        name: "Andre Scott",
                        role: "Job Role Here",
                        level: 3,
                        children: [
                            {
                                id: "level4-7",
                                name: "Noah Schmitt",
                                role: "Job Role Here",
                                level: 4,
                            },
                            {
                                id: "level4-8",
                                name: "Nick Hobbs",
                                role: "Job Role Here",
                                level: 4,
                            },
                        ],
                    },
                ],
            },
        ],
    };

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
            default:
                return "bg-gray-500";
        }
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

    // Custom node component for react-organizational-chart
    const CustomNode = ({ node }) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes.has(node.id);

        return (
            <div className="custom-node">
                <div
                    className={`${getLevelColor(
                        node.level
                    )} text-white px-4 py-3 rounded-lg shadow-md min-w-[150px] text-center border-2 border-white relative`}
                >
                    <div className="font-semibold text-sm leading-tight">
                        {node.name}
                    </div>
                    <div className="text-xs opacity-90 leading-tight">
                        {node.role}
                    </div>
                    {hasChildren && (
                        <button
                            onClick={() => toggleNode(node.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-gray-600 text-sm font-bold">
                                {isExpanded ? "−" : "+"}
                            </span>
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
                        <React.Fragment key={index}>
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
                .org-chart-container {
                    position: relative;
                    min-height: 400px;
                    padding: 20px;
                    overflow: auto;
                }

                .custom-node {
                    display: flex;
                    justify-content: center;
                }

                /* Override react-organizational-chart styles */
                .org-tree-container {
                    max-width: 100%;
                    overflow-x: auto;
                }

                .org-tree-container .org-tree-node {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .org-tree-container .org-tree-children {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                }
            `}</style>

            <div>
                {/* Breadcrumb */}
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

                {/* Main Content */}
                <div className="p-3 sm:p-4 lg:p-6">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Referral Network Tree
                        </h1>
                        <p className="text-gray-600">
                            Visual representation of your referral network
                            hierarchy
                        </p>
                    </div>

                    {/* Tree Map Container */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="org-chart-container">
                            <div className="org-tree-container">
                                <Tree
                                    lineWidth="2px"
                                    lineColor="#6b7280"
                                    lineBorderRadius="10px"
                                    nodePadding="20px"
                                >
                                    {renderTreeNode(orgChartData)}
                                </Tree>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Level Legend
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                        </div>
                    </div>
                </div>
            </div>
        </MemberDashboardLayout>
    );
}
