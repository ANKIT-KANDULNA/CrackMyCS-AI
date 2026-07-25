import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "CrackMyCS AI — Master CS Fundamentals",
  description: "AI-powered RAG assistant for CS interview prep. Get structured answers on OS, DBMS, OOPs, CN, System Design & Software Engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, jetbrains.variable, "font-sans antialiased")}>
        {/* Animated Background */}
        <div className="fixed inset-0 bg-grid pointer-events-none z-0"></div>
        <div className="fixed w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0 opacity-50 bg-[var(--accent-glow)] -top-[10%] -left-[5%] animate-glow-1"></div>
        <div className="fixed w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none z-0 opacity-50 bg-[var(--purple-glow)] -bottom-[10%] -right-[5%] animate-glow-2"></div>
        
        {children}
      </body>
    </html>
  );
}
