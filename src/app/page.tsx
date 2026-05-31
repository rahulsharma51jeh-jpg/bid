"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import DashboardPanel from "@/components/dashboard/DashboardPanel";
import UploadPanel from "@/components/boq/UploadPanel";
import AnalysisPanel from "@/components/analysis/AnalysisPanel";
import DprPanel from "@/components/dpr/DprPanel";
import DsrPanel from "@/components/dsr/DsrPanel";

export type ActivePanel = "dashboard" | "upload" | "analysis" | "dpr" | "dsr";

export default function Home() {
  const [activePanel, setActivePanel] = useState<ActivePanel>("dashboard");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data);
    setActivePanel("analysis");
  };

  const renderPanel = () => {
    switch (activePanel) {
      case "dashboard":
        return <DashboardPanel onNavigate={setActivePanel} />;
      case "upload":
        return <UploadPanel onAnalysisComplete={handleAnalysisComplete} />;
      case "analysis":
        return <AnalysisPanel data={analysisData} />;
      case "dpr":
        return <DprPanel data={analysisData?.financialDpr} />;
      case "dsr":
        return <DsrPanel />;
      default:
        return <DashboardPanel onNavigate={setActivePanel} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar
          activePanel={activePanel}
          onNavigate={setActivePanel}
          isOpen={sidebarOpen}
        />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"} p-6`}>
          {renderPanel()}
        </main>
      </div>
    </div>
  );
}
