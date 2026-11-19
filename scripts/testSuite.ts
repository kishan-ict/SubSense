import { parseCSVStatement } from "../src/lib/parser/csvParser";
import { parseBankStatementText } from "../src/lib/parser/pdfParser";
import { analyzeTransactions } from "../src/lib/analysis/detector";
import { SAMPLE_TRANSACTIONS, SAMPLE_CSV_CONTENT } from "../src/lib/mockData";
import { exportSubscriptionsToCSV } from "../src/lib/export/reportGenerator";
import { ParsedSubscription } from "../src/types";

function runVerificationSuite() {
  console.log("=== SubSense Comprehensive Verification Suite ===");

  // 1. CSV Parsing Test
  console.log("\n[Test 1] Testing CSV Statement Parser with sample CSV...");
  const csvRes = parseCSVStatement(SAMPLE_CSV_CONTENT);
  console.log(`Parsed ${csvRes.transactions.length} transactions, Errors: ${csvRes.errors.length}`);
  if (csvRes.transactions.length === 0) throw new Error("CSV Parsing failed!");
  console.log("✓ CSV Parser verified.");

  // 2. PDF / Text Statement Parser Test
  console.log("\n[Test 2] Testing Bank Statement Text Parser...");
  const textStatement = `
2026-08-15 NETFLIX.COM PAYMENT 15.49
2026-09-15 NETFLIX.COM 15.49
2026-10-15 NETFLIX.COM DIGITAL 15.49
2026-09-01 TARGET STORE BROOKLYN 42.50
`;
  const pdfRes = parseBankStatementText(textStatement);
  console.log(`Parsed ${pdfRes.transactions.length} transactions from text/pdf lines`);
  if (pdfRes.transactions.length < 3) throw new Error("PDF/Text parsing failed!");
  console.log("✓ PDF/Text statement parser verified.");

  // 3. Financial Analysis Engine Test
  console.log("\n[Test 3] Testing Analysis Engine with Benchmark Dataset...");
  const audit = analyzeTransactions(SAMPLE_TRANSACTIONS);
  console.log(`Summary:`);
  console.log(`- Monthly Spend: $${audit.summary.totalMonthlySpend}`);
  console.log(`- Projected Annual: $${audit.summary.projectedAnnualSpend}`);
  console.log(`- Detected Subscriptions: ${audit.summary.activeSubscriptionsCount}`);
  console.log(`- Price Hikes Detected: ${audit.summary.priceHikesCount}`);
  console.log(`- Duplicate Service Clusters: ${audit.summary.duplicateServicesCount}`);

  // Verification assertions
  if (audit.summary.priceHikesCount < 1) throw new Error("Failed to detect Spotify price hike anomaly!");
  if (audit.summary.duplicateServicesCount < 1) throw new Error("Failed to detect Google One / Dropbox duplicate cloud storage!");
  console.log("✓ Price Hike & Duplicate detection verified.");

  // 4. CSV Formula Injection Defense Test
  console.log("\n[Test 4] Testing CSV Formula Injection Sanitization...");
  const maliciousSub: ParsedSubscription = {
    id: "sub-test-malicious",
    normalizedBrand: "=cmd|' /C calc'!A0",
    merchant: "+123456",
    category: "Software & Productivity",
    amount: 10,
    currency: "USD",
    billingFrequency: "monthly",
    nextRenewalDate: "2026-11-01",
    annualizedCost: 120,
    monthlyCost: 10,
    status: "confirmed",
    action: "keep",
    firstSeenDate: "2026-08-01",
    lastSeenDate: "2026-10-01",
    confidenceScore: 0.9,
    transactionCount: 3,
    transactions: [],
    cancellationGuide: { steps: [], difficulty: "easy" },
  };
  const exported = exportSubscriptionsToCSV([maliciousSub]);
  if (!exported.includes("''=cmd") && !exported.includes("''+123456") && !exported.includes("''@dangerous")) {
    // Check our single quote escaping
    if (!exported.includes("'=")) throw new Error("CSV Formula injection vulnerability found!");
  }
  console.log("✓ CSV Formula Injection Defense verified.");

  console.log("\n>>> ALL VERIFICATION SUITE TESTS PASSED SUCCESSFULLY! <<<");
}

runVerificationSuite();
