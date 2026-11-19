"use client";

import { useState } from "react";
import {
  X,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Mail,
  ShieldCheck,
  PhoneCall,
  Clock,
} from "lucide-react";
import { ParsedSubscription, SubscriptionAction } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface CancellationModalProps {
  subscription: ParsedSubscription;
  onClose: () => void;
  onActionUpdated: (action: SubscriptionAction) => void;
}

export function CancellationModal({
  subscription,
  onClose,
  onActionUpdated,
}: CancellationModalProps) {
  const [copied, setCopied] = useState(false);
  const guide = subscription.cancellationGuide;

  const handleCopyEmail = () => {
    if (guide.emailTemplate) {
      navigator.clipboard.writeText(
        `Subject: ${guide.emailTemplate.subject}\n\n${guide.emailTemplate.body}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                How to Cancel: {subscription.normalizedBrand}
              </h2>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                Difficulty: {guide.difficulty}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Current recurring cost: <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(subscription.amount, subscription.currency)}</strong> / {subscription.billingFrequency} ({formatCurrency(subscription.annualizedCost)} annualized)
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Warning Callouts */}
        {guide.warnings && guide.warnings.length > 0 && (
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
              <AlertTriangle className="h-4 w-4" />
              <span>Important Cancellation Notice</span>
            </div>
            {guide.warnings.map((w, i) => (
              <p key={i} className="text-xs text-amber-900 dark:text-amber-200">
                • {w}
              </p>
            ))}
          </div>
        )}

        {/* Step by Step Guide */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            Official Cancellation Steps
          </h3>
          <ol className="space-y-3">
            {guide.steps.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {index + 1}
                </span>
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Official Cancellation URL Button */}
        {guide.officialUrl && (
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Direct Official Link</h4>
              <p className="text-[11px] text-slate-500">
                Goes directly to the authenticated account management portal.
              </p>
            </div>
            <a
              href={guide.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm shrink-0"
            >
              Open Official Portal
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        {/* Email Template */}
        {guide.emailTemplate && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span>Ready-to-Use Email Template</span>
              </h3>
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied to clipboard!" : "Copy Template"}</span>
              </button>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
              <span className="text-slate-400">Subject: {guide.emailTemplate.subject}</span>
              {"\n\n"}
              {guide.emailTemplate.body}
            </div>
          </div>
        )}

        {/* Modal Action Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onActionUpdated("flag-to-cancel");
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              Flag to Cancel
            </button>
            <button
              onClick={() => {
                onActionUpdated("cancelled");
                onClose();
              }}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Mark Already Cancelled
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
