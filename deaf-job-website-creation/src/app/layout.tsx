import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASL Bethel Jobs — Helping Deaf People Find Work",
  description: "A Deaf-friendly job board connecting Deaf and hard-of-hearing job seekers with ASL-accessible employers. Made by Tyree and Kianu.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
