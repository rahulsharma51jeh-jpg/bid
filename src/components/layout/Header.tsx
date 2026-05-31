"use client";

import { Menu, Bell, Search, User } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-[var(--border)] bg-[var(--card)] flex items-center px-4 shadow-sm">
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center ml-4 gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">IB</span>
        </div>
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Infinity Bid
        </h1>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium ml-1">
          AI BOQ Analyzer
        </span>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search projects, materials, DSR items..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-[var(--border)]">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">Demo User</p>
            <p className="text-xs text-[var(--muted-foreground)]">Contractor</p>
          </div>
        </div>
      </div>
    </header>
  );
}
