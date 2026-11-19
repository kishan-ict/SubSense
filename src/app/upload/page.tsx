"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Lock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { SAMPLE_TRANSACTIONS, SAMPLE_CSV_CONTENT } from "@/lib/mockData";
import { parseCSVStatement } from "@/lib/parser/csvParser";
import { parseBankStatementText } from "@/lib/parser/pdfParser";
import { analyzeTransactions } from "@/lib/analysis/detector";
import { saveAuditToDB } from "@/lib/storage/indexedDb";
import { Transaction } from "@/types";

function UploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemoRequested = searchParams.get("demo") === "true";

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progressStatus, setProgressStatus] = useState<string>("");



  const loadSampleDataset = async () => {
    setErrorMessage(null);
    setIsProcessing(true);
    setProgressStatus("Loading verified 38-transaction multi-vendor sample dataset...");

    try {
      const auditResult = analyzeTransactions(SAMPLE_TRANSACTIONS);
      auditResult.fileName = "Sample_Statement_Demo.csv";

      await saveAuditToDB(auditResult);
      setProgressStatus("Audit ready! Launching dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load sample dataset.";
      setErrorMessage(msg);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isDemoRequested) {
      loadSampleDataset();
    }
  }, [isDemoRequested]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (file: File) => {
    setErrorMessage(null);

    // Validation: File size limit 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage("File exceeds the 10 MB size limit. Please upload a smaller statement.");
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension !== "csv" && extension !== "pdf" && extension !== "txt") {
      setErrorMessage("Unsupported file type. Please upload a bank statement in .CSV or .PDF format.");
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);
    setProgressStatus("Reading statement file...");

    try {
      let extractedTransactions: Transaction[] = [];

      if (extension === "csv") {
        setProgressStatus("Parsing CSV transactions & dates...");
        const text = await file.text();
        const { transactions, errors } = parseCSVStatement(text);
        if (errors.length > 0 && transactions.length === 0) {
          throw new Error(errors[0]);
        }
        extractedTransactions = transactions;
      } else if (extension === "pdf" || extension === "txt") {
        setProgressStatus("Extracting textual transaction records...");
        const text = await file.text();
        const { transactions, errors } = parseBankStatementText(text);
        if (transactions.length === 0) {
          throw new Error(errors[0] || "Could not detect tabular transaction rows in PDF text.");
        }
        extractedTransactions = transactions;
      }

      if (extractedTransactions.length === 0) {
        throw new Error("No valid transactions found. Make sure your statement includes Date, Description, and Amount columns.");
      }

      setProgressStatus(`Analyzing ${extractedTransactions.length} transactions for recurring cadences & price increases...`);
      // Run deterministic analysis
      const auditResult = analyzeTransactions(extractedTransactions);
      auditResult.fileName = file.name;

      setProgressStatus("Storing encrypted audit result in local IndexedDB...");
      await saveAuditToDB(auditResult);

      setProgressStatus("Audit complete! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process bank statement.";
      setErrorMessage(msg);
      setIsProcessing(false);
    }
  };



  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40 text-xs font-semibold mb-3">
          <Lock className="h-3 w-3" />
          <span>Privacy Guaranteed: Zero Third-Party Bank Logins</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Upload Your Statement
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Drop in a bank or credit card export (.csv or text-based .pdf). Transactions are parsed client-side and saved into your browser&apos;s local IndexedDB.
        </p>
      </div>

      {/* Main Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
          isDragging
            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 scale-[1.01]"
            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-slate-400 dark:hover:border-slate-600"
        }`}
      >
        <input
          type="file"
          id="statement-file-input"
          accept=".csv,.pdf,.txt"
          onChange={handleFileInputChange}
          disabled={isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
            <UploadCloud className="h-8 w-8" />
          </div>

          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              {selectedFile ? selectedFile.name : "Drag & drop your statement here, or click to browse"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports CSV, PDF bank statements up to 10 MB
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
              CSV Format
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4 text-teal-500" />
              Text-based PDF
            </span>
          </div>
        </div>
      </div>

      {/* Processing State Feedback */}
      {isProcessing && (
        <div className="mt-6 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 flex items-center gap-3">
          <RefreshCw className="h-5 w-5 text-emerald-600 dark:text-emerald-400 animate-spin" />
          <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            {progressStatus}
          </span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-6 p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/30 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">Statement Processing Error</h4>
            <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Instant Demo Option */}
      <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 text-white shadow-xl gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h3 className="font-bold text-base text-white">Don&apos;t have a statement handy?</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-md">
              Load our comprehensive 38-transaction benchmark dataset containing Netflix, Spotify with a hidden price hike, Google One + Dropbox duplicate cloud storage, fitness dues, and Amazon Prime.
            </p>
          </div>
          <button
            onClick={loadSampleDataset}
            disabled={isProcessing}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition-all active:scale-95 disabled:opacity-50"
          >
            Try with Sample Data
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Privacy Architecture Notice */}
      <div className="mt-8 rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/40 text-xs text-slate-600 dark:text-slate-400 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <Lock className="h-4 w-4 text-emerald-500" />
          <span>How your financial data is handled:</span>
        </div>
        <p>
          • <strong>Local-first processing:</strong> CSV and PDF files are parsed directly inside your browser. Transactions are stored inside your browser&apos;s IndexedDB sandbox.
        </p>
        <p>
          • <strong>Zero Cloud Leaks:</strong> We never store or forward your full bank statements. Optional AI normalization only transmits anonymous merchant labels (e.g. &quot;SPOTIFY USA&quot;), never account balances or card numbers.
        </p>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-500">
          Loading Statement Uploader...
        </div>
      }
    >
      <UploadContent />
    </Suspense>
  );
}

