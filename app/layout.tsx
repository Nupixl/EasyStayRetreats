import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { AppProviders } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EasyStay Retreats",
  description: "Discover beautifully curated short-term rentals with an interactive search experience."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
