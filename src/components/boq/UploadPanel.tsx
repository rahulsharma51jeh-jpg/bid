"use client";

import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";

interface UploadPanelProps {
  onAnalysisComplete: (data: any) => void;
}

export default function UploadPanel({ onAnalysisComplete }: UploadPanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState("");
  const [dsrSource, setDsrSource] = useState<"cpwd" | "bihar">("cpwd");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, []);

  const validateAndSetFile = (selectedFile: File) => {
    const validExtensions = [".xlsx", ".xls", ".csv"];
    const extension = "." + selectedFile.name.split(".").pop()?.toLowerCase();
    
    if (!validExtensions.includes(extension)) {
      setError("Invalid file type. Please upload .xlsx, .xls, or .csv files");
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum size is 10MB");
      return;
    }

    setFile(selectedFile);
    setError(null);
    
    if (!projectName) {
      setProjectName(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectName", projectName || file.name);
      formData.append("dsrSource", dsrSource);

      const response = await fetch("/api/boq/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || "Upload failed. Please try again.");
        return;
      }

      onAnalysisComplete(result.data);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Upload Bill of Quantity</h2>
        <p className="text-[var(--muted-foreground)] mt-1">
          Upload your BOQ file (Excel/CSV) and our AI will analyze materials, quantities, and costs
        </p>
      </div>

      {/* Project Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name (e.g., Residential Building - Phase 1)"
          className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* DSR Source Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">DSR Rate Source</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setDsrSource("cpwd")}
            className={`p-4 rounded-lg border-2 transition-all ${
              dsrSource === "cpwd"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                : "border-[var(--border)] hover:border-blue-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="font-bold text-blue-700 dark:text-blue-300 text-sm">CPWD</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">CPWD DSR 2024</p>
                <p className="text-xs text-[var(--muted-foreground)]">Central PWD - Delhi Rates</p>
              </div>
            </div>
            {dsrSource === "cpwd" && (
              <CheckCircle2 className="w-5 h-5 text-blue-600 absolute top-3 right-3" />
            )}
          </button>
          <button
            onClick={() => setDsrSource("bihar")}
            className={`p-4 rounded-lg border-2 transition-all ${
              dsrSource === "bihar"
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : "border-[var(--border)] hover:border-green-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <span className="font-bold text-green-700 dark:text-green-300 text-sm">Bihar</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Bihar DSR 2024</p>
                <p className="text-xs text-[var(--muted-foreground)]">Bihar State PWD Rates</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* File Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
            : file
            ? "border-green-500 bg-green-50 dark:bg-green-950"
            : "border-[var(--border)] hover:border-blue-400 hover:bg-[var(--muted)]"
        }`}
      >
        {file ? (
          <div className="animate-fade-in">
            <CheckCircle2 className="w-12 h-12 mx-auto text-green-600 mb-4" />
            <p className="font-medium text-green-700 dark:text-green-300">{file.name}</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              {(file.size / 1024).toFixed(1)} KB - Ready to analyze
            </p>
            <button
              onClick={() => { setFile(null); setError(null); }}
              className="mt-3 text-sm text-red-600 hover:text-red-700 flex items-center gap-1 mx-auto"
            >
              <X className="w-4 h-4" /> Remove file
            </button>
          </div>
        ) : (
          <>
            <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? "text-blue-600" : "text-[var(--muted-foreground)]"}`} />
            <p className="font-medium">
              {dragActive ? "Drop your BOQ file here" : "Drag & drop your BOQ file here"}
            </p>
            <p className="text-sm text-[var(--muted-foreground)] mt-2">
              or click to browse files
            </p>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center justify-center gap-2 mt-4">
              <FileSpreadsheet className="w-4 h-4 text-green-600" />
              <span className="text-xs text-[var(--muted-foreground)]">
                Supports: .xlsx, .xls, .csv (Max 10MB)
              </span>
            </div>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`mt-6 w-full py-4 rounded-xl font-semibold text-white text-lg transition-all ${
          !file || uploading
            ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
        }`}
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing BOQ with AI...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Upload className="w-5 h-5" />
            Analyze BOQ
          </span>
        )}
      </button>

      {/* Download Sample */}
      <div className="mt-6 text-center">
        <a
          href="/api/sample"
          download="sample-boq-residential.xlsx"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Download Sample BOQ File (Excel)
        </a>
      </div>

      {/* BOQ Format Guide */}
      <div className="mt-8 bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
        <h3 className="font-semibold mb-3">Expected BOQ Format</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--muted)]">
                <th className="border border-[var(--border)] px-3 py-2 text-left">Sl No</th>
                <th className="border border-[var(--border)] px-3 py-2 text-left">Item Code</th>
                <th className="border border-[var(--border)] px-3 py-2 text-left">Description</th>
                <th className="border border-[var(--border)] px-3 py-2 text-left">Unit</th>
                <th className="border border-[var(--border)] px-3 py-2 text-left">Quantity</th>
                <th className="border border-[var(--border)] px-3 py-2 text-left">Rate</th>
                <th className="border border-[var(--border)] px-3 py-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-[var(--border)] px-3 py-2">1</td>
                <td className="border border-[var(--border)] px-3 py-2">4.1</td>
                <td className="border border-[var(--border)] px-3 py-2">PCC 1:4:8 in foundation</td>
                <td className="border border-[var(--border)] px-3 py-2">cum</td>
                <td className="border border-[var(--border)] px-3 py-2">25.5</td>
                <td className="border border-[var(--border)] px-3 py-2">5765</td>
                <td className="border border-[var(--border)] px-3 py-2">147008</td>
              </tr>
              <tr>
                <td className="border border-[var(--border)] px-3 py-2">2</td>
                <td className="border border-[var(--border)] px-3 py-2">5.1</td>
                <td className="border border-[var(--border)] px-3 py-2">Brick work in CM 1:6</td>
                <td className="border border-[var(--border)] px-3 py-2">cum</td>
                <td className="border border-[var(--border)] px-3 py-2">42.0</td>
                <td className="border border-[var(--border)] px-3 py-2">7250</td>
                <td className="border border-[var(--border)] px-3 py-2">304500</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mt-3">
          The AI can detect various column formats. Ensure your BOQ has at least Description, Unit, and Quantity columns.
        </p>
      </div>
    </div>
  );
}
