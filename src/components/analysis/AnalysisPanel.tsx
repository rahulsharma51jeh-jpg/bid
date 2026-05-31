"use client";

import { 
  Package, 
  IndianRupee, 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon,
  Download,
  AlertCircle
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface AnalysisPanelProps {
  data: any;
}

export default function AnalysisPanel({ data }: AnalysisPanelProps) {
  if (!data) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center py-20">
          <BarChart3 className="w-16 h-16 mx-auto text-[var(--muted-foreground)] mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Analysis Data</h2>
          <p className="text-[var(--muted-foreground)]">
            Upload a BOQ file first to see material analysis results
          </p>
        </div>
      </div>
    );
  }

  const { analysis, financialDpr, metadata, fileName, itemCount } = data;
  const { summary, materials, categoryBreakdown } = analysis;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">BOQ Analysis Results</h2>
          <p className="text-[var(--muted-foreground)] mt-1">
            {fileName} - {itemCount} items analyzed
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          icon={IndianRupee}
          label="Total Estimated Cost"
          value={formatCurrency(summary.estimatedCost)}
          color="blue"
        />
        <SummaryCard
          icon={Package}
          label="Total Materials"
          value={`${summary.totalMaterials} items`}
          color="green"
        />
        <SummaryCard
          icon={TrendingUp}
          label="AI Confidence"
          value={`${(summary.confidence * 100).toFixed(0)}%`}
          color="purple"
        />
        <SummaryCard
          icon={BarChart3}
          label="BOQ Items"
          value={`${summary.totalItems} items`}
          color="orange"
        />
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-blue-600" />
            Cost Breakdown
          </h3>
          <div className="space-y-4">
            <CostBar label="Material Cost" amount={summary.materialCost} total={summary.estimatedCost} color="bg-blue-500" />
            <CostBar label="Labor Cost" amount={summary.laborCost} total={summary.estimatedCost} color="bg-green-500" />
            <CostBar label="Equipment Cost" amount={summary.equipmentCost} total={summary.estimatedCost} color="bg-yellow-500" />
            <CostBar label="Overhead & Profit" amount={summary.overheadCost} total={summary.estimatedCost} color="bg-purple-500" />
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(summary.estimatedCost)}</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Category-wise Breakdown
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {categoryBreakdown.map((cat: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[var(--muted)]">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(cat.category)}`}></div>
                  <div>
                    <p className="text-sm font-medium capitalize">{cat.category}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{cat.materialCount} materials</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(cat.totalCost)}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{cat.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Material Details Table */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-600" />
          Material Quantity Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--muted)] text-left">
                <th className="px-4 py-3 font-medium rounded-tl-lg">#</th>
                <th className="px-4 py-3 font-medium">Material</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium text-right">Quantity</th>
                <th className="px-4 py-3 font-medium">Unit</th>
                <th className="px-4 py-3 font-medium text-right">Rate</th>
                <th className="px-4 py-3 font-medium text-right">Wastage</th>
                <th className="px-4 py-3 font-medium text-right">Total Qty</th>
                <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {materials.slice(0, 20).map((mat: any, index: number) => (
                <tr key={index} className="hover:bg-[var(--muted)] transition-colors">
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{mat.materialName}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getCategoryBadgeColor(mat.category)}`}>
                      {mat.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{formatNumber(mat.quantity)}</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">{mat.unit}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(mat.rate || 0)}</td>
                  <td className="px-4 py-3 text-right text-orange-600">{mat.wastagePercent}%</td>
                  <td className="px-4 py-3 text-right font-medium">{formatNumber(mat.totalWithWastage)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatCurrency(mat.amount || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {materials.length > 20 && (
          <p className="text-sm text-center text-[var(--muted-foreground)] mt-4">
            Showing top 20 of {materials.length} materials
          </p>
        )}
      </div>

      {/* AI Notes */}
      <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Analysis Notes</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Rates are based on {data.analysis?.materials?.[0]?.source === "bihar" ? "Bihar" : "CPWD"} DSR 2024. 
            Wastage percentages are calculated per IS standards. Actual costs may vary based on local market conditions.
            Confidence: {(summary.confidence * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color }: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    purple: "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    orange: "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <Icon className="w-6 h-6 mb-2" />
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-lg font-bold mt-1">{value}</p>
    </div>
  );
}

function CostBar({ label, amount, total, color }: {
  label: string;
  amount: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (amount / total) * 100 : 0;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-medium">{formatCurrency(amount)} ({percentage.toFixed(0)}%)</span>
      </div>
      <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    concrete: "bg-blue-500",
    masonry: "bg-red-500",
    steel: "bg-gray-700",
    plastering: "bg-yellow-500",
    flooring: "bg-purple-500",
    painting: "bg-pink-500",
    plumbing: "bg-cyan-500",
    electrical: "bg-orange-500",
    earthwork: "bg-amber-700",
    waterproofing: "bg-teal-500",
    woodwork: "bg-amber-500",
    misc: "bg-gray-400",
  };
  return colors[category] || "bg-gray-400";
}

function getCategoryBadgeColor(category: string): string {
  const colors: Record<string, string> = {
    concrete: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    masonry: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    steel: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    plastering: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    flooring: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    painting: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
    plumbing: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
    electrical: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    earthwork: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    waterproofing: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    woodwork: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  };
  return colors[category] || "bg-gray-100 text-gray-700";
}
