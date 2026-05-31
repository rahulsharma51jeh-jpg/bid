import * as XLSX from "xlsx";
import { BoqLineItem, ParsedBoq } from "@/types";

/**
 * BOQ Parser Engine
 * Parses Excel/CSV BOQ files into structured data
 * Supports multiple BOQ formats commonly used in Indian construction
 */

const UNIT_PATTERNS = [
  "cum", "sqm", "rmt", "kg", "nos", "ls", "ltr", "kl",
  "mt", "quintal", "bag", "set", "pair", "each", "job",
  "point", "cft", "sft", "brass", "tonne", "meter",
  "sq.m", "cu.m", "r.m", "sq.ft", "cu.ft", "m3", "m2",
];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  earthwork: ["earth", "excavation", "filling", "embankment", "cutting", "grading", "trenching"],
  concrete: ["concrete", "rcc", "pcc", "cement concrete", "m-20", "m-25", "m-30", "m-15"],
  masonry: ["brick", "masonry", "block work", "stone masonry", "wall"],
  steel: ["steel", "reinforcement", "rebar", "hysd", "tmt", "structural steel"],
  plastering: ["plaster", "plastering", "rendering", "neeru", "punning"],
  flooring: ["floor", "tile", "vitrified", "ceramic", "marble", "granite", "kota"],
  painting: ["paint", "painting", "distemper", "emulsion", "enamel", "primer", "putty"],
  plumbing: ["plumbing", "pipe", "pvc", "cpvc", "gi pipe", "fitting", "sanitary", "tap"],
  electrical: ["electrical", "wiring", "switch", "socket", "cable", "conduit", "light", "fan"],
  waterproofing: ["waterproof", "bitumen", "membrane", "damp proof", "water proofing"],
  woodwork: ["door", "window", "shutter", "frame", "wood", "timber", "flush", "aluminium"],
  roofing: ["roof", "rcc slab", "truss", "sheet", "corrugated"],
  misc: [],
};

export function parseExcelBoq(buffer: Buffer): ParsedBoq {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  const rawData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
  }) as unknown as unknown[][];

  // Find header row
  const headerRowIndex = findHeaderRow(rawData);
  const headers = rawData[headerRowIndex] as string[];
  
  // Map columns
  const columnMap = mapColumns(headers);
  
  // Parse items
  const items: BoqLineItem[] = [];
  let totalAmount = 0;

  for (let i = headerRowIndex + 1; i < rawData.length; i++) {
    const row = rawData[i] as unknown[];
    if (!row || row.every(cell => cell === "" || cell === null || cell === undefined)) continue;

    const description = String(row[columnMap.description] || "").trim();
    if (!description || description.length < 3) continue;

    const quantity = parseFloat(String(row[columnMap.quantity] || "0")) || 0;
    const rate = parseFloat(String(row[columnMap.rate] || "0")) || 0;
    const amount = parseFloat(String(row[columnMap.amount] || "0")) || quantity * rate;
    const unit = normalizeUnit(String(row[columnMap.unit] || "").trim());

    if (quantity === 0 && rate === 0 && amount === 0) continue;

    const category = detectCategory(description);
    
    const item: BoqLineItem = {
      slNo: parseInt(String(row[columnMap.slNo] || "")) || items.length + 1,
      itemCode: String(row[columnMap.itemCode] || "").trim() || undefined,
      description,
      unit: unit || "nos",
      quantity,
      rate: rate || undefined,
      amount: amount || undefined,
      category,
    };

    items.push(item);
    totalAmount += amount;
  }

  const categories = [...new Set(items.map(item => item.category).filter(Boolean))] as string[];

  return {
    items,
    metadata: {
      totalItems: items.length,
      totalAmount,
      categories,
    },
  };
}

export function parseCsvBoq(content: string): ParsedBoq {
  const workbook = XLSX.read(content, { type: "string" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return parseExcelBoq(Buffer.from(buffer));
}

function findHeaderRow(data: unknown[][]): number {
  const headerKeywords = ["sl", "item", "description", "quantity", "unit", "rate", "amount", "particular"];
  
  for (let i = 0; i < Math.min(10, data.length); i++) {
    const row = (data[i] || []).map(cell => String(cell || "").toLowerCase());
    const matches = row.filter(cell => 
      headerKeywords.some(keyword => cell.includes(keyword))
    );
    if (matches.length >= 2) return i;
  }
  return 0;
}

function mapColumns(headers: string[]): Record<string, number> {
  const normalized = headers.map(h => String(h || "").toLowerCase().trim());
  
  return {
    slNo: findColumnIndex(normalized, ["sl", "s.no", "sr", "sno", "#"]),
    itemCode: findColumnIndex(normalized, ["item code", "code", "item no", "ref"]),
    description: findColumnIndex(normalized, ["description", "particular", "item", "work", "name of item", "detail"]),
    unit: findColumnIndex(normalized, ["unit", "uom"]),
    quantity: findColumnIndex(normalized, ["quantity", "qty", "quan"]),
    rate: findColumnIndex(normalized, ["rate", "unit rate", "price"]),
    amount: findColumnIndex(normalized, ["amount", "total", "value", "cost"]),
  };
}

function findColumnIndex(headers: string[], keywords: string[]): number {
  for (const keyword of keywords) {
    const index = headers.findIndex(h => h.includes(keyword));
    if (index !== -1) return index;
  }
  // Default positions if not found
  return 0;
}

function normalizeUnit(unit: string): string {
  const lower = unit.toLowerCase().replace(/\./g, "").replace(/\s/g, "");
  
  const unitMap: Record<string, string> = {
    "cubicmeter": "cum", "cu.m": "cum", "m3": "cum", "cum": "cum", "cumt": "cum",
    "squaremeter": "sqm", "sq.m": "sqm", "m2": "sqm", "sqm": "sqm", "sqmt": "sqm",
    "runningmeter": "rmt", "rm": "rmt", "rmt": "rmt", "meter": "rmt", "mtr": "rmt",
    "kilogram": "kg", "kg": "kg", "kgs": "kg",
    "numbers": "nos", "nos": "nos", "no": "nos", "each": "nos", "ea": "nos",
    "lumpsum": "ls", "ls": "ls", "lump": "ls",
    "litre": "ltr", "ltr": "ltr", "lt": "ltr",
    "kilolitre": "kl", "kl": "kl",
    "metricton": "mt", "mt": "mt", "tonne": "mt", "ton": "mt",
    "bag": "bag", "bags": "bag",
    "set": "set", "sets": "set",
    "point": "point", "pt": "point",
    "cubicfoot": "cft", "cft": "cft", "cuft": "cft",
    "squarefoot": "sft", "sft": "sft", "sqft": "sft",
    "brass": "brass",
    "quintal": "quintal", "qtl": "quintal",
    "pair": "pair", "pairs": "pair",
    "job": "job",
  };

  return unitMap[lower] || unit || "nos";
}

function detectCategory(description: string): string {
  const lower = description.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === "misc") continue;
    if (keywords.some(keyword => lower.includes(keyword))) {
      return category;
    }
  }
  
  return "misc";
}

export { UNIT_PATTERNS, CATEGORY_KEYWORDS };
