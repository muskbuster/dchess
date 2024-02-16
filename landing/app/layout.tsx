import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Virtuoso Club",
  description: "In search of the best chess player!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-[#0D3B66]">
        <Navbar />
        <div className="m-2 pt-44 pb-36 pl-36 grow text-white font-mono">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
