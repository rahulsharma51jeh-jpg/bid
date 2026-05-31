import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        boqUploads: {
          select: {
            id: true,
            fileName: true,
            status: true,
            createdAt: true,
          },
        },
        analysisResults: {
          select: {
            id: true,
            totalCost: true,
            totalMaterials: true,
            type: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            boqUploads: true,
            analysisResults: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Projects Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
