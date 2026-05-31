"use client";

import { 
  LayoutDashboard, 
  Upload, 
  BarChart3, 
  FileSpreadsheet, 
  BookOpen,
  Settings,
  HelpCircle 
} from "lucide-react";
import { ActivePanel } from "@/app/page";

interface SidebarProps {
  activePanel: ActivePanel;
  onNavigate: (panel: ActivePanel) => void;
  isOpen: boolean;
}

const navItems = [
  { id: "dashboard" as ActivePanel, label: "Dashboard", icon: LayoutDashboard },
  { id: "upload" as ActivePanel, label: "Upload BOQ", icon: Upload },
  { id: "analysis" as ActivePanel, label: "Analysis", icon: BarChart3 },
  { id: "dpr" as ActivePanel, label: "Financial DPR", icon: FileSpreadsheet },
  { id: "dsr" as ActivePanel, label: "DSR Rates", icon: BookOpen },
];

export default function Sidebar({ activePanel, onNavigate, isOpen }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[var(--card)] border-r border-[var(--border)] transition-all duration-300 z-40 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                  : "hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-blue-600" : ""}`} />
              {isOpen && (
                <span className={`text-sm font-medium ${isActive ? "font-semibold" : ""}`}>
                  {item.label}
                </span>
              )}
              {isActive && isOpen && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></div>
              )}
            </button>
          );
        })}
      </nav>

      {isOpen && (
        <div className="absolute bottom-4 left-3 right-3 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm">Help & Support</span>
          </button>
          
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-100 dark:border-blue-900">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">DSR Trained Model</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">CPWD 2024 + Bihar 2024</p>
            <div className="mt-2 flex gap-1">
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">CPWD</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">Bihar</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
