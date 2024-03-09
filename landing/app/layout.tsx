import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
      <body className="flex flex-col min-h-screen bg-[#010712] ">
        <Navbar />
        <div className="grow text-white font-mono">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
