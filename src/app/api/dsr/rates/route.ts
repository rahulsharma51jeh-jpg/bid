import { NextRequest, NextResponse } from "next/server";
import { cpwdDsrRates } from "@/data/dsr-cpwd";
import { biharDsrRates } from "@/data/dsr-bihar";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source") || "cpwd";
    const category = searchParams.get("category");
    const chapter = searchParams.get("chapter");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    let rates = source === "bihar" ? biharDsrRates : cpwdDsrRates;

    // Filter by category
    if (category) {
      rates = rates.filter(r => r.category === category);
    }

    // Filter by chapter
    if (chapter) {
      rates = rates.filter(r => r.chapter.toLowerCase().includes(chapter.toLowerCase()));
    }

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      rates = rates.filter(r =>
        r.description.toLowerCase().includes(searchLower) ||
        r.itemCode.toLowerCase().includes(searchLower) ||
        r.category.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = rates.length;
    const offset = (page - 1) * limit;
    const paginatedRates = rates.slice(offset, offset + limit);

    // Get unique categories and chapters
    const allRates = source === "bihar" ? biharDsrRates : cpwdDsrRates;
    const categories = [...new Set(allRates.map(r => r.category))];
    const chapters = [...new Set(allRates.map(r => r.chapter))];

    return NextResponse.json({
      success: true,
      data: {
        rates: paginatedRates,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        filters: {
          categories,
          chapters,
          sources: ["cpwd", "bihar"],
        },
      },
    });
  } catch (error) {
    console.error("DSR Rates Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch DSR rates" },
      { status: 500 }
    );
  }
}
