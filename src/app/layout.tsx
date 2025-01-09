import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Hero from '@/app/components/Hero';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'My Gallery',
  description: 'A showcase of my models',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-100 text-gray-900`}
    >
    <Hero />
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </body>
    </html>
  );
}
