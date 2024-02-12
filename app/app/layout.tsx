import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Virtuoso Club",
  description: "Search for the best player!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className=" bg-slate-800 text-white">
      <body className={`${inter.className}`}>{children}</body>
    </html>
  );
}
