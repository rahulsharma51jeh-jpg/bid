import { BoqLineItem, MaterialQuantity, MaterialAnalysis, CategoryBreakdown, AnalysisSummary } from "@/types";
import { cpwdDsrRates, cpwdMaterialRates } from "@/data/dsr-cpwd";
import { biharDsrRates, biharMaterialRates } from "@/data/dsr-bihar";

/**
 * AI-Powered BOQ Analysis Engine
 * 
 * This engine performs:
 * 1. Material quantity extraction from BOQ items
 * 2. DSR rate mapping (CPWD / Bihar)
 * 3. Cost estimation with labor/material/equipment split
 * 4. Wastage calculation
 * 5. Financial summary generation
 */

// Material composition database - how much raw material is needed per unit of work
const MATERIAL_COMPOSITIONS: Record<string, MaterialComposition[]> = {
  concrete: [
    { material: "Cement (OPC 43)", unit: "bag", perUnit: 8.5, forUnit: "cum", wastage: 3 },
    { material: "Coarse Sand", unit: "cum", perUnit: 0.45, forUnit: "cum", wastage: 15 },
    { material: "Stone Aggregate 20mm", unit: "cum", perUnit: 0.9, forUnit: "cum", wastage: 5 },
    { material: "Water", unit: "kl", perUnit: 0.18, forUnit: "cum", wastage: 0 },
  ],
  masonry: [
    { material: "First Class Bricks", unit: "nos", perUnit: 500, forUnit: "cum", wastage: 5 },
    { material: "Cement (OPC 43)", unit: "bag", perUnit: 1.5, forUnit: "cum", wastage: 3 },
    { material: "Sand", unit: "cum", perUnit: 0.3, forUnit: "cum", wastage: 10 },
  ],
  plastering: [
    { material: "Cement (OPC 43)", unit: "bag", perUnit: 0.22, forUnit: "sqm", wastage: 5 },
    { material: "Fine Sand", unit: "cum", perUnit: 0.015, forUnit: "sqm", wastage: 10 },
  ],
  flooring: [
    { material: "Vitrified Tiles 600x600mm", unit: "sqm", perUnit: 1.05, forUnit: "sqm", wastage: 5 },
    { material: "Cement (OPC 43)", unit: "bag", perUnit: 0.16, forUnit: "sqm", wastage: 5 },
    { material: "Sand", unit: "cum", perUnit: 0.012, forUnit: "sqm", wastage: 10 },
  ],
  painting: [
    { material: "Acrylic Emulsion Paint", unit: "ltr", perUnit: 0.35, forUnit: "sqm", wastage: 8 },
    { material: "Cement Primer", unit: "ltr", perUnit: 0.12, forUnit: "sqm", wastage: 5 },
    { material: "Putty", unit: "kg", perUnit: 0.8, forUnit: "sqm", wastage: 10 },
  ],
  steel: [
    { material: "HYSD Steel Fe-500D", unit: "kg", perUnit: 1.0, forUnit: "kg", wastage: 3 },
    { material: "Binding Wire", unit: "kg", perUnit: 0.012, forUnit: "kg", wastage: 5 },
  ],
  plumbing: [
    { material: "CPVC Pipe 20mm", unit: "rmt", perUnit: 1.0, forUnit: "rmt", wastage: 5 },
    { material: "Pipe Fittings", unit: "nos", perUnit: 2, forUnit: "rmt", wastage: 0 },
    { material: "Solvent Cement", unit: "ml", perUnit: 25, forUnit: "rmt", wastage: 10 },
  ],
  electrical: [
    { material: "PVC Conduit 20mm", unit: "rmt", perUnit: 8, forUnit: "point", wastage: 5 },
    { material: "Copper Wire 1.5 sqmm", unit: "rmt", perUnit: 15, forUnit: "point", wastage: 8 },
    { material: "Switch/Socket", unit: "nos", perUnit: 1, forUnit: "point", wastage: 0 },
    { material: "Junction Box", unit: "nos", perUnit: 1, forUnit: "point", wastage: 0 },
  ],
  earthwork: [
    { material: "Earth/Soil", unit: "cum", perUnit: 1.3, forUnit: "cum", wastage: 0 },
  ],
  waterproofing: [
    { material: "Bitumen Felt", unit: "sqm", perUnit: 1.1, forUnit: "sqm", wastage: 10 },
    { material: "Bitumen 80/100", unit: "kg", perUnit: 1.5, forUnit: "sqm", wastage: 5 },
    { material: "Primer", unit: "ltr", perUnit: 0.2, forUnit: "sqm", wastage: 5 },
  ],
  woodwork: [
    { material: "Flush Door Shutter", unit: "sqm", perUnit: 1.0, forUnit: "sqm", wastage: 0 },
    { material: "Sal Wood Frame", unit: "rmt", perUnit: 5.5, forUnit: "sqm", wastage: 10 },
    { material: "Hardware (hinges, tower bolt)", unit: "set", perUnit: 1, forUnit: "sqm", wastage: 0 },
  ],
};

interface MaterialComposition {
  material: string;
  unit: string;
  perUnit: number;
  forUnit: string;
  wastage: number;
}

export function analyzeBoqItems(
  items: BoqLineItem[],
  dsrSource: "cpwd" | "bihar" = "cpwd"
): MaterialAnalysis {
  const startTime = Date.now();
  const dsrRates = dsrSource === "cpwd" ? cpwdDsrRates : biharDsrRates;
  const materialRates = dsrSource === "cpwd" ? cpwdMaterialRates : biharMaterialRates;

  // Step 1: Map BOQ items to DSR rates
  const mappedItems = items.map(item => ({
    ...item,
    dsrRate: findBestDsrMatch(item, dsrRates),
  }));

  // Step 2: Extract material quantities
  const allMaterials: MaterialQuantity[] = [];
  
  for (const item of mappedItems) {
    const category = item.category || "misc";
    const compositions = MATERIAL_COMPOSITIONS[category] || [];
    
    for (const comp of compositions) {
      const baseQuantity = item.quantity * comp.perUnit;
      const wastageAmount = baseQuantity * (comp.wastage / 100);
      const totalWithWastage = baseQuantity + wastageAmount;
      const rate = getMaterialRate(comp.material, materialRates);
      
      allMaterials.push({
        materialName: comp.material,
        quantity: Math.round(baseQuantity * 100) / 100,
        unit: comp.unit,
        rate,
        amount: Math.round(totalWithWastage * rate * 100) / 100,
        wastagePercent: comp.wastage,
        totalWithWastage: Math.round(totalWithWastage * 100) / 100,
        source: dsrSource,
        category,
      });
    }
  }

  // Step 3: Consolidate materials (combine same materials)
  const consolidatedMaterials = consolidateMaterials(allMaterials);

  // Step 4: Generate category breakdown
  const categoryBreakdown = generateCategoryBreakdown(consolidatedMaterials);

  // Step 5: Calculate costs
  const totalMaterialCost = consolidatedMaterials.reduce((sum, m) => sum + (m.amount || 0), 0);
  const totalLaborCost = calculateLaborCost(mappedItems, dsrRates);
  const totalEquipmentCost = totalMaterialCost * 0.08; // 8% equipment cost
  const overheadCost = (totalMaterialCost + totalLaborCost) * 0.12; // 12% overhead

  const summary: AnalysisSummary = {
    totalItems: items.length,
    totalMaterials: consolidatedMaterials.length,
    estimatedCost: totalMaterialCost + totalLaborCost + totalEquipmentCost + overheadCost,
    laborCost: Math.round(totalLaborCost),
    materialCost: Math.round(totalMaterialCost),
    equipmentCost: Math.round(totalEquipmentCost),
    overheadCost: Math.round(overheadCost),
    confidence: 0.85,
  };

  return {
    materials: consolidatedMaterials,
    totalMaterials: consolidatedMaterials.length,
    totalCost: summary.estimatedCost,
    categoryBreakdown,
    summary,
  };
}

function findBestDsrMatch(item: BoqLineItem, dsrRates: typeof cpwdDsrRates) {
  const desc = item.description.toLowerCase();
  
  // Find best matching DSR item based on description similarity
  let bestMatch = null;
  let bestScore = 0;

  for (const dsrItem of dsrRates) {
    const score = calculateSimilarity(desc, dsrItem.description.toLowerCase());
    if (score > bestScore && score > 0.3) {
      bestScore = score;
      bestMatch = dsrItem;
    }
  }

  // Also try matching by category
  if (!bestMatch && item.category) {
    bestMatch = dsrRates.find(r => r.category === item.category) || null;
  }

  return bestMatch;
}

function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(/\s+/).filter(w => w.length > 2);
  const words2 = str2.split(/\s+/).filter(w => w.length > 2);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  let matches = 0;
  for (const word of words1) {
    if (words2.some(w => w.includes(word) || word.includes(w))) {
      matches++;
    }
  }
  
  return matches / Math.max(words1.length, words2.length);
}

function getMaterialRate(materialName: string, rates: typeof cpwdMaterialRates): number {
  const lower = materialName.toLowerCase();
  
  if (lower.includes("cement")) return rates.cement.rate;
  if (lower.includes("coarse sand") || lower === "sand") return rates.sand.rate / 50; // per bag equivalent
  if (lower.includes("fine sand")) return rates.fineSand.rate / 50;
  if (lower.includes("aggregate 20") || lower.includes("stone aggregate")) return rates.aggregate20.rate / 50;
  if (lower.includes("aggregate 40")) return rates.aggregate40.rate / 50;
  if (lower.includes("brick")) return rates.bricks.rate;
  if (lower.includes("hysd") || lower.includes("steel fe")) return rates.steelFe500.rate;
  if (lower.includes("structural steel")) return rates.steelStructural.rate;
  if (lower.includes("water")) return rates.water.rate / 1000;
  if (lower.includes("vitrified") || lower.includes("tiles 600")) return rates.tiles600.rate;
  if (lower.includes("ceramic") || lower.includes("tiles 300")) return rates.tiles300.rate;
  if (lower.includes("emulsion") || lower.includes("paint")) return rates.paint.rate;
  if (lower.includes("primer")) return rates.primer.rate;
  if (lower.includes("bitumen")) return rates.bitumen.rate;
  if (lower.includes("cpvc") || lower.includes("pipe 20")) return rates.pvcPipe20.rate;
  if (lower.includes("pvc pipe 110")) return rates.pvcPipe110.rate;
  if (lower.includes("copper wire")) return rates.electricWire.rate;
  if (lower.includes("plywood")) return rates.plywood.rate;
  if (lower.includes("timber") || lower.includes("sal wood")) return rates.timber.rate;
  
  return 50; // Default rate for unknown materials
}

function consolidateMaterials(materials: MaterialQuantity[]): MaterialQuantity[] {
  const consolidated = new Map<string, MaterialQuantity>();
  
  for (const mat of materials) {
    const key = `${mat.materialName}-${mat.unit}`;
    
    if (consolidated.has(key)) {
      const existing = consolidated.get(key)!;
      existing.quantity += mat.quantity;
      existing.totalWithWastage += mat.totalWithWastage;
      existing.amount = (existing.amount || 0) + (mat.amount || 0);
    } else {
      consolidated.set(key, { ...mat });
    }
  }
  
  return Array.from(consolidated.values()).sort((a, b) => (b.amount || 0) - (a.amount || 0));
}

function generateCategoryBreakdown(materials: MaterialQuantity[]): CategoryBreakdown[] {
  const categories = new Map<string, MaterialQuantity[]>();
  
  for (const mat of materials) {
    const cat = mat.category || "misc";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(mat);
  }
  
  const totalCost = materials.reduce((sum, m) => sum + (m.amount || 0), 0);
  
  return Array.from(categories.entries()).map(([category, mats]) => {
    const catCost = mats.reduce((sum, m) => sum + (m.amount || 0), 0);
    return {
      category,
      materialCount: mats.length,
      totalCost: Math.round(catCost),
      percentage: totalCost > 0 ? Math.round((catCost / totalCost) * 100) : 0,
      materials: mats,
    };
  }).sort((a, b) => b.totalCost - a.totalCost);
}

function calculateLaborCost(
  items: (BoqLineItem & { dsrRate: typeof cpwdDsrRates[0] | null })[],
  dsrRates: typeof cpwdDsrRates
): number {
  let totalLabor = 0;
  
  for (const item of items) {
    if (item.dsrRate?.laborRate) {
      totalLabor += item.quantity * item.dsrRate.laborRate;
    } else {
      // Estimate labor as 25% of total if no DSR match
      const amount = item.amount || item.quantity * (item.rate || 0);
      totalLabor += amount * 0.25;
    }
  }
  
  return totalLabor;
}

// Generate Financial DPR from analysis
export function generateFinancialDpr(
  analysis: MaterialAnalysis,
  projectDuration: number = 180 // days
) {
  const dailyBudget = analysis.totalCost / projectDuration;
  const dprEntries = [];
  
  // Generate sample DPR entries for the first week
  for (let day = 1; day <= Math.min(7, projectDuration); day++) {
    const progress = (day / projectDuration) * 100;
    const dayCost = dailyBudget * (0.8 + Math.random() * 0.4); // ±20% variation
    
    dprEntries.push({
      day,
      date: new Date(Date.now() + day * 86400000).toISOString().split("T")[0],
      plannedCost: Math.round(dailyBudget),
      actualCost: Math.round(dayCost),
      cumulativePlanned: Math.round(dailyBudget * day),
      cumulativeActual: Math.round(dayCost * day),
      physicalProgress: Math.round(progress * 10) / 10,
      variance: Math.round((dailyBudget - dayCost) * 100) / 100,
    });
  }

  return {
    projectSummary: {
      totalBudget: Math.round(analysis.totalCost),
      dailyBudget: Math.round(dailyBudget),
      duration: projectDuration,
      laborBudget: analysis.summary.laborCost,
      materialBudget: analysis.summary.materialCost,
      equipmentBudget: analysis.summary.equipmentCost,
      overheadBudget: analysis.summary.overheadCost,
    },
    dprEntries,
    costBreakdown: {
      labor: Math.round((analysis.summary.laborCost / analysis.totalCost) * 100),
      material: Math.round((analysis.summary.materialCost / analysis.totalCost) * 100),
      equipment: Math.round((analysis.summary.equipmentCost / analysis.totalCost) * 100),
      overhead: Math.round((analysis.summary.overheadCost / analysis.totalCost) * 100),
    },
  };
}
