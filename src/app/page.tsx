"use client";

import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CopyCheck,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Zap,
  Lock,
  Search,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/30 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-8 backdrop-blur-sm shadow-sm animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Zero Bank Connections. Zero Account Tracking. 100% Private.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.12]">
            Stop Paying for What You{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
              Don&apos;t Use.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Discover forgotten subscriptions, catch stealthy price increases, uncover duplicate cloud services, and reclaim hundreds of dollars — without ever connecting your bank login.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/upload"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 hover:shadow-emerald-500/35 transition-all active:scale-98"
            >
              Audit My Expenses
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/upload?demo=true"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 dark:border-slate-700 dark:bg-slate-900/80 px-8 py-4 text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 backdrop-blur-sm transition-all"
            >
              Explore Live Demo
              <Zap className="h-4 w-4 text-amber-500" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>No Registration Required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Bank Statement CSV & PDF Support</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Instant Cancellation Guides</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-16 mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-3 shadow-2xl backdrop-blur-md">
            <div className="rounded-xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-slate-900 text-slate-100 p-6 sm:p-8">
              {/* Preview Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div>
                  <span className="text-xs uppercase font-mono tracking-wider text-emerald-400">SubSense Live Audit Preview</span>
                  <h3 className="text-xl font-bold text-white mt-1">Financial Intelligence Overview</h3>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    $1,428.88 / yr Total Run-rate
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                    $384.00 Potential Savings
                  </span>
                </div>
              </div>

              {/* Sample Subscriptions Rows */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      S
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">Spotify USA</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Price Hike +9.1%
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">Entertainment • Increased from $10.99 to $11.99</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">$11.99 / mo</span>
                    <span className="block text-[11px] text-slate-400">Next renewal Nov 3</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-950 flex items-center justify-center text-blue-400 font-bold text-sm">
                      D
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">Dropbox Plus</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          Duplicate with Google One
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">Cloud Storage • $143.88/yr</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">$11.99 / mo</span>
                    <span className="block text-[11px] text-red-400">Flagged to Cancel</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-red-950 flex items-center justify-center text-red-400 font-bold text-sm">
                      A
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white">Adobe Creative Cloud</span>
                      <span className="block text-xs text-slate-400">Software & Productivity • $659.88/yr</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">$54.99 / mo</span>
                    <span className="block text-[11px] text-emerald-400">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features & Value Pillars */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
              Autonomous Intelligence
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Everything You Need to Take Back Control of Your Bank Statement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-8 bg-slate-50/50 dark:bg-slate-950/40 hover:border-emerald-500/40 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Price Hike Detection</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Services quietly increase subscription rates by $1 to $5 without obvious notification. SubSense compares historical cycles and flags stealth fee increases immediately.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-8 bg-slate-50/50 dark:bg-slate-950/40 hover:border-emerald-500/40 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                <CopyCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Duplicate Service Audit</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Are you paying for Google One, Dropbox, and iCloud simultaneously? Or two active accounts with the same provider? SubSense highlights overlapping software categories.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-8 bg-slate-50/50 dark:bg-slate-950/40 hover:border-emerald-500/40 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Instant Cancellation Guides</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Direct official links, verified cancellation procedures, fee alerts, and ready-to-copy email templates to terminate services without getting stuck on dark-pattern cancellation mazes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
              Three Simple Steps
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Audit in Seconds Without Handing Over Credentials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-4xl font-black text-slate-200 dark:text-slate-800 mb-4">01</div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Export Statement</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Download a regular CSV or PDF statement from your banking portal or credit card provider.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-4xl font-black text-slate-200 dark:text-slate-800 mb-4">02</div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Instant Local Audit</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                SubSense parses transactions, cleans merchant noise, correlates cadences, and computes annual run-rates.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-4xl font-black text-slate-200 dark:text-slate-800 mb-4">03</div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Cancel & Save</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Flag unwanted services, copy customized cancellation templates, and export clean executive reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-950/40">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                Why don&apos;t you ask for my bank login (Plaid / MX)?
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Traditional subscription apps require linking your bank credentials, giving third parties continuous access to your transaction records and account balances. SubSense was built for privacy: you simply drop in a statement document when you want an audit, and it processes locally.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-950/40">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                Does SubSense automatically cancel subscriptions for me?
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No — and beware of services claiming they can cancel everything on your behalf. Most modern vendors require authenticated self-service cancellation, multi-factor verification, or account-specific confirmation. SubSense gives you direct links, exact step-by-step instructions, and ready-to-use cancellation email templates.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-950/40">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                How are ordinary one-time purchases distinguished from subscriptions?
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                SubSense examines transaction cadence, date intervals (weekly, monthly, quarterly, annual), repeated charge amounts, and verified subscription merchant patterns. Isolated or one-time debit charges (like Target, Starbucks, or utility balances) are not classified as subscriptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-tr from-slate-900 to-slate-950 text-white border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to find out how much you&apos;re wasting?
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
            Try the demo dataset or drop in your bank statement. Complete clarity in under 30 seconds.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/upload"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 text-base font-semibold text-slate-950 shadow-md hover:bg-emerald-400 transition-all active:scale-95"
            >
              Start Free Expense Audit
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/upload?demo=true"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-8 py-3.5 text-base font-semibold text-white hover:bg-slate-700 transition-all"
            >
              Try with Sample Data
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
