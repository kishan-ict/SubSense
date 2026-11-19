import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, AIAnalysisOutputSchema } from "@/types";

export interface AIEnrichmentResult {
  merchant: string;
  normalizedBrand: string;
  category: string;
  confidenceScore: number;
  explanation: string;
}

export async function enrichWithGemini(
  transactions: Transaction[]
): Promise<Map<string, AIEnrichmentResult>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Graceful fallback when API key is not configured
    return new Map();
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  // Take unique merchants from transactions to minimize tokens and privacy footprint
  const uniqueMerchants = Array.from(
    new Set(transactions.map((t) => t.cleanMerchant || t.rawDescription))
  ).slice(0, 30);

  const prompt = `Analyze these bank transaction merchant names and identify which are recurring subscription services.
For each merchant:
- Determine the clean, normalized brand name (e.g. 'NETFLIX.COM PAYMENT' -> 'Netflix').
- Classify into one of these categories: 'Entertainment & Streaming', 'Software & Productivity', 'Cloud & Hosting', 'Fitness & Health', 'Utilities & Telecom', 'Food & Delivery', 'Shopping & Memberships', 'Finance & Insurance', 'Other Recurring'.
- Specify billing frequency ('weekly', 'monthly', 'quarterly', 'annual', 'one-time', 'irregular').
- State confidence (0 to 1) and whether it is likely a subscription service.
- Give a brief explanation or insight.

Transactions:
${uniqueMerchants.map((m, i) => `${i + 1}. "${m}"`).join("\n")}
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: "You are a financial transaction analyzer. You only respond with strictly valid JSON matching the requested schema. Never invent transactions.",
        responseMimeType: "application/json",
        responseJsonSchema: {
          type: Type.OBJECT,
          properties: {
            subscriptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  originalMerchant: { type: Type.STRING },
                  normalizedBrand: { type: Type.STRING },
                  category: { type: Type.STRING },
                  billingFrequency: {
                    type: Type.STRING,
                    enum: ["weekly", "monthly", "quarterly", "annual", "one-time", "irregular"],
                  },
                  confidenceScore: { type: Type.NUMBER },
                  isLikelySubscription: { type: Type.BOOLEAN },
                  potentialAnomaly: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: [
                  "originalMerchant",
                  "normalizedBrand",
                  "category",
                  "billingFrequency",
                  "confidenceScore",
                  "isLikelySubscription",
                  "explanation",
                ],
              },
            },
          },
          required: ["subscriptions"],
        },
      },
    });

    const text = response.text;
    if (!text) return new Map();

    const parsedJson = JSON.parse(text);
    // Validate with Zod
    const validated = AIAnalysisOutputSchema.safeParse(parsedJson);
    const map = new Map<string, AIEnrichmentResult>();

    if (validated.success) {
      validated.data.subscriptions.forEach((sub) => {
        map.set(sub.originalMerchant.toLowerCase(), {
          merchant: sub.originalMerchant,
          normalizedBrand: sub.normalizedBrand,
          category: sub.category,
          confidenceScore: sub.confidenceScore,
          explanation: sub.explanation,
        });
      });
    }

    return map;
  } catch (error) {
    console.warn("Gemini AI enrichment error (falling back to deterministic engine):", error);
    return new Map();
  }
}
