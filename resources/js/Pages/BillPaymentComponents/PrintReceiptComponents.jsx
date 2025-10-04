import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

export default function PrintReceiptComponents({ table, order, onClose }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [orderItems, setOrderItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch order items from the database
    useEffect(() => {
        if (order && order.id && user) {
            fetchOrderItems();
        }
    }, [order, user]);

    const fetchOrderItems = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `/order-items?orderId=${order.id}&headOfficeId=${user.headOfficeId}&branchId=${user.branchId}&tableId=${table.id}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-TOKEN":
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute("content") || "",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setOrderItems(data.orderItems || []);
            } else {
                console.error("Failed to fetch order items for receipt");
                setOrderItems([]);
            }
        } catch (error) {
            console.error("Error fetching order items for receipt:", error);
            setOrderItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => {
        const itemPrice = parseFloat(item.sellingPrice) || 0;
        const itemQty = parseInt(item.quantity) || 0;
        return sum + itemPrice * itemQty;
    }, 0);

    const totalTax = orderItems.reduce((sum, item) => {
        const taxAmount = parseFloat(item.taxAmount) || 0;
        return sum + taxAmount;
    }, 0);

    const finalTotal = subtotal + totalTax;

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    // Simple download function using browser's built-in functionality
    const handleDownloadPdf = () => {
        setIsGeneratingPdf(true);

        try {
            const receiptElement = document.getElementById("receipt-content");
            const receiptHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Receipt - Table ${table.tableShortName}</title>
                    <style>
                        body { 
                            font-family: 'Courier New', monospace; 
                            font-size: 12px; 
                            margin: 20px;
                            line-height: 1.4;
                            width: 300px;
                        }
                        .receipt { margin: 0 auto; }
                    </style>
                </head>
                <body>
                    <div class="receipt">${receiptElement.innerHTML}</div>
                </body>
                </html>
            `;

            // Create downloadable HTML file
            const blob = new Blob([receiptHtml], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Receipt-Table-${table.tableShortName}-Order-${order.id}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download Error:", error);
            alert(
                "Failed to download receipt. Please try the Print option instead."
            );
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    // Browser print function (working)
    const handlePrintReceipt = () => {
        setIsGeneratingPdf(true);

        try {
            const receiptElement = document.getElementById("receipt-content");
            const printWindow = window.open("", "_blank");

            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Receipt - Table ${table.tableShortName}</title>
                    <style>
                        body { 
                            font-family: 'Courier New', monospace; 
                            font-size: 12px; 
                            margin: 20px;
                            line-height: 1.4;
                        }
                        .receipt { 
                            width: 300px; 
                            margin: 0 auto;
                        }
                        @media print {
                            body { margin: 0; }
                            .receipt { width: 100%; }
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt">${receiptElement.innerHTML}</div>
                </body>
                </html>
            `);

            printWindow.document.close();
            printWindow.focus();
        setTimeout(() => {
                printWindow.print();
        }, 1000);
        } catch (error) {
            console.error("Print Error:", error);
            alert("Failed to print receipt. Please try again.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Receipt - Table {table.tableShortName}
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

                {/* Receipt Preview */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="text-center py-8">
                            <span className="loading loading-spinner loading-lg"></span>
                            <p className="text-gray-500 mt-2">
                                Loading receipt data...
                            </p>
                        </div>
                    ) : orderItems.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                No items found for this order
                            </p>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="text-center text-sm text-gray-600 mb-4">
                                📄 Receipt Preview
                            </div>

                            {/* Receipt Content for PDF Generation */}
                            <div
                                id="receipt-content"
                                className="bg-white p-6 border rounded-lg"
                                style={{
                                    width: "300px",
                                    minHeight: "400px",
                                    fontFamily: "Courier New, monospace",
                                    fontSize: "12px",
                                    lineHeight: "1.4",
                                    color: "black",
                                }}
                            >
                                {/* Receipt Header */}
                                <div
                                    style={{
                                        textAlign: "center",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        SERVE CAFE
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "10px",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        14 Khumaltar, Lalitpur, Nepal
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "10px",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        Phone: +977 9766389515
                                    </div>
                                    <div
                                        style={{
                                            borderBottom: "1px dashed #666",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        ========================================
                                    </div>
                                </div>

                                {/* Order Info */}
                                <div style={{ marginBottom: "16px" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        <span>Order ID:</span>
                                        <span>#{order?.id || "N/A"}</span>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        <span>Table:</span>
                                        <span>
                                            {table?.tableShortName || "N/A"}
                                    </span>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        <span>Date & Time:</span>
                                        <span style={{ fontSize: "10px" }}>
                                            {new Date().toLocaleString(
                                                "en-GB",
                                                {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )}
                                    </span>
                                    </div>
                                    <div
                                        style={{
                                            borderBottom: "1px dashed #666",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        ========================================
                                    </div>
                                </div>

                                {/* Items */}
                                <div style={{ marginBottom: "16px" }}>
                                    {orderItems.map((item, index) => {
                                        const itemName =
                                            item.menu_item?.menuName ||
                                            item.menuItem?.menuName ||
                                            "Unknown Item";
                                        const price =
                                            parseFloat(item.sellingPrice) || 0;
                                        const qty =
                                            parseInt(item.quantity) || 0;
                                        const total = price * qty;

                                        return (
                                            <div
                                                key={item.id}
                                                style={{ marginBottom: "8px" }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            maxWidth: "180px",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        {itemName}
                                    </span>
                                                    <span>
                                                        {formatCurrency(total)}
                                    </span>
                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "10px",
                                                        color: "#666",
                                                        marginLeft: "8px",
                                                    }}
                                                >
                                                    {formatCurrency(price)} x{" "}
                                                    {qty}
                                                </div>
                            </div>
                                        );
                                    })}
                                    <div
                                        style={{
                                            borderBottom: "1px dashed #666",
                                            marginTop: "8px",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        ========================================
                                    </div>
                                </div>

                                {/* Totals */}
                                <div style={{ marginBottom: "16px" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        <span>Subtotal:</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                        </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        <span>Tax:</span>
                                        <span>{formatCurrency(totalTax)}</span>
                                        </div>
                                    <div
                                        style={{
                                            borderBottom: "1px dashed #666",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        ========================================
                                        </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontWeight: "bold",
                                            fontSize: "14px",
                                        }}
                                    >
                                        <span>TOTAL:</span>
                                        <span>
                                            {formatCurrency(finalTotal)}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            borderBottom: "1px dashed #666",
                                            marginTop: "8px",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        ========================================
                            </div>
                                </div>

                                {/* Payment Info */}
                                <div style={{ marginBottom: "16px" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        <span>Payment Method:</span>
                                        <span>
                                            {order?.paymentType || "Cash"}
                                    </span>
                                </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        <span>Amount Paid:</span>
                                        <span>
                                            {formatCurrency(finalTotal)}
                                    </span>
                                </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        <span>Change:</span>
                                        <span>{formatCurrency(0)}</span>
                            </div>
                                </div>

                                {/* Footer */}
                                <div
                                    style={{
                                        textAlign: "center",
                                        fontSize: "10px",
                                        color: "#666",
                                    }}
                                >
                                    <div
                                        style={{
                                            borderBottom: "1px dashed #666",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        ========================================
                                    </div>
                                    <div style={{ marginBottom: "4px" }}>
                                        Thank you for your visit!
                                        </div>
                                    <div style={{ marginBottom: "4px" }}>
                                        Please come again
                                        </div>
                                    <div>Visit us at: servecafe.com</div>
                            </div>
                            </div>
                        </div>
                    )}
                </div>

                    {/* Action Buttons */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={isGeneratingPdf}
                        >
                            Close
                        </button>
                        <button
                            onClick={handleDownloadPdf}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
                            disabled={
                                isGeneratingPdf ||
                                isLoading ||
                                orderItems.length === 0
                            }
                        >
                            {isGeneratingPdf ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b border-white mr-2"></div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Download HTML
                                </>
                            )}
                        </button>
                        <button
                            onClick={handlePrintReceipt}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                            disabled={
                                isGeneratingPdf ||
                                isLoading ||
                                orderItems.length === 0
                            }
                        >
                            {isGeneratingPdf ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b border-white mr-2"></div>
                                    Printing...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                        />
                                    </svg>
                                    Print Receipt
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
