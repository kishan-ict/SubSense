import { Transaction } from "@/types";
import { normalizeMerchant } from "./normalizer";
import { standardizeDate } from "./csvParser";

/**
 * Extracts structured financial transactions from raw text content extracted from bank/statement PDFs.
 * Supports tabular line formats: Date Description Amount [Type]
 */
export function parseBankStatementText(rawText: string): { transactions: Transaction[]; errors: string[] } {
  const errors: string[] = [];
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const transactions: Transaction[] = [];

  // Regex patterns for matching transactions
  // e.g. "2026-08-15 NETFLIX.COM 15.49" or "08/15/2026 SPOTIFY USA -10.99"
  const dateLeadingRegex = /^(\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})\s+(.+?)\s+([-$]?\d+[\d,]*\.\d{2})(?:\s+(CR|DR|Debit|Credit))?$/i;
  const trailingAmountRegex = /([-$]?\d+[\d,]*\.\d{2})\s*$/;

  lines.forEach((line, index) => {
    // Skip common header/footer lines
    if (/statement period|account number|page \d+|balance forward|beginning balance|ending balance/i.test(line)) {
      return;
    }

    const match = line.match(dateLeadingRegex);
    if (match) {
      const rawDate = match[1];
      const rawDesc = match[2].trim();
      const rawAmount = match[3];
      const optionalType = match[4];

      const cleanDate = standardizeDate(rawDate);
      if (!cleanDate) return;

      const numVal = Math.abs(parseFloat(rawAmount.replace(/[^0-9.-]+/g, "")));
      if (isNaN(numVal) || numVal === 0) return;

      let txType: "debit" | "credit" = "debit";
      if (optionalType && /CR|Credit/i.test(optionalType)) {
        txType = "credit";
      } else if (rawAmount.startsWith("+")) {
        txType = "credit";
      }

      const norm = normalizeMerchant(rawDesc);

      transactions.push({
        id: `tx-pdf-${index}-${Date.now()}`,
        date: cleanDate,
        rawDescription: rawDesc,
        cleanMerchant: norm.cleanMerchant,
        amount: Number(numVal.toFixed(2)),
        type: txType,
        currency: "USD",
      });
    } else {
      // Secondary fallback for lines ending with amount and containing a date
      const amountMatch = line.match(trailingAmountRegex);
      if (amountMatch) {
        const words = line.split(/\s+/);
        if (words.length >= 3) {
          const possibleDate = standardizeDate(words[0]);
          if (possibleDate) {
            const desc = words.slice(1, -1).join(" ");
            const numVal = Math.abs(parseFloat(amountMatch[1].replace(/[^0-9.-]+/g, "")));
            if (!isNaN(numVal) && numVal > 0) {
              const norm = normalizeMerchant(desc);
              transactions.push({
                id: `tx-pdf-fallback-${index}-${Date.now()}`,
                date: possibleDate,
                rawDescription: desc,
                cleanMerchant: norm.cleanMerchant,
                amount: Number(numVal.toFixed(2)),
                type: "debit",
                currency: "USD",
              });
            }
          }
        }
      }
    }
  });

  if (transactions.length === 0) {
    errors.push("No standard transaction rows were recognized in this PDF text. Please check the format or use CSV.");
  }

  return { transactions, errors };
}
