import { z } from "zod";

export type SubscriptionCategory =
  | "Entertainment & Streaming"
  | "Software & Productivity"
  | "Cloud & Hosting"
  | "Fitness & Health"
  | "Utilities & Telecom"
  | "Food & Delivery"
  | "Shopping & Memberships"
  | "Finance & Insurance"
  | "Other Recurring";

export type BillingFrequency =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "annual"
  | "one-time"
  | "irregular";

export type SubscriptionStatus =
  | "confirmed"
  | "potential"
  | "review-needed";

export type SubscriptionAction =
  | "keep"
  | "flag-to-cancel"
  | "review"
  | "cancelled";

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  rawDescription: string;
  cleanMerchant: string;
  amount: number;
  type: "debit" | "credit";
  currency: string;
  category?: string;
}

export interface PriceAnomaly {
  hasAnomaly: boolean;
  type?: "price-hike" | "billing-irregularity" | "currency-change";
  previousAmount?: number;
  currentAmount?: number;
  percentageChange?: number;
  description?: string;
}

export interface DuplicateCluster {
  isDuplicate: boolean;
  clusterId?: string;
  similarServices?: string[];
  reason?: string;
}

export interface CancellationGuide {
  officialUrl?: string;
  steps: string[];
  emailTemplate?: {
    subject: string;
    body: string;
  };
  warnings?: string[];
  difficulty: "easy" | "medium" | "hard";
  requiresPhoneCall?: boolean;
}

export interface ParsedSubscription {
  id: string;
  merchant: string;
  normalizedBrand: string;
  category: SubscriptionCategory;
  amount: number;
  currency: string;
  billingFrequency: BillingFrequency;
  status: SubscriptionStatus;
  confidenceScore: number; // 0 to 1
  action: SubscriptionAction;
  firstSeenDate: string;
  lastSeenDate: string;
  nextRenewalDate: string;
  annualizedCost: number;
  monthlyCost: number;
  transactionCount: number;
  transactions: Transaction[];
  priceAnomaly?: PriceAnomaly;
  duplicateInfo?: DuplicateCluster;
  cancellationGuide: CancellationGuide;
  insights?: string[];
  aiAnalyzed?: boolean;
  userNote?: string;
}

export interface AuditSummary {
  totalMonthlySpend: number;
  projectedAnnualSpend: number;
  potentialAnnualSavings: number;
  activeSubscriptionsCount: number;
  flaggedSubscriptionsCount: number;
  priceHikesCount: number;
  duplicateServicesCount: number;
}

export interface CategoryBreakdown {
  category: SubscriptionCategory;
  monthlyAmount: number;
  count: number;
  color?: string;
}

export interface UpcomingRenewal {
  id: string;
  merchant: string;
  normalizedBrand: string;
  amount: number;
  currency: string;
  renewalDate: string;
  daysRemaining: number;
  action: SubscriptionAction;
}

export interface AuditResult {
  auditId: string;
  createdAt: string;
  fileName?: string;
  summary: AuditSummary;
  subscriptions: ParsedSubscription[];
  categoryBreakdown: CategoryBreakdown[];
  upcomingRenewals: UpcomingRenewal[];
  totalTransactionsProcessed: number;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  currency: string;
  hideResolved: boolean;
}

// Zod Schemas for API validation
export const TransactionSchema = z.object({
  id: z.string(),
  date: z.string(),
  rawDescription: z.string(),
  cleanMerchant: z.string(),
  amount: z.number().positive(),
  type: z.enum(["debit", "credit"]),
  currency: z.string().default("USD"),
  category: z.string().optional(),
});

export const ParseStatementRequestSchema = z.object({
  csvContent: z.string().optional(),
  pdfBase64: z.string().optional(),
  fileName: z.string().optional(),
});

export const AnalyzeRequestSchema = z.object({
  transactions: z.array(TransactionSchema),
  useAI: z.boolean().optional(),
  useGemini: z.boolean().optional(),
  useOpenAI: z.boolean().optional(),
});

export const AIAnalysisOutputSchema = z.object({
  subscriptions: z.array(
    z.object({
      originalMerchant: z.string(),
      normalizedBrand: z.string(),
      category: z.string(),
      billingFrequency: z.enum(["weekly", "monthly", "quarterly", "annual", "one-time", "irregular"]),
      confidenceScore: z.number().min(0).max(1),
      isLikelySubscription: z.boolean(),
      potentialAnomaly: z.string().optional(),
      explanation: z.string(),
    })
  ),
});
