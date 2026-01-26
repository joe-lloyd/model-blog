import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://minis.joe-lloyd.com"),
  title: {
    default: "Joe's Painted Models",
    template: "%s | Joe's Painted Models",
  },
  description:
    "A place where I can post my painting projects, hopefully inspiring myself to paint more.",
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
