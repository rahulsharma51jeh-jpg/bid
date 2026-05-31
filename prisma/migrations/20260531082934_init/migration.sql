-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'contractor',
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "clientName" TEXT,
    "estimatedCost" REAL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BoqUpload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "rawData" TEXT,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "BoqUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BoqUpload_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BoqItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slNo" INTEGER,
    "itemCode" TEXT,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "rate" REAL,
    "amount" REAL,
    "category" TEXT,
    "subCategory" TEXT,
    "chapter" TEXT,
    "dsrItemCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boqUploadId" TEXT NOT NULL,
    CONSTRAINT "BoqItem_boqUploadId_fkey" FOREIGN KEY ("boqUploadId") REFERENCES "BoqUpload" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaterialBreakdown" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "materialName" TEXT NOT NULL,
    "materialCode" TEXT,
    "quantity" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "rate" REAL,
    "amount" REAL,
    "wastage" REAL NOT NULL DEFAULT 0,
    "totalWithWastage" REAL,
    "source" TEXT NOT NULL DEFAULT 'cpwd',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boqItemId" TEXT NOT NULL,
    CONSTRAINT "MaterialBreakdown_boqItemId_fkey" FOREIGN KEY ("boqItemId") REFERENCES "BoqItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DsrRate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "rate" REAL NOT NULL,
    "chapter" TEXT NOT NULL,
    "subChapter" TEXT,
    "category" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "year" INTEGER NOT NULL DEFAULT 2024,
    "state" TEXT,
    "laborRate" REAL,
    "materialRate" REAL,
    "equipmentRate" REAL,
    "overheadRate" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "currentRate" REAL,
    "source" TEXT NOT NULL DEFAULT 'cpwd',
    "description" TEXT,
    "specifications" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AnalysisResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "summary" TEXT,
    "materialSummary" TEXT,
    "costSummary" TEXT,
    "quantitySummary" TEXT,
    "totalCost" REAL,
    "totalMaterials" INTEGER,
    "confidence" REAL,
    "processingTime" INTEGER,
    "aiModel" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    "boqUploadId" TEXT NOT NULL,
    CONSTRAINT "AnalysisResult_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AnalysisResult_boqUploadId_fkey" FOREIGN KEY ("boqUploadId") REFERENCES "BoqUpload" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DprReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportDate" DATETIME NOT NULL,
    "reportNo" TEXT,
    "weather" TEXT,
    "workingHours" REAL,
    "laborSummary" TEXT,
    "totalLaborCost" REAL,
    "materialSummary" TEXT,
    "totalMaterialCost" REAL,
    "equipmentSummary" TEXT,
    "totalEquipmentCost" REAL,
    "workProgress" TEXT,
    "physicalProgress" REAL,
    "financialProgress" REAL,
    "totalDayCost" REAL,
    "cumulativeCost" REAL,
    "budgetVariance" REAL,
    "remarks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "DprReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DprReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "DsrRate_category_source_idx" ON "DsrRate"("category", "source");

-- CreateIndex
CREATE INDEX "DsrRate_chapter_source_idx" ON "DsrRate"("chapter", "source");

-- CreateIndex
CREATE UNIQUE INDEX "DsrRate_itemCode_source_year_key" ON "DsrRate"("itemCode", "source", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Material_code_key" ON "Material"("code");

-- CreateIndex
CREATE INDEX "Material_category_idx" ON "Material"("category");

-- CreateIndex
CREATE INDEX "Material_name_idx" ON "Material"("name");
