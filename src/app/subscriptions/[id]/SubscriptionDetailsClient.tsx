"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  Layers,
  ShieldCheck,
  ExternalLink,
  History,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { getLatestAuditFromDB, updateSubscriptionActionInDB } from "@/lib/storage/indexedDb";
import { ParsedSubscription, SubscriptionAction, Transaction } from "@/types";
import { CancellationModal } from "@/components/cancellation/CancellationModal";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function SubscriptionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [sub, setSub] = useState<ParsedSubscription | null>(null);
  const [auditId, setAuditId] = useState<string>("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const audit = await getLatestAuditFromDB();
    if (audit) {
      setAuditId(audit.auditId);
      const found = audit.subscriptions.find((s) => s.id === id);
      if (found) setSub(found);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAction = async (action: SubscriptionAction) => {
    if (!sub || !auditId) return;
    const updated = await updateSubscriptionActionInDB(auditId, sub.id, action);
    if (updated) {
      const refreshed = updated.subscriptions.find((s) => s.id === sub.id);
      if (refreshed) setSub(refreshed);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="mx-auto max-w-4xl py-16 px-4 text-center">
        <h2 className="text-xl font-bold">Subscription not found</h2>
        <p className="text-slate-500 mt-2">Could not find subscription records for ID: {id}</p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight">{sub.normalizedBrand}</h1>
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {sub.category}
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">Raw Merchant: {sub.merchant}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCancelModalOpen(true)}
            className="rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900 px-4 py-2 text-sm font-semibold hover:bg-rose-100 transition"
          >
            Cancellation Guide
          </button>
          <select
            value={sub.action}
            onChange={(e) => handleAction(e.target.value as SubscriptionAction)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium"
          >
            <option value="keep">Action: Keep</option>
            <option value="review">Action: Review</option>
            <option value="flag-to-cancel">Action: Flag to Cancel</option>
            <option value="cancelled">Action: Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Recurring Cost</div>
          <div className="text-2xl font-bold mt-1">
            {formatCurrency(sub.amount, sub.currency)} <span className="text-xs font-normal text-slate-400">/ {sub.billingFrequency}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Annualized Spend</div>
          <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
            {formatCurrency(sub.annualizedCost, sub.currency)} <span className="text-xs font-normal text-slate-400">/ year</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Detection Confidence</div>
          <div className="text-2xl font-bold mt-1">
            {Math.round(sub.confidenceScore * 100)}%
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Next Renewal Date</div>
          <div className="text-2xl font-bold mt-1">
            {sub.nextRenewalDate ? formatDate(sub.nextRenewalDate) : "N/A"}
          </div>
        </div>
      </div>

      {sub.priceAnomaly?.hasAnomaly && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 mb-8 flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-200">Price Increase Detected</h3>
            <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
              Previous charge: {formatCurrency(sub.priceAnomaly.previousAmount || 0, sub.currency)} → Current: {formatCurrency(sub.priceAnomaly.currentAmount || 0, sub.currency)} (+{sub.priceAnomaly.percentageChange?.toFixed(1)}%)
            </p>
          </div>
        </div>
      )}

      {sub.duplicateInfo && (
        <div className="rounded-xl border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/30 p-5 mb-8 flex items-start gap-3">
          <Layers className="h-6 w-6 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sky-900 dark:text-sky-200">Potential Duplicate Service</h3>
            <p className="text-sm text-sky-800 dark:text-sky-300 mt-1">
              {sub.duplicateInfo.reason}
            </p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-slate-400" />
          Transaction History ({sub.transactions?.length || 0} charges)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sub.transactions?.map((tx: Transaction) => (
                <tr key={tx.id}>
                  <td className="py-3 px-4">{formatDate(tx.date)}</td>
                  <td className="py-3 px-4 font-mono text-xs">{tx.rawDescription}</td>
                  <td className="py-3 px-4 text-right font-medium">{formatCurrency(tx.amount, tx.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCancelModalOpen && (
        <CancellationModal
          subscription={sub}
          onClose={() => setIsCancelModalOpen(false)}
          onActionUpdated={(newAction) => handleAction(newAction)}
        />
      )}
    </div>
  );
}
