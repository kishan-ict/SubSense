import {
  Transaction,
  ParsedSubscription,
  AuditResult,
  AuditSummary,
  CategoryBreakdown,
  UpcomingRenewal,
  SubscriptionCategory,
  BillingFrequency,
  SubscriptionStatus,
  PriceAnomaly,
  DuplicateCluster,
} from "@/types";
import { lookupMerchant, KNOWN_MERCHANTS } from "../cancellationData";

const CATEGORY_COLORS: Record<SubscriptionCategory, string> = {
  "Entertainment & Streaming": "#06b6d4", // Cyan
  "Software & Productivity": "#3b82f6", // Blue
  "Cloud & Hosting": "#8b5cf6", // Purple
  "Fitness & Health": "#10b981", // Emerald
  "Utilities & Telecom": "#f59e0b", // Amber
  "Food & Delivery": "#ef4444", // Red
  "Shopping & Memberships": "#ec4899", // Pink
  "Finance & Insurance": "#6366f1", // Indigo
  "Other Recurring": "#64748b", // Slate
};

export function analyzeTransactions(transactions: Transaction[]): AuditResult {
  // Filter out credits/refunds and non-debits
  const debits = transactions.filter((t) => t.type === "debit");

  // Group by clean merchant / normalized brand
  const merchantMap = new Map<string, Transaction[]>();

  debits.forEach((tx) => {
    const key = tx.cleanMerchant.toLowerCase().trim();
    const existing = merchantMap.get(key) || [];
    existing.push(tx);
    merchantMap.set(key, existing);
  });

  const parsedSubscriptions: ParsedSubscription[] = [];

  merchantMap.forEach((txList, key) => {
    // Sort chronological
    txList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Check against known merchant rule
    const rule = lookupMerchant(key) || lookupMerchant(txList[0].rawDescription);

    // Rule: Single isolated transactions for unknown merchants are one-time ordinary purchases
    if (!rule && txList.length < 2) {
      return;
    }

    const { frequency, intervalDays, isRecurring } = calculateCadence(txList, rule?.defaultFrequency);

    // If not recurring by cadence and not recognized in known subscriptions dictionary, skip
    if (!isRecurring && !rule) {
      return;
    }

    const latestTx = txList[txList.length - 1];
    const firstTx = txList[0];
    const currentAmount = latestTx.amount;

    // Detect Price Anomaly / Hike
    const priceAnomaly = detectPriceHike(txList);

    // Category determination
    const category: SubscriptionCategory = rule
      ? rule.category
      : inferCategory(latestTx.rawDescription, key);

    // Status determination
    let status: SubscriptionStatus = "potential";
    let confidence = 0.6;
    if (rule && txList.length >= 2) {
      status = "confirmed";
      confidence = 0.95;
    } else if (txList.length >= 3 && intervalDays >= 20 && intervalDays <= 35) {
      status = "confirmed";
      confidence = 0.9;
    } else if (rule && txList.length === 1) {
      status = "potential";
      confidence = 0.75;
    } else if (txList.length >= 2) {
      confidence = 0.8;
      status = "confirmed";
    }

    // Next renewal date estimation
    const nextRenewalDate = calculateNextRenewal(latestTx.date, frequency, intervalDays);

    // Annualized & Monthly costs
    const { monthlyCost, annualizedCost } = calculateCosts(currentAmount, frequency);

    // Cancellation Guide
    const cancellationGuide = rule?.guide || {
      officialUrl: undefined,
      difficulty: "medium",
      steps: [
        `Visit ${rule?.normalizedBrand || latestTx.cleanMerchant} account or billing settings.`,
        "Locate 'Subscriptions' or 'Payment Plans'.",
        "Select 'Cancel' or 'Turn off auto-renew' and save confirmation."
      ],
      emailTemplate: {
        subject: `Cancellation Request: ${rule?.normalizedBrand || latestTx.cleanMerchant}`,
        body: `Dear Support,\n\nPlease terminate my subscription plan with ${rule?.normalizedBrand || latestTx.cleanMerchant} and cancel recurring payments.\n\nThank you,\nAccount Holder`
      },
      warnings: ["Verify whether an annual commitment contract or early cancellation penalty applies."]
    };

    const brandName = rule ? rule.normalizedBrand : latestTx.cleanMerchant;

    parsedSubscriptions.push({
      id: `sub-${key.replace(/[^a-z0-9]/g, "-")}`,
      merchant: latestTx.rawDescription,
      normalizedBrand: brandName,
      category,
      amount: currentAmount,
      currency: latestTx.currency || "USD",
      billingFrequency: frequency,
      status,
      confidenceScore: confidence,
      action: "keep",
      firstSeenDate: firstTx.date,
      lastSeenDate: latestTx.date,
      nextRenewalDate,
      monthlyCost: Number(monthlyCost.toFixed(2)),
      annualizedCost: Number(annualizedCost.toFixed(2)),
      transactionCount: txList.length,
      transactions: txList,
      priceAnomaly,
      cancellationGuide,
      insights: generateInsights(brandName, frequency, priceAnomaly, txList.length),
    });
  });

  // Step 5: Duplicate Detection (e.g. Google One + Dropbox in Cloud & Hosting)
  detectDuplicateServices(parsedSubscriptions);

  // Compute Metrics
  let totalMonthlySpend = 0;
  let projectedAnnualSpend = 0;
  let priceHikesCount = 0;
  let duplicateCount = 0;

  parsedSubscriptions.forEach((sub) => {
    totalMonthlySpend += sub.monthlyCost;
    projectedAnnualSpend += sub.annualizedCost;
    if (sub.priceAnomaly?.hasAnomaly) priceHikesCount++;
    if (sub.duplicateInfo?.isDuplicate) duplicateCount++;
  });

  // Category Breakdown
  const categoryMap = new Map<SubscriptionCategory, { amount: number; count: number }>();
  parsedSubscriptions.forEach((sub) => {
    const existing = categoryMap.get(sub.category) || { amount: 0, count: 0 };
    existing.amount += sub.monthlyCost;
    existing.count += 1;
    categoryMap.set(sub.category, existing);
  });

  const categoryBreakdown: CategoryBreakdown[] = Array.from(categoryMap.entries()).map(([cat, data]) => ({
    category: cat,
    monthlyAmount: Number(data.amount.toFixed(2)),
    count: data.count,
    color: CATEGORY_COLORS[cat] || "#64748b",
  })).sort((a, b) => b.monthlyAmount - a.monthlyAmount);

  // Upcoming Renewals
  const now = new Date();
  const upcomingRenewals: UpcomingRenewal[] = parsedSubscriptions
    .map((sub) => {
      const renewalDateObj = new Date(sub.nextRenewalDate);
      const diffTime = renewalDateObj.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        id: sub.id,
        merchant: sub.merchant,
        normalizedBrand: sub.normalizedBrand,
        amount: sub.amount,
        currency: sub.currency,
        renewalDate: sub.nextRenewalDate,
        daysRemaining: diffDays,
        action: sub.action,
      };
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const summary: AuditSummary = {
    totalMonthlySpend: Number(totalMonthlySpend.toFixed(2)),
    projectedAnnualSpend: Number(projectedAnnualSpend.toFixed(2)),
    potentialAnnualSavings: 0, // Calculated dynamically when user flags items
    activeSubscriptionsCount: parsedSubscriptions.length,
    flaggedSubscriptionsCount: 0,
    priceHikesCount,
    duplicateServicesCount: duplicateCount,
  };

  return {
    auditId: `audit-${Date.now()}`,
    createdAt: new Date().toISOString(),
    summary,
    subscriptions: parsedSubscriptions,
    categoryBreakdown,
    upcomingRenewals,
    totalTransactionsProcessed: transactions.length,
  };
}

function calculateCadence(
  txList: Transaction[],
  defaultFreq?: "monthly" | "annual"
): { frequency: BillingFrequency; intervalDays: number; isRecurring: boolean } {
  if (txList.length < 2) {
    if (defaultFreq === "annual") {
      return { frequency: "annual", intervalDays: 365, isRecurring: true };
    }
    return { frequency: defaultFreq || "monthly", intervalDays: 30, isRecurring: false };
  }

  let totalDiff = 0;
  for (let i = 1; i < txList.length; i++) {
    const prev = new Date(txList[i - 1].date).getTime();
    const curr = new Date(txList[i].date).getTime();
    totalDiff += (curr - prev) / (1000 * 60 * 60 * 24);
  }

  const avgInterval = totalDiff / (txList.length - 1);

  if (avgInterval >= 5 && avgInterval <= 10) {
    return { frequency: "weekly", intervalDays: Math.round(avgInterval), isRecurring: true };
  } else if (avgInterval >= 25 && avgInterval <= 35) {
    return { frequency: "monthly", intervalDays: Math.round(avgInterval), isRecurring: true };
  } else if (avgInterval >= 80 && avgInterval <= 100) {
    return { frequency: "quarterly", intervalDays: Math.round(avgInterval), isRecurring: true };
  } else if (avgInterval >= 340 && avgInterval <= 390) {
    return { frequency: "annual", intervalDays: Math.round(avgInterval), isRecurring: true };
  }

  return { frequency: "monthly", intervalDays: Math.round(avgInterval), isRecurring: true };
}

function detectPriceHike(txList: Transaction[]): PriceAnomaly {
  if (txList.length < 2) {
    return { hasAnomaly: false };
  }

  const sorted = [...txList].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const initial = sorted[0].amount;
  const latest = sorted[sorted.length - 1].amount;

  if (latest > initial) {
    const diff = latest - initial;
    const percentage = ((diff) / initial) * 100;
    // Only flag substantial increases (>= 5%)
    if (percentage >= 5) {
      return {
        hasAnomaly: true,
        type: "price-hike",
        previousAmount: initial,
        currentAmount: latest,
        percentageChange: Number(percentage.toFixed(1)),
        description: `Price increased by ${percentage.toFixed(1)}% (from $${initial.toFixed(2)} to $${latest.toFixed(2)}).`,
      };
    }
  }

  return { hasAnomaly: false };
}

function detectDuplicateServices(subscriptions: ParsedSubscription[]) {
  // Check within specific duplicate-prone clusters:
  // 1. Cloud Storage: Google One, Dropbox, iCloud, OneDrive
  const cloudStorageKeywords = ["google one", "dropbox", "box", "onedrive", "icloud"];
  const cloudSubs = subscriptions.filter((s) =>
    cloudStorageKeywords.some((k) => s.normalizedBrand.toLowerCase().includes(k))
  );

  if (cloudSubs.length > 1) {
    cloudSubs.forEach((sub) => {
      const others = cloudSubs.filter((o) => o.id !== sub.id).map((o) => o.normalizedBrand);
      sub.duplicateInfo = {
        isDuplicate: true,
        clusterId: "cloud-storage-cluster",
        similarServices: others,
        reason: `Potential overlapping Cloud Storage provider with ${others.join(", ")}. Consolidating could save on redundant storage.`,
      };
      sub.insights = sub.insights || [];
      sub.insights.push(`Redundant storage detected with ${others.join(", ")}.`);
    });
  }

  // 2. Same-merchant duplicates (multiple subscriptions to the exact same brand)
  const brandCountMap = new Map<string, ParsedSubscription[]>();
  subscriptions.forEach((sub) => {
    const list = brandCountMap.get(sub.normalizedBrand) || [];
    list.push(sub);
    brandCountMap.set(sub.normalizedBrand, list);
  });

  brandCountMap.forEach((list, brand) => {
    if (list.length > 1) {
      list.forEach((sub) => {
        sub.duplicateInfo = {
          isDuplicate: true,
          clusterId: `duplicate-brand-${brand}`,
          similarServices: [brand],
          reason: `Multiple active subscriptions detected for ${brand}. Ensure you are not paying twice.`,
        };
      });
    }
  });
}

function calculateNextRenewal(lastDateStr: string, frequency: BillingFrequency, intervalDays: number): string {
  const lastDate = new Date(lastDateStr);
  const nextDate = new Date(lastDate);

  if (frequency === "weekly") {
    nextDate.setDate(nextDate.getDate() + 7);
  } else if (frequency === "quarterly") {
    nextDate.setMonth(nextDate.getMonth() + 3);
  } else if (frequency === "annual") {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  } else {
    // monthly default
    nextDate.setMonth(nextDate.getMonth() + 1);
  }

  // If next date is already in the past, roll forward to current future cycle
  const now = new Date();
  while (nextDate.getTime() < now.getTime()) {
    if (frequency === "annual") {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    } else {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
  }

  return nextDate.toISOString().split("T")[0];
}

function calculateCosts(amount: number, frequency: BillingFrequency): { monthlyCost: number; annualizedCost: number } {
  switch (frequency) {
    case "weekly":
      return { monthlyCost: (amount * 52) / 12, annualizedCost: amount * 52 };
    case "quarterly":
      return { monthlyCost: amount / 3, annualizedCost: amount * 4 };
    case "annual":
      return { monthlyCost: amount / 12, annualizedCost: amount };
    case "monthly":
    default:
      return { monthlyCost: amount, annualizedCost: amount * 12 };
  }
}

function inferCategory(description: string, merchant: string): SubscriptionCategory {
  const text = `${description} ${merchant}`.toLowerCase();
  if (/stream|tv|video|music|spotify|netflix|hulu|disney|hbo|youtube|audible/i.test(text)) {
    return "Entertainment & Streaming";
  }
  if (/adobe|microsoft|github|slack|zoom|notion|atlassian|figma|canva|chatgpt|openai/i.test(text)) {
    return "Software & Productivity";
  }
  if (/aws|google cloud|azure|dropbox|digitalocean|heroku|vercel|cloudflare|godaddy|storage/i.test(text)) {
    return "Cloud & Hosting";
  }
  if (/gym|fitness|equinox|planet fitness|workout|strava|peloton|whoop/i.test(text)) {
    return "Fitness & Health";
  }
  if (/electric|water|gas|telecom|verizon|at&t|t-mobile|comcast|internet/i.test(text)) {
    return "Utilities & Telecom";
  }
  if (/prime|costco|walmart|membership|target/i.test(text)) {
    return "Shopping & Memberships";
  }
  return "Other Recurring";
}

function generateInsights(
  brand: string,
  frequency: BillingFrequency,
  priceAnomaly: PriceAnomaly,
  count: number
): string[] {
  const insights: string[] = [];
  if (priceAnomaly.hasAnomaly && priceAnomaly.description) {
    insights.push(priceAnomaly.description);
  }
  if (frequency === "annual") {
    insights.push("Billed once annually. Make note of auto-renewal date to avoid unwanted yearly lock-in.");
  }
  if (count >= 3) {
    insights.push(`Consistent billing pattern verified across ${count} statement periods.`);
  }
  return insights;
}
