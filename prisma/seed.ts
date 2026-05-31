import { PrismaClient } from "../src/generated/prisma/client";
import { cpwdDsrRates } from "../src/data/dsr-cpwd";
import { biharDsrRates } from "../src/data/dsr-bihar";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding DSR rates...");

  // Seed CPWD rates
  for (const rate of cpwdDsrRates) {
    await prisma.dsrRate.upsert({
      where: {
        itemCode_source_year: {
          itemCode: rate.itemCode,
          source: rate.source,
          year: rate.year,
        },
      },
      update: { rate: rate.rate },
      create: {
        itemCode: rate.itemCode,
        description: rate.description,
        unit: rate.unit,
        rate: rate.rate,
        chapter: rate.chapter,
        category: rate.category,
        source: rate.source,
        year: rate.year,
        laborRate: rate.laborRate,
        materialRate: rate.materialRate,
        equipmentRate: rate.equipmentRate,
      },
    });
  }
  console.log(`Seeded ${cpwdDsrRates.length} CPWD DSR rates`);

  // Seed Bihar rates
  for (const rate of biharDsrRates) {
    await prisma.dsrRate.upsert({
      where: {
        itemCode_source_year: {
          itemCode: rate.itemCode,
          source: rate.source,
          year: rate.year,
        },
      },
      update: { rate: rate.rate },
      create: {
        itemCode: rate.itemCode,
        description: rate.description,
        unit: rate.unit,
        rate: rate.rate,
        chapter: rate.chapter,
        category: rate.category,
        source: rate.source,
        year: rate.year,
        laborRate: rate.laborRate,
        materialRate: rate.materialRate,
        equipmentRate: rate.equipmentRate,
      },
    });
  }
  console.log(`Seeded ${biharDsrRates.length} Bihar DSR rates`);

  // Seed material master
  const materials = [
    { name: "OPC Cement 43 Grade", code: "MAT-001", unit: "bag", category: "cement", currentRate: 380 },
    { name: "PPC Cement", code: "MAT-002", unit: "bag", category: "cement", currentRate: 360 },
    { name: "Coarse Sand", code: "MAT-003", unit: "cum", category: "sand", currentRate: 1850 },
    { name: "Fine Sand", code: "MAT-004", unit: "cum", category: "sand", currentRate: 2100 },
    { name: "Stone Aggregate 20mm", code: "MAT-005", unit: "cum", category: "aggregate", currentRate: 1650 },
    { name: "Stone Aggregate 40mm", code: "MAT-006", unit: "cum", category: "aggregate", currentRate: 1500 },
    { name: "First Class Bricks", code: "MAT-007", unit: "nos", category: "brick", currentRate: 8.5 },
    { name: "HYSD Steel Fe-500D", code: "MAT-008", unit: "kg", category: "steel", currentRate: 68 },
    { name: "Structural Steel", code: "MAT-009", unit: "kg", category: "steel", currentRate: 85 },
    { name: "Vitrified Tiles 600x600", code: "MAT-010", unit: "sqm", category: "tiles", currentRate: 750 },
    { name: "Ceramic Tiles 300x300", code: "MAT-011", unit: "sqm", category: "tiles", currentRate: 420 },
    { name: "Acrylic Emulsion Paint", code: "MAT-012", unit: "ltr", category: "paint", currentRate: 320 },
    { name: "CPVC Pipe 20mm", code: "MAT-013", unit: "rmt", category: "plumbing", currentRate: 85 },
    { name: "PVC Pipe 110mm", code: "MAT-014", unit: "rmt", category: "plumbing", currentRate: 210 },
    { name: "Copper Wire 1.5 sqmm", code: "MAT-015", unit: "rmt", category: "electrical", currentRate: 22 },
  ];

  for (const mat of materials) {
    await prisma.material.upsert({
      where: { code: mat.code },
      update: { currentRate: mat.currentRate },
      create: mat,
    });
  }
  console.log(`Seeded ${materials.length} materials`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
