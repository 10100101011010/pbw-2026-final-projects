import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // utility class Tailwind CSS aktif

// font global
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Judul Tab dan Deskripsi Website
export const metadata: Metadata = {
  title: "Pengaduan Fasilitas - Kelompok 6",
  description: "Sistem pelaporan kerusakan fasilitas kampus Universitas Gunadarma demi kenyamanan belajar bersama.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} antialiased bg-slate-100 text-slate-800`}>
        {/* children di bawah ini adalah tempat di mana halaman utama, /lapor, /cari, dll. akan dirender secara bergantian */}
        {children}
      </body>
    </html>
  );
}