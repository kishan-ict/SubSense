"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  ExternalLink,
  Info,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import {
  AuditResult,
  ParsedSubscription,
  SubscriptionAction,
  SubscriptionCategory,
} from "@/types";
import {
  getLatestAuditFromDB,
  updateSubscriptionActionInDB,
  clearAllLocalAudits,
  saveAuditToDB,
} from "@/lib/storage/indexedDb";
import { SAMPLE_TRANSACTIONS } from "@/lib/mockData";
import { analyzeTransactions } from "@/lib/analysis/detector";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CancellationModal } from "@/components/cancellation/CancellationModal";
import { exportSubscriptionsToCSV, triggerFileDownload, generateAuditPdfReport } from "@/lib/export/reportGenerator";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSubForGuide, setSelectedSubForGuide] = useState<ParsedSubscription | null>(null);
  const [isUpdatingAction, setIsUpdatingAction] = useState(false);

  const loadAudit = async () => {
    setLoading(true);
    const existing = await getLatestAuditFromDB();
    if (existing) {
      setAudit(existing);
    } else {
      // Auto-load sample dataset if no prior audit exists
      const demo = analyzeTransactions(SAMPLE_TRANSACTIONS);
      demo.fileName = "Sample_Statement_Demo.csv";
      await saveAuditToDB(demo);
      setAudit(demo);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAudit();
  }, []);

  const handleActionChange = async (subId: string, newAction: SubscriptionAction) => {
    if (!audit) return;
    setIsUpdatingAction(true);
    const updated = await updateSubscriptionActionInDB(audit.auditId, subId, newAction);
    if (updated) {
      setAudit({ ...updated });
    }
    setIsUpdatingAction(false);
  };

  const handleClearAudit = async () => {
    if (confirm("Are you sure you want to clear this audit and remove local records?")) {
      await clearAllLocalAudits();
      setAudit(null);
    }
  };

  const handleResetToDemo = async () => {
    setLoading(true);
    const demo = analyzeTransactions(SAMPLE_TRANSACTIONS);
    demo.fileName = "Sample_Statement_Demo.csv";
    await saveAuditToDB(demo);
    setAudit(demo);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-sm font-medium">Loading Financial Audit...</p>
        </div>
      </div>
    );
  }

  if (!audit || audit.subscriptions.length === 0) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-xl mx-auto text-center">
        <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <Info className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Statement Audited Yet</h2>
          <p className="text-sm text-slate-500 mt-2">
            Upload your bank statement or load our sample dataset to view detected subscriptions.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500"
            >
              Upload Statement
            </Link>
            <button
              onClick={handleResetToDemo}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Load Sample Dataset
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter subscriptions
  const filteredSubscriptions = audit.subscriptions.filter((sub) => {
    const matchesSearch =
      sub.normalizedBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "all" || sub.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "hike" && sub.priceAnomaly?.hasAnomaly) ||
      (statusFilter === "duplicate" && sub.duplicateInfo?.isDuplicate) ||
      (statusFilter === "flagged" && sub.action === "flag-to-cancel") ||
      (statusFilter === "keep" && sub.action === "keep");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner & Audit Meta */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Subscription & Expense Audit
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              Live Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Source: <strong className="text-slate-700 dark:text-slate-300">{audit.fileName || "Bank Statement"}</strong> • Processed {audit.totalTransactionsProcessed} transactions on {formatDate(audit.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const csv = exportSubscriptionsToCSV(audit.subscriptions);
              triggerFileDownload(csv, `SubSense-Subscriptions-${new Date().toISOString().split("T")[0]}.csv`);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-emerald-500" />
            CSV Export
          </button>

          <button
            onClick={() => generateAuditPdfReport(audit)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-teal-500" />
            PDF Report
          </button>

          <button
            onClick={handleResetToDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Reload verified sample dataset"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Demo
          </button>

          <button
            onClick={handleClearAudit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/60 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Clear stored audit data"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Monthly */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Monthly Recurring Spend</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrency(audit.summary.totalMonthlySpend)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Calculated across {audit.summary.activeSubscriptionsCount} detected recurring services
          </span>
        </div>

        {/* Card 2: Projected Annual */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Projected Annual Run-Rate</span>
            <Calendar className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrency(audit.summary.projectedAnnualSpend)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Includes both monthly and annual commitment terms
          </span>
        </div>

        {/* Card 3: Potential Annual Savings */}
        <div className="p-6 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/30 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Potential Annual Savings</span>
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(audit.summary.potentialAnnualSavings)}
          </div>
          <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 block mt-1 font-medium">
            {audit.summary.flaggedSubscriptionsCount} subscription(s) marked for cancellation
          </span>
        </div>

        {/* Card 4: Detected Anomalies */}
        <div className="p-6 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 shadow-sm">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Identified Anomalies</span>
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-400">
            {audit.summary.priceHikesCount + audit.summary.duplicateServicesCount}
          </div>
          <span className="text-[11px] text-amber-800/80 dark:text-amber-400/80 block mt-1 font-medium">
            {audit.summary.priceHikesCount} price hike(s), {audit.summary.duplicateServicesCount} duplicate cluster(s)
          </span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Pie Chart */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4">
            Spending by Category
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={audit.categoryBreakdown}
                  dataKey="monthlyAmount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={3}
                >
                  {audit.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || "#06b6d4"} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: unknown) => formatCurrency(Number(val || 0))}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {audit.categoryBreakdown.map((c) => (
              <span key={c.category} className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-slate-600 dark:text-slate-300">{c.category}:</span>
                <strong className="text-slate-900 dark:text-white">{formatCurrency(c.monthlyAmount)}</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Upcoming Renewals Timeline */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4">
            Upcoming Renewal Schedule
          </h3>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {audit.upcomingRenewals.slice(0, 6).map((renewal) => (
              <div
                key={renewal.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
              >
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {renewal.normalizedBrand}
                  </h4>
                  <span className="text-xs text-slate-500">
                    Renews on {formatDate(renewal.renewalDate)} ({renewal.daysRemaining > 0 ? `in ${renewal.daysRemaining} days` : "due today"})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {formatCurrency(renewal.amount, renewal.currency)}
                  </span>
                  <span
                    className={`block text-[10px] font-semibold uppercase ${
                      renewal.action === "flag-to-cancel" ? "text-red-500" : "text-emerald-500"
                    }`}
                  >
                    {renewal.action === "flag-to-cancel" ? "Flagged to Cancel" : "Active Plan"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription Table Filters & Search */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by brand, merchant, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Categories</option>
              {audit.categoryBreakdown.map((c) => (
                <option key={c.category} value={c.category}>
                  {c.category}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Items</option>
              <option value="hike">Price Hikes Only</option>
              <option value="duplicate">Duplicates Only</option>
              <option value="flagged">Flagged to Cancel</option>
              <option value="keep">Keep</option>
            </select>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="pb-3 pr-4">Brand / Merchant</th>
                <th className="pb-3 px-4">Category</th>
                <th className="pb-3 px-4">Amount / Freq</th>
                <th className="pb-3 px-4">Next Renewal</th>
                <th className="pb-3 px-4">Anomalies</th>
                <th className="pb-3 px-4">Action</th>
                <th className="pb-3 pl-4 text-right">Guide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSubscriptions.map((sub) => {
                return (
                  <tr key={sub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                    {/* Merchant & Brand */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {sub.normalizedBrand.charAt(0)}
                        </div>
                        <div>
                          <Link
                            href={`/subscriptions/${sub.id}`}
                            className="font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 group"
                          >
                            <span>{sub.normalizedBrand}</span>
                            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <span className="block text-xs text-slate-400 max-w-xs truncate" title={sub.merchant}>
                            {sub.merchant}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                      {sub.category}
                    </td>

                    {/* Amount & Frequency */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(sub.amount, sub.currency)}
                      </div>
                      <span className="text-[11px] text-slate-400 capitalize">
                        {sub.billingFrequency} ({formatCurrency(sub.annualizedCost)}/yr)
                      </span>
                    </td>

                    {/* Next Renewal */}
                    <td className="py-4 px-4 text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {formatDate(sub.nextRenewalDate)}
                      </span>
                    </td>

                    {/* Anomalies / Flags */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        {sub.priceAnomaly?.hasAnomaly && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <TrendingUp className="h-3 w-3" />
                            +{sub.priceAnomaly.percentageChange}% Hike
                          </span>
                        )}
                        {sub.duplicateInfo?.isDuplicate && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            <Layers className="h-3 w-3" />
                            Duplicate Service
                          </span>
                        )}
                        {!sub.priceAnomaly?.hasAnomaly && !sub.duplicateInfo?.isDuplicate && (
                          <span className="text-[11px] text-slate-400">Standard</span>
                        )}
                      </div>
                    </td>

                    {/* Action Selector */}
                    <td className="py-4 px-4">
                      <select
                        value={sub.action}
                        disabled={isUpdatingAction}
                        onChange={(e) => handleActionChange(sub.id, e.target.value as SubscriptionAction)}
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border transition-colors ${
                          sub.action === "flag-to-cancel"
                            ? "bg-red-50 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
                            : sub.action === "cancelled"
                            ? "bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-800 dark:text-slate-400"
                            : "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                        }`}
                      >
                        <option value="keep">Keep</option>
                        <option value="flag-to-cancel">Flag to Cancel</option>
                        <option value="review">Review Needed</option>
                        <option value="cancelled">Mark Cancelled</option>
                      </select>
                    </td>

                    {/* Guide Modal Trigger */}
                    <td className="py-4 pl-4 text-right">
                      <button
                        onClick={() => setSelectedSubForGuide(sub)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 hover:underline"
                      >
                        <span>Cancel Guide</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancellation Drawer / Modal */}
      {selectedSubForGuide && (
        <CancellationModal
          subscription={selectedSubForGuide}
          onClose={() => setSelectedSubForGuide(null)}
          onActionUpdated={(newAction) => handleActionChange(selectedSubForGuide.id, newAction)}
        />
      )}
    </div>
  );
}
