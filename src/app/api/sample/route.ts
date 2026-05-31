import { NextResponse } from "next/server";
import { generateSampleBoq } from "@/lib/sample-boq";

export async function GET() {
  try {
    const buffer = generateSampleBoq();
    
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=sample-boq-residential.xlsx",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to generate sample" },
      { status: 500 }
    );
  }
}
