// ============ BOQ Types ============

export interface BoqLineItem {
  slNo?: number;
  itemCode?: string;
  description: string;
  unit: string;
  quantity: number;
  rate?: number;
  amount?: number;
  category?: string;
  subCategory?: string;
  chapter?: string;
}

export interface ParsedBoq {
  items: BoqLineItem[];
  metadata: {
    projectName?: string;
    totalItems: number;
    totalAmount?: number;
    categories: string[];
  };
}

// ============ Material Analysis Types ============

export interface MaterialQuantity {
  materialName: string;
  materialCode?: string;
  quantity: number;
  unit: string;
  rate?: number;
  amount?: number;
  wastagePercent: number;
  totalWithWastage: number;
  source: "cpwd" | "bihar" | "custom";
  category: string;
}

export interface MaterialAnalysis {
  materials: MaterialQuantity[];
  totalMaterials: number;
  totalCost: number;
  categoryBreakdown: CategoryBreakdown[];
  summary: AnalysisSummary;
}

export interface CategoryBreakdown {
  category: string;
  materialCount: number;
  totalCost: number;
  percentage: number;
  materials: MaterialQuantity[];
}

export interface AnalysisSummary {
  totalItems: number;
  totalMaterials: number;
  estimatedCost: number;
  laborCost: number;
  materialCost: number;
  equipmentCost: number;
  overheadCost: number;
  confidence: number;
}

// ============ DSR Types ============

export interface DsrRateItem {
  itemCode: string;
  description: string;
  unit: string;
  rate: number;
  chapter: string;
  subChapter?: string;
  category: string;
  source: "cpwd" | "bihar";
  year: number;
  laborRate?: number;
  materialRate?: number;
  equipmentRate?: number;
}

// ============ DPR Types ============

export interface DprEntry {
  reportDate: string;
  reportNo?: string;
  weather?: string;
  workingHours?: number;
  laborItems: DprLaborItem[];
  materialItems: DprMaterialItem[];
  equipmentItems: DprEquipmentItem[];
  workProgress: DprWorkItem[];
  totalDayCost: number;
  cumulativeCost: number;
  physicalProgress: number;
  financialProgress: number;
  remarks?: string;
}

export interface DprLaborItem {
  category: string;
  count: number;
  rate: number;
  amount: number;
}

export interface DprMaterialItem {
  name: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface DprEquipmentItem {
  name: string;
  hours: number;
  rate: number;
  amount: number;
}

export interface DprWorkItem {
  description: string;
  unit: string;
  todayQty: number;
  cumulativeQty: number;
  totalQty: number;
  percentComplete: number;
}

// ============ API Response Types ============

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  uploadId: string;
  fileName: string;
  status: string;
  itemCount: number;
}

export interface AnalysisResponse {
  analysisId: string;
  materials: MaterialQuantity[];
  summary: AnalysisSummary;
  categoryBreakdown: CategoryBreakdown[];
  processingTime: number;
}
