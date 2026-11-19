import { Transaction } from "@/types";
import { lookupMerchant } from "@/lib/cancellationData";

export interface NormalizedMerchantResult {
  normalizedBrand: string;
  isRecognized: boolean;
  cleanMerchant: string;
}

const CLEANUP_PATTERNS = [
  /\b(upi|autopay|mandate|mandt\d*|nach|ach|neft|rtgs|imps|pos|si-hga|si|cr|dr|p2m|p2a)\b/gi,
  /\b(inc|corp|corporation|llc|ltd|pvt|co|gmbh|co\.?)\b/gi,
  /\b(ca|ny|wa|tx|fl|az|us|usa|india|san francisco|seattle|mountain view|austin|brooklyn|redmond|tempe)\b/gi,
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone numbers like 866-579-7172
  /\b(payment|recurring|monthly|membership|subscription|sub|digital|dues|web|direct debit|bill|store)\b/gi,
  /\b[A-Z0-9]{5,}\b/g, // Transaction reference codes like 8XY798 or P109384 or 882104
  /[*#_/\\-]/g,
  /\s{2,}/g,
];

export function cleanRawDescription(raw: string): string {
  let cleaned = raw;
  for (const pattern of CLEANUP_PATTERNS) {
    cleaned = cleaned.replace(pattern, " ");
  }
  return cleaned.trim();
}

export function normalizeMerchant(rawDescription: string): NormalizedMerchantResult {
  // Check known dictionary first
  const rule = lookupMerchant(rawDescription);
  if (rule) {
    return {
      normalizedBrand: rule.normalizedBrand,
      isRecognized: true,
      cleanMerchant: rule.normalizedBrand,
    };
  }

  // Fallback heuristics: clean common bank noise
  let cleaned = cleanRawDescription(rawDescription);
  if (!cleaned || cleaned.length < 2) {
    cleaned = rawDescription.split(" ")[0] || rawDescription;
  }

  // Capitalize nicely
  const titleCased = cleaned
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    normalizedBrand: titleCased,
    isRecognized: false,
    cleanMerchant: titleCased,
  };
}

export function normalizeTransactions(rawList: Array<{
  date: string;
  description: string;
  amount: number | string;
  type?: string;
  currency?: string;
}>): Transaction[] {
  return rawList
    .map((raw, idx) => {
      let amountNum = 0;
      if (typeof raw.amount === "number") {
        amountNum = Math.abs(raw.amount);
      } else if (typeof raw.amount === "string") {
        // Strip currency symbols, commas
        const cleanStr = raw.amount.replace(/[^0-9.-]+/g, "");
        amountNum = Math.abs(parseFloat(cleanStr)) || 0;
      }

      let txType: "debit" | "credit" = "debit";
      if (raw.type) {
        const lowerType = raw.type.toLowerCase();
        if (lowerType.includes("credit") || lowerType.includes("refund") || lowerType.includes("deposit")) {
          txType = "credit";
        }
      } else if (typeof raw.amount === "string" && !raw.amount.startsWith("-") && raw.amount.startsWith("+")) {
        txType = "credit";
      }

      const norm = normalizeMerchant(raw.description);

      return {
        id: `tx-${Date.now()}-${idx}`,
        date: raw.date,
        rawDescription: raw.description,
        cleanMerchant: norm.cleanMerchant,
        amount: Number(amountNum.toFixed(2)),
        type: txType,
        currency: raw.currency || "USD",
      };
    })
    .filter((tx) => !isNaN(tx.amount) && tx.amount > 0);
}
