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
      <body className={cn(inter.variable, jetbrains.variable, "font-sans antialiased bg-white")}>
        {children}
      </body>
    </html>
  );
}
