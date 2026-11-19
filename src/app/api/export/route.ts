import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { exportSubscriptionsToCSV } from "@/lib/export/reportGenerator";
import { ParsedSubscription } from "@/types";

const ExportRequestSchema = z.object({
  format: z.enum(["csv", "json"]),
  subscriptions: z.array(z.any()),
  filename: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = ExportRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid export payload", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { format, subscriptions, filename } = validated.data;
    const cleanFilename = filename || `subsense-export-${new Date().toISOString().split("T")[0]}`;

    if (format === "csv") {
      const csvData = exportSubscriptionsToCSV(subscriptions as ParsedSubscription[]);
      return new NextResponse(csvData, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${cleanFilename}.csv"`,
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    return NextResponse.json({
      exportedAt: new Date().toISOString(),
      subscriptions,
    });
  } catch (error: unknown) {
    console.error("API /api/export error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: "Export failed", details: message },
      { status: 500 }
    );
  }
}
