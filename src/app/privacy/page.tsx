import Link from "next/link";
import { Shield, Lock, EyeOff, Database, Server, Key, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-emerald-500" />
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Zero-Knowledge Privacy Architecture
          </h1>
        </div>
        <p className="text-sm text-slate-500 mt-2">
          SubSense was engineered from day one on the principle that financial audits should never require handing over bank passwords or continuous banking access.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <Lock className="h-4 w-4" />
            <span>1. No Third-Party Bank Account Linking</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We intentionally do not use services like Plaid, Yodlee, or MX to link bank accounts. You never authenticate your checking, savings, or credit accounts to SubSense. You remain completely in control of the documents you provide.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
            <Database className="h-4 w-4" />
            <span>2. Local-First Browser Sandbox (IndexedDB)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Your transactions and parsed subscriptions are persisted inside your browser&apos;s sandboxed IndexedDB storage. Your financial history stays on your machine and is never sold, brokered, or monetized.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
            <EyeOff className="h-4 w-4" />
            <span>3. Zero Transmission of Sensitive Identifiers</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Full bank statements are never uploaded to Gemini or third-party AI providers. When optional AI normalization is enabled, only isolated merchant strings (e.g. &apos;SPOTIFY USA&apos;) are evaluated. Account numbers, routing numbers, and personal names are excluded.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <Key className="h-4 w-4" />
            <span>4. CSV Formula Injection Defense</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            When exporting audits to CSV, all fields are scrutinized for dangerous prefix characters (<code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">=, +, -, @</code>). Special characters are properly escaped to protect against spreadsheet formula execution exploits in Excel and Google Sheets.
          </p>
        </div>
      </div>
    </div>
  );
}
