"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
} from "@apollo/client";

const inter = Inter({ subsets: ["latin"] });

const client = new ApolloClient({
  uri: "http://localhost:42069",
  cache: new InMemoryCache(),
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className=" bg-slate-800 text-white">
      <body className={`${inter.className}`}>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </body>
    </html>
  );
}
