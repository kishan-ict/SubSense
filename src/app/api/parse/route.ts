import { NextRequest, NextResponse } from "next/server";
import { ParseStatementRequestSchema } from "@/types";
import { parseCSVStatement } from "@/lib/parser/csvParser";
import { parseBankStatementText } from "@/lib/parser/pdfParser";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = ParseStatementRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { csvContent, pdfBase64 } = validated.data;

    if (csvContent) {
      const { transactions, errors } = parseCSVStatement(csvContent);
      return NextResponse.json({
        transactions,
        count: transactions.length,
        errors,
      });
    }

    if (pdfBase64) {
      // Decode base64 to text (handles textual bank statements)
      try {
        const decodedText = Buffer.from(pdfBase64, "base64").toString("utf-8");
        const { transactions, errors } = parseBankStatementText(decodedText);
        return NextResponse.json({
          transactions,
          count: transactions.length,
          errors,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to decode PDF content";
        return NextResponse.json(
          { error: "Failed to decode PDF content", details: message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Either csvContent or pdfBase64 must be provided" },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("API /api/parse error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: "Failed to parse statement", details: message },
      { status: 500 }
    );
  }
}
