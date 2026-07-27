import type { Metadata } from "next";
import "./globals.css";

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
      <body className="font-sans antialiased bg-white">
        {children}
      </body>
    </html>
  );
}
