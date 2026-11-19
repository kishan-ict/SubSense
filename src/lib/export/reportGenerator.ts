import { jsPDF } from "jspdf";
import { ParsedSubscription, AuditResult } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

/**
 * Generates RFC 4180 compliant CSV string with CSV Formula Injection Protection.
 * Any cells starting with =, +, -, @, \t, \r are prepended with an apostrophe.
 */
export function exportSubscriptionsToCSV(subscriptions: ParsedSubscription[]): string {
  const headers = [
    "Brand",
    "Original Merchant",
    "Category",
    "Amount",
    "Currency",
    "Billing Frequency",
    "Next Renewal Date",
    "Annualized Cost",
    "Status",
    "User Decision",
    "Price Increase Detected",
    "Duplicate Detected",
  ];

  const escapeCell = (val: string | number | undefined): string => {
    if (val === undefined || val === null) return '""';
    let str = String(val);
    // CSV Formula Injection mitigation (prevent Excel/Sheets formula execution)
    if (/^[=+\-@\t\r]/.test(str)) {
      str = `'${str}`;
    }
    // Escape double quotes
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = subscriptions.map((sub) => [
    escapeCell(sub.normalizedBrand),
    escapeCell(sub.merchant),
    escapeCell(sub.category),
    escapeCell(sub.amount),
    escapeCell(sub.currency),
    escapeCell(sub.billingFrequency),
    escapeCell(sub.nextRenewalDate),
    escapeCell(sub.annualizedCost),
    escapeCell(sub.status),
    escapeCell(sub.action),
    escapeCell(sub.priceAnomaly?.hasAnomaly ? "YES" : "NO"),
    escapeCell(sub.duplicateInfo?.isDuplicate ? "YES" : "NO"),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
}

/**
 * Client-safe trigger for file download
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string = "text/csv;charset=utf-8;") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates an executive PDF report using jsPDF
 */
export function generateAuditPdfReport(audit: AuditResult): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Primary Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // Navy/Slate 900
  doc.text("SubSense", 14, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text("Recurring Expense & Subscription Audit Report", 14, 28);
  doc.text(`Generated on: ${formatDate(new Date().toISOString())}`, pageWidth - 14, 28, { align: "right" });

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 32, pageWidth - 14, 32);

  // Executive Summary Card Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("Executive Summary", 14, 42);

  // Summary Metrics Grid
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 47, pageWidth - 28, 30, 3, 3, "F");

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Monthly Recurring Spend", 20, 56);
  doc.text("Projected Annual Spend", 70, 56);
  doc.text("Potential Annual Savings", 125, 56);
  doc.text("Active Subscriptions", 170, 56);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(formatCurrency(audit.summary.totalMonthlySpend), 20, 68);
  doc.text(formatCurrency(audit.summary.projectedAnnualSpend), 70, 68);

  doc.setTextColor(16, 185, 129); // Emerald
  doc.text(formatCurrency(audit.summary.potentialAnnualSavings), 125, 68);

  doc.setTextColor(15, 23, 42);
  doc.text(String(audit.summary.activeSubscriptionsCount), 170, 68);

  // Subscriptions Table
  let currentY = 90;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("Detected Recurring Subscriptions", 14, currentY);

  currentY += 8;
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Service", 14, currentY);
  doc.text("Category", 65, currentY);
  doc.text("Frequency", 110, currentY);
  doc.text("Cost", 140, currentY);
  doc.text("Action Status", 170, currentY);

  currentY += 3;
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  audit.subscriptions.forEach((sub) => {
    if (currentY > 275) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.text(sub.normalizedBrand, 14, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(sub.category.substring(0, 22), 65, currentY);
    doc.text(sub.billingFrequency, 110, currentY);
    doc.text(formatCurrency(sub.amount), 140, currentY);

    if (sub.action === "flag-to-cancel") {
      doc.setTextColor(239, 68, 68); // Red
      doc.text("Flagged to Cancel", 170, currentY);
    } else if (sub.action === "cancelled") {
      doc.setTextColor(100, 116, 139);
      doc.text("Cancelled", 170, currentY);
    } else {
      doc.setTextColor(16, 185, 129);
      doc.text("Keep", 170, currentY);
    }
    doc.setTextColor(30, 41, 59);

    currentY += 8;
  });

  // Footer Disclaimer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "SubSense Audit Report — Privacy-first financial clarity. No bank credentials stored.",
      14,
      doc.internal.pageSize.getHeight() - 10
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 14,
      doc.internal.pageSize.getHeight() - 10,
      { align: "right" }
    );
  }

  doc.save(`SubSense-Audit-${new Date().toISOString().split("T")[0]}.pdf`);
}
