"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, PieChart, UploadCloud, FileText, Lock } from "lucide-react";
import { Suspense } from "react";

function NavLinks() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/upload", label: "Upload Statement", icon: UploadCloud },
    { href: "/dashboard", label: "Audit Dashboard", icon: PieChart },
    { href: "/reports", label: "Reports & Exports", icon: FileText },
    { href: "/privacy", label: "Zero-Knowledge Privacy", icon: FileText },
  ];

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900"
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? "text-emerald-500" : "text-slate-400"}`} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Sub<span className="text-emerald-500">Sense</span>
            </span>
            <span className="text-[10px] font-medium tracking-wider uppercase text-slate-400 dark:text-slate-500 -mt-1">
              Expense Auditor
            </span>
          </div>
        </Link>

        {/* Navigation links inside Suspense */}
        <Suspense fallback={<div className="hidden md:flex w-64 h-8" />}>
          <NavLinks />
        </Suspense>

        {/* Action Button & Privacy Pill */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-medium">
            <Lock className="h-3 w-3" />
            <span>No Bank Linking</span>
          </div>

          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all active:scale-95"
          >
            Audit Expenses
          </Link>
        </div>
      </div>
    </header>
  );
}
