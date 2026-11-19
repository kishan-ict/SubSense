import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequestSchema } from "@/types";
import { analyzeTransactions } from "@/lib/analysis/detector";
import { enrichWithGemini } from "@/lib/ai/geminiClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = AnalyzeRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid transactions payload", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { transactions, useAI } = validated.data;

    // Run deterministic analysis engine first
    const auditResult = analyzeTransactions(transactions);

    // Optionally enrich with Google Gemini if requested and API key is present
    if (useAI && process.env.GEMINI_API_KEY) {
      try {
        const enrichedMap = await enrichWithGemini(transactions);
        if (enrichedMap.size > 0) {
          auditResult.subscriptions.forEach((sub) => {
            const enriched = enrichedMap.get(sub.merchant.toLowerCase()) || enrichedMap.get(sub.normalizedBrand.toLowerCase());
            if (enriched) {
              sub.aiAnalyzed = true;
              sub.confidenceScore = Math.max(sub.confidenceScore, enriched.confidenceScore);
              if (enriched.explanation) {
                sub.insights = sub.insights || [];
                sub.insights.unshift(enriched.explanation);
              }
            }
          });
        }
      } catch (err) {
        console.warn("Gemini enrichment step encountered error, proceeding with deterministic audit:", err);
      }
    }

    return NextResponse.json(auditResult);
  } catch (error: unknown) {
    console.error("API /api/analyze error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: "Failed to perform financial audit", details: message },
      { status: 500 }
    );
  }
}
