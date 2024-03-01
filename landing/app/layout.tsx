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
        <div className="m-2  pr-7 pl-7 pt-[30px] pb-10 lg:pt-44 md:pt-38 lg:pb-36 md:pb-10 sm:pb-10 lg:pl-36 lg:pr-36 md:pl-7 md:pr-7 sm:pl-7 sm:pr-7 grow text-white font-mono">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
