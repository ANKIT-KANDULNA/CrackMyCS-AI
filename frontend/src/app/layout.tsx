import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CrackMyCS AI — Master CS Fundamentals for Interviews",
  description:
    "AI-powered RAG assistant for CS interview prep. Get structured, interview-ready answers on OS, DBMS, OOPs, Computer Networks, System Design & Software Engineering — grounded in your own knowledge base.",
  keywords: [
    "CS interview prep",
    "computer science fundamentals",
    "operating systems",
    "DBMS",
    "OOP",
    "system design",
    "software engineering",
    "RAG AI",
    "LangChain",
    "Groq",
    "FAISS",
  ],
  authors: [{ name: "CrackMyCS AI" }],
  openGraph: {
    title: "CrackMyCS AI — Master CS Fundamentals for Interviews",
    description:
      "RAG-powered AI assistant for CS interview prep. Answers grounded in your own curated knowledge base.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrackMyCS AI — Master CS Fundamentals for Interviews",
    description:
      "RAG-powered AI assistant for CS interview prep. Answers grounded in your own curated knowledge base.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white">
        {children}
      </body>
    </html>
  );
}
