import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://minis.joe-lloyd.com"),
  title: {
    default: "Joe's Painted Models — Miniature Painting Gallery",
    template: "%s | Joe's Painted Models",
  },
  description:
    "Joe's miniature painting projects — Warhammer 40k, fantasy models, grimdark conversions and more. Browse the gallery and get inspired to paint your own collection.",
  openGraph: {
    siteName: "Joe's Painted Models",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-400`}
      >
        {children}
      </body>
    </html>
  );
}
