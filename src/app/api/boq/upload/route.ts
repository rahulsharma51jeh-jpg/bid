import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { parseExcelBoq } from "@/lib/boq-parser";
import { analyzeBoqItems, generateFinancialDpr } from "@/lib/ai-analyzer";
import prisma from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const projectName = formData.get("projectName") as string || "Untitled Project";
    const dsrSource = (formData.get("dsrSource") as string) || "cpwd";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
      "application/pdf",
    ];
    
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(fileExtension || "")) {
      return NextResponse.json(
        { success: false, error: "Unsupported file format. Please upload .xlsx, .xls, or .csv" },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to uploads directory
    const uploadDir = join(process.cwd(), "uploads");
    await mkdir(uploadDir, { recursive: true });
    
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Parse BOQ
    const parsedBoq = parseExcelBoq(buffer);

    if (parsedBoq.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid BOQ items found in the file. Please check the format." },
        { status: 400 }
      );
    }

    // Create or get default user (MVP - no auth yet)
    let user = await prisma.user.findFirst({ where: { email: "demo@infinitybid.com" } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: uuidv4(),
          email: "demo@infinitybid.com",
          name: "Demo User",
          password: "demo123",
          company: "Infinity Bid",
          role: "contractor",
        },
      });
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        id: uuidv4(),
        name: projectName,
        status: "active",
        userId: user.id,
      },
    });

    // Create BOQ upload record
    const boqUpload = await prisma.boqUpload.create({
      data: {
        id: uuidv4(),
        fileName: file.name,
        fileSize: file.size,
        fileType: fileExtension || "xlsx",
        filePath: filePath,
        status: "processing",
        rawData: JSON.stringify(parsedBoq.metadata),
        userId: user.id,
        projectId: project.id,
      },
    });

    // Save BOQ items
    for (const item of parsedBoq.items) {
      await prisma.boqItem.create({
        data: {
          id: uuidv4(),
          slNo: item.slNo,
          itemCode: item.itemCode,
          description: item.description,
          unit: item.unit,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
          category: item.category,
          boqUploadId: boqUpload.id,
        },
      });
    }

    // Run AI Analysis
    const analysis = analyzeBoqItems(parsedBoq.items, dsrSource as "cpwd" | "bihar");
    const financialDpr = generateFinancialDpr(analysis);

    // Save analysis result
    const analysisResult = await prisma.analysisResult.create({
      data: {
        id: uuidv4(),
        type: "material_analysis",
        summary: JSON.stringify(analysis.summary),
        materialSummary: JSON.stringify(analysis.materials),
        costSummary: JSON.stringify(financialDpr),
        quantitySummary: JSON.stringify(analysis.categoryBreakdown),
        totalCost: analysis.totalCost,
        totalMaterials: analysis.totalMaterials,
        confidence: analysis.summary.confidence,
        aiModel: "infinity-bid-v1",
        projectId: project.id,
        boqUploadId: boqUpload.id,
      },
    });

    // Save material breakdowns
    for (const material of analysis.materials) {
      await prisma.materialBreakdown.create({
        data: {
          id: uuidv4(),
          materialName: material.materialName,
          materialCode: material.materialCode,
          quantity: material.quantity,
          unit: material.unit,
          rate: material.rate,
          amount: material.amount,
          wastage: material.wastagePercent,
          totalWithWastage: material.totalWithWastage,
          source: material.source,
          boqItemId: (await prisma.boqItem.findFirst({ where: { boqUploadId: boqUpload.id } }))!.id,
        },
      });
    }

    // Update upload status
    await prisma.boqUpload.update({
      where: { id: boqUpload.id },
      data: { status: "completed" },
    });

    return NextResponse.json({
      success: true,
      data: {
        uploadId: boqUpload.id,
        projectId: project.id,
        analysisId: analysisResult.id,
        fileName: file.name,
        itemCount: parsedBoq.items.length,
        analysis: {
          summary: analysis.summary,
          materials: analysis.materials.slice(0, 20), // Top 20 materials
          categoryBreakdown: analysis.categoryBreakdown,
          totalCost: analysis.totalCost,
        },
        financialDpr: financialDpr,
        metadata: parsedBoq.metadata,
      },
    });
  } catch (error) {
    console.error("BOQ Upload Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process BOQ file. Please try again." },
      { status: 500 }
    );
  }
}
