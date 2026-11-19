"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { AuditResult } from "@/types";
import { getLatestAuditFromDB } from "@/lib/storage/indexedDb";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  exportSubscriptionsToCSV,
  triggerFileDownload,
  generateAuditPdfReport,
} from "@/lib/export/reportGenerator";

export default function ReportsPage() {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAudit = async () => {
    setLoading(true);
    const existing = await getLatestAuditFromDB();
    if (existing) {
      setAudit(existing);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAudit();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading financial audit records...
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-xl mx-auto text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Audit Available for Export</h2>
        <p className="text-sm text-slate-500 mt-2">
          Please audit your statement or load demo data first.
        </p>
        <Link
          href="/upload?demo=true"
          className="mt-6 inline-flex items-center px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          Load Demo Audit
        </Link>
      </div>
    );
  }

  const flaggedSubs = audit.subscriptions.filter((s) => s.action === "flag-to-cancel");

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Financial Audit & Reports
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Export sanitized CSV spreadsheets or download printable executive PDF reports. Formula injection protection is built-in.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
            Total Monthly Spend
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrency(audit.summary.totalMonthlySpend)}
          </div>
          <span className="text-xs text-slate-400">
            {audit.summary.activeSubscriptionsCount} detected recurring services
          </span>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
            Projected Annual Expense
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrency(audit.summary.projectedAnnualSpend)}
          </div>
          <span className="text-xs text-slate-400">12-month recurring commitment</span>
        </div>

        <div className="p-6 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30">
          <span className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400 block mb-1">
            Estimated Annual Savings
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(audit.summary.potentialAnnualSavings)}
          </div>
          <span className="text-xs text-emerald-800/80 dark:text-emerald-400/80 font-medium">
            From {audit.summary.flaggedSubscriptionsCount} flagged cancellation(s)
          </span>
        </div>
      </div>

      {/* Export Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="h-10 w-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Executive PDF Report
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Clean printable PDF summary featuring your monthly run-rate, active recurring services, detected price hikes, and potential savings.
            </p>
          </div>
          <button
            onClick={() => generateAuditPdfReport(audit)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all active:scale-98 shadow-sm"
          >
            <Download className="h-4 w-4" />
            Download PDF Report
          </button>
        </div>

        {/* CSV Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Complete CSV Spreadsheet
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Export all detected subscriptions into a structured spreadsheet. Protected against spreadsheet formula injection (=, +, -, @ prefix sanitization).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                const csv = exportSubscriptionsToCSV(audit.subscriptions);
                triggerFileDownload(csv, `SubSense-All-Subscriptions-${new Date().toISOString().split("T")[0]}.csv`);
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="h-4 w-4 text-emerald-500" />
              All Subscriptions ({audit.subscriptions.length})
            </button>
            {flaggedSubs.length > 0 && (
              <button
                onClick={() => {
                  const csv = exportSubscriptionsToCSV(flaggedSubs);
                  triggerFileDownload(csv, `SubSense-Flagged-To-Cancel-${new Date().toISOString().split("T")[0]}.csv`);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
              >
                <Download className="h-4 w-4" />
                Flagged Only ({flaggedSubs.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
