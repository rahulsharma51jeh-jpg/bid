# Infinity Bid - AI BOQ Analyzer Tool

## System Architecture

### Overview
AI-powered Bill of Quantity (BOQ) analyzer for construction contractors.
Upload BOQ → Get material breakdowns, quantity analysis, and financial DPR with DSR-based pricing.

### Tech Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes (serverless-ready)
- **Database**: SQLite (MVP) → PostgreSQL (production) via Prisma ORM
- **AI Engine**: Custom DSR-trained analysis engine + OpenAI integration
- **File Parsing**: xlsx library for Excel/CSV parsing
- **DSR Data**: CPWD DSR 2024 + Bihar DSR 2024 (58 rate items)

### Key Features
1. **BOQ Upload & Parse** - Upload Excel/CSV BOQ files
2. **AI Material Extraction** - Identify materials, quantities, units
3. **DSR Rate Mapping** - Map items to CPWD/Bihar DSR rates
4. **Quantity Analysis** - Calculate total material requirements with wastage
5. **Financial DPR** - Daily Progress Report with cost breakdown
6. **Cost Estimation** - Accurate project cost based on DSR 2024

### File Structure
```
infinity-bid/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── boq/upload/route.ts       # BOQ file upload & analysis
│   │   │   ├── analysis/[id]/route.ts    # Fetch analysis results
│   │   │   ├── dsr/rates/route.ts        # DSR rate lookup
│   │   │   └── projects/route.ts         # Project management
│   │   ├── layout.tsx
│   │   ├── page.tsx                       # Main SPA entry
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/                        # Header, Sidebar
│   │   ├── dashboard/                     # Dashboard panel
│   │   ├── boq/                           # Upload panel
│   │   ├── analysis/                      # Analysis results
│   │   ├── dpr/                           # Financial DPR
│   │   └── dsr/                           # DSR rate browser
│   ├── lib/
│   │   ├── db.ts                          # Prisma client
│   │   ├── utils.ts                       # Utility functions
│   │   ├── boq-parser.ts                  # Excel/CSV parsing engine
│   │   └── ai-analyzer.ts                 # AI analysis engine
│   ├── data/
│   │   ├── dsr-cpwd.ts                    # CPWD DSR 2024 rates
│   │   └── dsr-bihar.ts                   # Bihar DSR 2024 rates
│   └── types/
│       └── index.ts                       # TypeScript types
├── prisma/
│   └── schema.prisma                      # Database schema
├── uploads/                               # Uploaded BOQ files
└── package.json
```
