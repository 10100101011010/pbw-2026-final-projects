"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "./components/navbar";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cek status login dari DB saat halaman dimuat
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleCreateReport = () => {
    if (loading) return;

    if (isLoggedIn) {
      router.push("/lapor"); // Jika sudah login, ke form pengaduan
    } else {
      router.push("/login?callback=/lapor"); // Jika belum, ke login (bisa dipass callback)
    }
  };
  return (
    <div className="min-h-screen bg-[#0b2f61] text-white flex flex-col justify-between font-sans">
      {/* Cukup panggil tag tunggal ini */}
      <Navbar />

      {/* HERO UTAMA */}
      <main className="container mx-auto px-6 py-24 flex-grow flex flex-col items-center justify-center text-center max-w-3xl">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
          Laporan Fasilitas <br />
          <span className="text-[#e88a24]">Universitas Gunadarma</span>
        </h1>

        <p className="text-lg text-slate-300 mb-8">
          Selamat datang di Portal Laporan Fasilitas Universitas Gunadarma,
          laporkan segala kerusakan fasilitas yang anda temukan.
        </p>

        <div className="flex gap-4">
          <Link
            href="/lapor"
            className="bg-[#e88a24] hover:bg-[#d0761c] text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-[#e88a24]/10"
          >
            Buat Pengaduan Baru
          </Link>
        </div>
      </main>

      {/* SECTION AJAKAN KELUHAN */}
      <section className="bg-[#1a4175] py-24 flex items-center justify-center text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-relaxed">
            Laporkan kerusakan fasilitas yang anda <br />
            lihat melalui portal pelaporan ini
            <br />
            dengan cepat dan mudah.
          </h2>
        </div>
      </section>

      {/* FOOTER INFORMASI 3 KOLOM */}
      <section className="bg-[#0b2f61] text-white py-16 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg tracking-wide">
              Laporan Fasilitas
            </h3>
            <p className="text-xs text-blue-300 font-medium">
              Portal Laporan Fasilitas
            </p>
            <p className="text-sm text-slate-200 leading-relaxed mt-3 max-w-xs">
              Portal Laporan Fasilitas Universitas Gunadarma untuk Mahasiswa
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-sm tracking-widest uppercase text-white">
              Kontak
            </h3>
            <div className="flex flex-col gap-3 text-sm text-slate-200">
              <div className="flex items-start gap-2.5">
                <span className="text-base text-[#e88a24]">📍</span>
                <span>
                  Kampus D Universitas Gunadarma, Jl. Margonda Raya No. 100,
                  Depok, Jawa Barat.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-base text-[#e88a24]">📞</span>
                <span>(+62) 217-888-1112</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-base text-[#e88a24]">✉️</span>
                <span>mediacenter@gunadarma.ac.id</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#113564] py-4 text-center text-xs text-slate-300 border-t border-white/5">
        &copy; 2026 Badan Sarana dan Prasarana Universitas Gunadarma. All rights
        reserved.
      </footer>
    </div>
  );
}
