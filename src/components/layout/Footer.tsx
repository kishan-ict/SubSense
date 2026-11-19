"use client";

import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-1">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Sub<span className="text-emerald-500">Sense</span>
            </span>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Stop paying for what you don&apos;t use. AI-powered subscription intelligence and recurring expense auditing with zero bank credential requirements.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>Local-First & Privacy Guaranteed</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/upload" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Upload Statement
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Audit Dashboard
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Financial Reports
                </Link>
              </li>
              <li>
                <Link href="/upload?demo=true" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Explore Live Demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Privacy & Security
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Zero-Knowledge Guarantee
                </Link>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500">No Plaid or Banking Logins</span>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500">IndexedDB Local Storage</span>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500">CSV Formula Injection Guard</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Supported Formats
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Supports CSV exports & bank statement documents from Chase, Bank of America, Wells Fargo, Citi, Amex, Capital One, Revolut, Monzo, and more.
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300">
                .CSV
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300">
                .PDF
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {currentYear} SubSense. Built for conscious financial freedom.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Engineered with privacy and precision
          </p>
        </div>
      </div>
    </footer>
  );
}
