import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const analysis = await prisma.analysisResult.findUnique({
      where: { id },
      include: {
        project: true,
        boqUpload: {
          include: {
            boqItems: {
              include: {
                materialBreakdowns: true,
              },
            },
          },
        },
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: "Analysis not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: analysis.id,
        type: analysis.type,
        project: analysis.project,
        summary: JSON.parse(analysis.summary || "{}"),
        materials: JSON.parse(analysis.materialSummary || "[]"),
        costSummary: JSON.parse(analysis.costSummary || "{}"),
        categoryBreakdown: JSON.parse(analysis.quantitySummary || "[]"),
        totalCost: analysis.totalCost,
        totalMaterials: analysis.totalMaterials,
        confidence: analysis.confidence,
        boqItems: analysis.boqUpload.boqItems,
        createdAt: analysis.createdAt,
      },
    });
  } catch (error) {
    console.error("Analysis Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analysis" },
      { status: 500 }
    );
  }
}
