"use client";

import { 
  Upload, 
  BarChart3, 
  FileSpreadsheet, 
  IndianRupee,
  TrendingUp,
  Package,
  Building2,
  ArrowRight
} from "lucide-react";
import { ActivePanel } from "@/app/page";

interface DashboardPanelProps {
  onNavigate: (panel: ActivePanel) => void;
}

export default function DashboardPanel({ onNavigate }: DashboardPanelProps) {
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Welcome to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Infinity Bid</span>
        </h1>
        <p className="text-[var(--muted-foreground)] mt-2 text-lg">
          AI-powered BOQ Analysis, Material Estimation & Financial DPR for Construction Projects
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <QuickActionCard
          icon={Upload}
          title="Upload BOQ"
          description="Upload your Excel/CSV Bill of Quantity for instant AI analysis"
          color="blue"
          onClick={() => onNavigate("upload")}
        />
        <QuickActionCard
          icon={BarChart3}
          title="View Analysis"
          description="Material breakdown, quantity analysis & cost estimation"
          color="green"
          onClick={() => onNavigate("analysis")}
        />
        <QuickActionCard
          icon={FileSpreadsheet}
          title="Financial DPR"
          description="Generate Daily Progress Reports with accurate expenses"
          color="purple"
          onClick={() => onNavigate("dpr")}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Building2} label="Projects Analyzed" value="0" trend="+0%" />
        <StatCard icon={Package} label="Materials Tracked" value="30+" trend="CPWD+Bihar" />
        <StatCard icon={IndianRupee} label="DSR Rate Items" value="58" trend="2024 Rates" />
        <StatCard icon={TrendingUp} label="AI Accuracy" value="85%" trend="v1.0" />
      </div>

      {/* Features Section */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StepCard step={1} title="Upload BOQ" description="Upload your Excel/PDF Bill of Quantity file" />
          <StepCard step={2} title="AI Parsing" description="AI extracts items, quantities, and maps to DSR" />
          <StepCard step={3} title="Material Analysis" description="Get exact material quantities with wastage" />
          <StepCard step={4} title="Financial DPR" description="Generate cost reports based on CPWD/Bihar DSR" />
        </div>
      </div>

      {/* DSR Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">C</span>
            CPWD DSR 2024
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
            Central Public Works Department - Delhi Schedule of Rates 2024. 
            Covers 30+ item categories including earthwork, concrete, masonry, steel, plumbing & electrical.
          </p>
          <button 
            onClick={() => onNavigate("dsr")}
            className="mt-3 text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1 hover:underline"
          >
            Browse CPWD Rates <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
            <span className="w-6 h-6 bg-green-600 rounded text-white flex items-center justify-center text-xs font-bold">B</span>
            Bihar DSR 2024
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300 mt-2">
            Bihar State PWD Schedule of Rates 2024. 
            State-specific rates adjusted for local market conditions, 10-20% lower than CPWD rates.
          </p>
          <button 
            onClick={() => onNavigate("dsr")}
            className="mt-3 text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-1 hover:underline"
          >
            Browse Bihar Rates <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ icon: Icon, title, description, color, onClick }: {
  icon: any;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}) {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800",
    green: "from-green-500 to-green-700 hover:from-green-600 hover:to-green-800",
    purple: "from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800",
  };

  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${colorClasses[color]} p-6 rounded-xl text-white text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-xl shadow-lg group`}
    >
      <Icon className="w-8 h-8 mb-3 opacity-90 group-hover:opacity-100" />
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm opacity-80 mt-1">{description}</p>
      <div className="flex items-center gap-1 mt-3 text-sm opacity-70 group-hover:opacity-100">
        Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}

function StatCard({ icon: Icon, label, value, trend }: {
  icon: any;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 text-[var(--muted-foreground)]" />
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 font-medium">
          {trend}
        </span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
    </div>
  );
}

function StepCard({ step, title, description }: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 mx-auto rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold mb-3">
        {step}
      </div>
      <h4 className="font-medium text-sm">{title}</h4>
      <p className="text-xs text-[var(--muted-foreground)] mt-1">{description}</p>
    </div>
  );
}
