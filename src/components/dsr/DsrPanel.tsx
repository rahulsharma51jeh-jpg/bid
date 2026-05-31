"use client";

import { useState, useEffect } from "react";
import { BookOpen, Search, Filter } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function DsrPanel() {
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"cpwd" | "bihar">("cpwd");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchRates();
  }, [source, category, search]);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        source,
        ...(category && { category }),
        ...(search && { search }),
      });
      const res = await fetch(`/api/dsr/rates?${params}`);
      const data = await res.json();
      if (data.success) {
        setRates(data.data.rates);
        setCategories(data.data.filters.categories);
      }
    } catch (err) {
      console.error("Failed to fetch rates:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          DSR Rate Book
        </h2>
        <p className="text-[var(--muted-foreground)] mt-1">
          Browse CPWD & Bihar DSR 2024 schedule of rates used for cost estimation
        </p>
      </div>

      {/* Filters */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Source Toggle */}
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
            <button
              onClick={() => setSource("cpwd")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                source === "cpwd"
                  ? "bg-blue-600 text-white"
                  : "bg-[var(--muted)] hover:bg-[var(--secondary)]"
              }`}
            >
              CPWD 2024
            </button>
            <button
              onClick={() => setSource("bihar")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                source === "bihar"
                  ? "bg-green-600 text-white"
                  : "bg-[var(--muted)] hover:bg-[var(--secondary)]"
              }`}
            >
              Bihar 2024
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search DSR items..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Rates Table */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-[var(--muted-foreground)]">Loading DSR rates...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--muted)] text-left">
                  <th className="px-4 py-3 font-medium">Item Code</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Chapter</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Unit</th>
                  <th className="px-4 py-3 font-medium text-right">Rate</th>
                  <th className="px-4 py-3 font-medium text-right">Labor</th>
                  <th className="px-4 py-3 font-medium text-right">Material</th>
                  <th className="px-4 py-3 font-medium text-right">Equipment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {rates.map((rate, index) => (
                  <tr key={index} className="hover:bg-[var(--muted)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-blue-600">{rate.itemCode}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="truncate" title={rate.description}>{rate.description}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{rate.chapter}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--muted)] capitalize">
                        {rate.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{rate.unit}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatCurrency(rate.rate)}</td>
                    <td className="px-4 py-3 text-right text-green-600">{rate.laborRate ? formatCurrency(rate.laborRate) : "-"}</td>
                    <td className="px-4 py-3 text-right text-blue-600">{rate.materialRate ? formatCurrency(rate.materialRate) : "-"}</td>
                    <td className="px-4 py-3 text-right text-yellow-600">{rate.equipmentRate ? formatCurrency(rate.equipmentRate) : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && rates.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-[var(--muted-foreground)]">No rates found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Rate Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
          <p className="text-xs font-medium text-green-700 dark:text-green-300">Labor Component</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Includes skilled & unskilled labor rates as per minimum wages
          </p>
        </div>
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Material Component</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Based on prevalent market rates including transportation
          </p>
        </div>
        <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
          <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Equipment Component</p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
            Hire charges for machinery including fuel & operator
          </p>
        </div>
      </div>
    </div>
  );
}
