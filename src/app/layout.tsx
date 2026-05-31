import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Infinity Bid - AI BOQ Analyzer",
  description: "AI-powered Bill of Quantity analyzer for construction contractors. Get accurate material quantities, cost estimates, and financial DPR based on CPWD & Bihar DSR.",
  keywords: ["BOQ analyzer", "construction", "CPWD DSR", "Bihar DSR", "material estimation", "DPR"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
