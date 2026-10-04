import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["300","400","500","600","700","800"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], weight: ["300","400","500","600"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Super Duper Language Center — Registration",
  description: "Register to start your English journey with Super Duper Language Center, Yogyakarta.",
  openGraph: { title: "Super Duper — Daftar Sekarang", description: "Intensive English learning. Build confidence. Build your future.", images: ["/assets/logo.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${poppins.variable} ${inter.variable} antialiased`}>
      <body className="font-body text-brand-ink bg-brand-stone min-h-screen">{children}</body>
    </html>
  );
}
