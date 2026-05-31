"use client";

import { 
  FileSpreadsheet, 
  IndianRupee, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  BarChart3
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DprPanelProps {
  data: any;
}

export default function DprPanel({ data }: DprPanelProps) {
  if (!data) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center py-20">
          <FileSpreadsheet className="w-16 h-16 mx-auto text-[var(--muted-foreground)] mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Financial DPR Data</h2>
          <p className="text-[var(--muted-foreground)]">
            Upload a BOQ file first to generate Financial Daily Progress Report
          </p>
        </div>
      </div>
    );
  }

  const { projectSummary, dprEntries, costBreakdown } = data;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Financial Daily Progress Report</h2>
          <p className="text-[var(--muted-foreground)] mt-1">
            Project cost tracking and daily expense analysis based on DSR rates
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Download className="w-4 h-4" />
          Export DPR
        </button>
      </div>

      {/* Project Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <BudgetCard
          icon={IndianRupee}
          label="Total Project Budget"
          value={formatCurrency(projectSummary.totalBudget)}
          subtitle="Based on DSR 2024"
          color="blue"
        />
        <BudgetCard
          icon={Calendar}
          label="Project Duration"
          value={`${projectSummary.duration} Days`}
          subtitle={`Daily: ${formatCurrency(projectSummary.dailyBudget)}`}
          color="green"
        />
        <BudgetCard
          icon={TrendingUp}
          label="Labor Budget"
          value={formatCurrency(projectSummary.laborBudget)}
          subtitle={`${costBreakdown.labor}% of total`}
          color="purple"
        />
        <BudgetCard
          icon={BarChart3}
          label="Material Budget"
          value={formatCurrency(projectSummary.materialBudget)}
          subtitle={`${costBreakdown.material}% of total`}
          color="orange"
        />
      </div>

      {/* Cost Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Budget Allocation */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
          <h3 className="font-semibold mb-4">Budget Allocation</h3>
          <div className="space-y-4">
            <BudgetBar 
              label="Labor" 
              amount={projectSummary.laborBudget} 
              percentage={costBreakdown.labor} 
              color="bg-green-500" 
            />
            <BudgetBar 
              label="Materials" 
              amount={projectSummary.materialBudget} 
              percentage={costBreakdown.material} 
              color="bg-blue-500" 
            />
            <BudgetBar 
              label="Equipment" 
              amount={projectSummary.equipmentBudget} 
              percentage={costBreakdown.equipment} 
              color="bg-yellow-500" 
            />
            <BudgetBar 
              label="Overhead & Profit" 
              amount={projectSummary.overheadBudget} 
              percentage={costBreakdown.overhead} 
              color="bg-purple-500" 
            />
          </div>
        </div>

        {/* Visual Budget Pie */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
          <h3 className="font-semibold mb-4">Cost Distribution</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                <circle 
                  cx="50" cy="50" r="40" fill="none" 
                  stroke="#3b82f6" strokeWidth="12"
                  strokeDasharray={`${costBreakdown.material * 2.51} 251`}
                  strokeDashoffset="0"
                />
                <circle 
                  cx="50" cy="50" r="40" fill="none" 
                  stroke="#22c55e" strokeWidth="12"
                  strokeDasharray={`${costBreakdown.labor * 2.51} 251`}
                  strokeDashoffset={`-${costBreakdown.material * 2.51}`}
                />
                <circle 
                  cx="50" cy="50" r="40" fill="none" 
                  stroke="#eab308" strokeWidth="12"
                  strokeDasharray={`${costBreakdown.equipment * 2.51} 251`}
                  strokeDashoffset={`-${(costBreakdown.material + costBreakdown.labor) * 2.51}`}
                />
                <circle 
                  cx="50" cy="50" r="40" fill="none" 
                  stroke="#a855f7" strokeWidth="12"
                  strokeDasharray={`${costBreakdown.overhead * 2.51} 251`}
                  strokeDashoffset={`-${(costBreakdown.material + costBreakdown.labor + costBreakdown.equipment) * 2.51}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-bold">{formatCurrency(projectSummary.totalBudget)}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Total</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <LegendItem color="bg-blue-500" label="Materials" value={`${costBreakdown.material}%`} />
            <LegendItem color="bg-green-500" label="Labor" value={`${costBreakdown.labor}%`} />
            <LegendItem color="bg-yellow-500" label="Equipment" value={`${costBreakdown.equipment}%`} />
            <LegendItem color="bg-purple-500" label="Overhead" value={`${costBreakdown.overhead}%`} />
          </div>
        </div>
      </div>

      {/* Daily Progress Table */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Daily Progress Report (Sample Week)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--muted)] text-left">
                <th className="px-4 py-3 font-medium rounded-tl-lg">Day</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Planned Cost</th>
                <th className="px-4 py-3 font-medium text-right">Actual Cost</th>
                <th className="px-4 py-3 font-medium text-right">Cumulative (P)</th>
                <th className="px-4 py-3 font-medium text-right">Cumulative (A)</th>
                <th className="px-4 py-3 font-medium text-right">Variance</th>
                <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {dprEntries.map((entry: any, index: number) => (
                <tr key={index} className="hover:bg-[var(--muted)] transition-colors">
                  <td className="px-4 py-3 font-medium">Day {entry.day}</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">{entry.date}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(entry.plannedCost)}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(entry.actualCost)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(entry.cumulativePlanned)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(entry.cumulativeActual)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`flex items-center justify-end gap-1 ${entry.variance >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {entry.variance >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {formatCurrency(Math.abs(entry.variance))}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {entry.physicalProgress}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DPR Notes */}
      <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-700 dark:text-amber-300">
          <strong>Note:</strong> This is a projected DPR based on BOQ analysis. Actual daily costs will vary 
          based on work progress, weather conditions, and resource availability. Update daily for accurate tracking.
        </p>
      </div>
    </div>
  );
}

function BudgetCard({ icon: Icon, label, value, subtitle, color }: {
  icon: any;
  label: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
    purple: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
    orange: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800",
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <Icon className="w-5 h-5 mb-2 text-[var(--muted-foreground)]" />
      <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
      <p className="text-lg font-bold mt-1">{value}</p>
      <p className="text-xs text-[var(--muted-foreground)] mt-1">{subtitle}</p>
    </div>
  );
}

function BudgetBar({ label, amount, percentage, color }: {
  label: string;
  amount: number;
  percentage: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span>{formatCurrency(amount)} ({percentage}%)</span>
      </div>
      <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function LegendItem({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <span className="text-xs">{label}: <strong>{value}</strong></span>
    </div>
  );
}
