import * as XLSX from "xlsx";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

/**
 * Generate a sample BOQ Excel file for testing
 */
export function generateSampleBoq(): Buffer {
  const data = [
    ["Sl No", "Item Code", "Description", "Unit", "Quantity", "Rate", "Amount"],
    [1, "1.1", "Earth work in excavation in foundation trenches in ordinary soil (depth up to 1.5m)", "cum", 85.5, 282, 24111],
    [2, "1.3", "Sand filling in plinth under floor including watering and ramming", "cum", 42.0, 1175, 49350],
    [3, "4.1", "Providing and laying PCC 1:4:8 with 40mm aggregate in foundation", "cum", 28.5, 5765, 164303],
    [4, "4.4", "Providing and laying RCC M-20 grade in roof slab, beams, columns", "cum", 65.0, 8950, 581750],
    [5, "4.5", "Providing and laying RCC M-25 grade in raft foundation", "cum", 35.0, 9450, 330750],
    [6, "5.1", "Brick work with first class bricks in cement mortar 1:6 in foundation", "cum", 48.0, 7250, 348000],
    [7, "5.2", "Brick work in cement mortar 1:4 in superstructure above plinth level", "cum", 92.0, 8150, 749800],
    [8, "6.1", "HYSD steel bars Fe-500D for RCC work including cutting bending", "kg", 12500, 84, 1050000],
    [9, "8.1", "12mm cement plaster 1:6 on walls including curing", "sqm", 1850, 235, 434750],
    [10, "8.2", "15mm cement plaster 1:4 on external walls", "sqm", 920, 295, 271400],
    [11, "8.3", "20mm cement plaster 1:4 on ceiling", "sqm", 580, 385, 223300],
    [12, "9.1", "Vitrified floor tiles 600x600mm with cement mortar bedding", "sqm", 680, 1450, 986000],
    [13, "9.2", "Ceramic wall tiles 300x300mm in toilets and kitchen", "sqm", 320, 1050, 336000],
    [14, "10.2", "Acrylic emulsion paint two coats on internal walls", "sqm", 2400, 125, 300000],
    [15, "10.3", "Synthetic enamel paint on doors and windows", "sqm", 180, 145, 26100],
    [16, "11.1", "CPVC pipe 20mm with fittings for water supply", "rmt", 450, 185, 83250],
    [17, "11.2", "PVC pipe 110mm for soil and waste drainage", "rmt", 280, 420, 117600],
    [18, "12.1", "Wiring for light/fan point with PVC copper conductor 1.5sqmm", "point", 85, 1250, 106250],
    [19, "12.2", "Wiring for power plug point with 4sqmm conductor", "point", 42, 1850, 77700],
    [20, "13.1", "Waterproofing treatment on roof with bitumen felt", "sqm", 580, 485, 281300],
    [21, "14.1", "Flush door shutter 35mm thick commercial grade with hardware", "sqm", 45, 4850, 218250],
    [22, "14.2", "Aluminium sliding window with 5mm glass", "sqm", 68, 6500, 442000],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "BOQ");
  
  // Set column widths
  worksheet["!cols"] = [
    { wch: 6 },  // Sl No
    { wch: 10 }, // Item Code
    { wch: 60 }, // Description
    { wch: 8 },  // Unit
    { wch: 10 }, // Quantity
    { wch: 10 }, // Rate
    { wch: 12 }, // Amount
  ];

  return Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
}

// Script to generate and save sample BOQ
if (require.main === module) {
  const samplesDir = join(process.cwd(), "samples");
  if (!existsSync(samplesDir)) mkdirSync(samplesDir, { recursive: true });
  
  const buffer = generateSampleBoq();
  writeFileSync(join(samplesDir, "sample-boq-residential.xlsx"), buffer);
  console.log("Sample BOQ generated at samples/sample-boq-residential.xlsx");
}
