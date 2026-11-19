import Papa from "papaparse";
import { Transaction } from "@/types";
import { normalizeMerchant } from "./normalizer";

const DATE_COLUMN_NAMES = ["date", "transaction date", "posted date", "trans date", "activity date", "booking date", "time"];
const DESC_COLUMN_NAMES = [
  "transaction description",
  "description",
  "memo",
  "details",
  "narrative",
  "payee",
  "merchant",
  "name",
  "particulars",
  "remarks",
  "remark"
];
const AMOUNT_COLUMN_NAMES = ["amount", "debit", "charge", "debit amount", "paid out", "sum", "spent", "withdrawal", "dr amount"];
const TYPE_COLUMN_NAMES = ["type", "transaction type", "cr/dr", "credit/debit", "d/c", "dr/cr"];

function findMatchingKey(keys: string[], candidates: string[], fallbackIndex: number): string {
  const cleanKeys = keys.map((k) => ({ original: k, clean: k.trim().toLowerCase() }));

  // 1. Exact match
  for (const candidate of candidates) {
    const found = cleanKeys.find((k) => k.clean === candidate);
    if (found) return found.original;
  }

  // 2. Contains match (e.g. "Amount (INR)" contains "amount", "Transaction Description" contains "description")
  for (const candidate of candidates) {
    const found = cleanKeys.find((k) => k.clean.includes(candidate));
    if (found) return found.original;
  }

  return keys[fallbackIndex] || keys[0] || "";
}

export function parseCSVStatement(csvString: string): { transactions: Transaction[]; errors: string[] } {
  const errors: string[] = [];
  const parsed = Papa.parse<Record<string, string>>(csvString.trim(), {
    header: true,
    skipEmptyLines: "greedy",
  });

  if (parsed.errors && parsed.errors.length > 0) {
    errors.push(...parsed.errors.map((e) => `CSV Row ${e.row}: ${e.message}`));
  }

  const rows = parsed.data;
  if (!rows || rows.length === 0) {
    return { transactions: [], errors: ["CSV file is empty or could not be parsed."] };
  }

  // Detect header keys dynamically
  const sampleRow = rows[0];
  const keys = Object.keys(sampleRow);

  const dateKey = findMatchingKey(keys, DATE_COLUMN_NAMES, 0);
  const descKey = findMatchingKey(keys, DESC_COLUMN_NAMES, 1);
  const amountKey = findMatchingKey(keys, AMOUNT_COLUMN_NAMES, 2);
  
  // Type key should only match if explicitly found, no automatic fallback
  const cleanKeys = keys.map((k) => ({ original: k, clean: k.trim().toLowerCase() }));
  const typeKey =
    cleanKeys.find((k) => TYPE_COLUMN_NAMES.some((t) => k.clean === t || (k.clean.includes(t) && !k.clean.includes("amount"))))?.original ||
    null;

  // Detect currency from header like "Amount (INR)" or "Amount ($)"
  let detectedCurrency = "USD";
  if (amountKey.includes("INR") || /inr|₹/i.test(csvString.slice(0, 500))) {
    detectedCurrency = "INR";
  } else if (amountKey.includes("EUR") || /eur|€/i.test(csvString.slice(0, 500))) {
    detectedCurrency = "EUR";
  } else if (amountKey.includes("GBP") || /gbp|£/i.test(csvString.slice(0, 500))) {
    detectedCurrency = "GBP";
  }

  const transactions: Transaction[] = [];

  rows.forEach((row, index) => {
    const rawDate = row[dateKey];
    const rawDesc = row[descKey];
    const rawAmount = row[amountKey];

    if (!rawDate || !rawDesc || !rawAmount) return;

    // Parse date
    const parsedDate = standardizeDate(rawDate);
    if (!parsedDate) return;

    // Clean amount
    const rawAmountStr = String(rawAmount).trim();
    const isNegative = rawAmountStr.startsWith("-") || rawAmountStr.startsWith("(") || rawAmountStr.includes("DR");
    const isExplicitCredit = rawAmountStr.startsWith("+") || rawAmountStr.includes("CR");
    const numClean = rawAmountStr.replace(/[^0-9.-]+/g, "");
    const absVal = Math.abs(parseFloat(numClean));

    if (isNaN(absVal) || absVal === 0) return;

    let txType: "debit" | "credit" = "debit";
    if (typeKey && row[typeKey]) {
      const t = row[typeKey].toLowerCase();
      if (t.includes("credit") || t.includes("cr") || t.includes("refund") || t.includes("dep")) {
        txType = "credit";
      }
    } else if (isExplicitCredit && !isNegative) {
      txType = "credit";
    }

    const norm = normalizeMerchant(rawDesc);

    transactions.push({
      id: `tx-csv-${index}-${Date.now()}`,
      date: parsedDate,
      rawDescription: rawDesc,
      cleanMerchant: norm.cleanMerchant,
      amount: Number(absVal.toFixed(2)),
      type: txType,
      currency: detectedCurrency,
    });
  });

  return { transactions, errors };
}

export function standardizeDate(dateStr: string): string | null {
  const trimmed = dateStr.trim();
  // Case: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  // Case: MM/DD/YYYY or M/D/YYYY
  const slashParts = trimmed.split(/[/.-]/);
  if (slashParts.length === 3) {
    const [p1, p2, p3] = slashParts;
    if (p3.length === 4) {
      // MM/DD/YYYY
      const m = p1.padStart(2, "0");
      const d = p2.padStart(2, "0");
      return `${p3}-${m}-${d}`;
    } else if (p1.length === 4) {
      // YYYY/MM/DD
      const m = p2.padStart(2, "0");
      const d = p3.padStart(2, "0");
      return `${p1}-${m}-${d}`;
    }
  }

  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }

  return null;
}
