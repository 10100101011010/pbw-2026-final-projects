"use client";

import { useState } from "react";
import Navbar from "../components/navbar";
import LaporanCard from "../components/LaporanCard";

interface LaporanType {
  kode: string;
  nama: string;
  judul: string;
  lokasi: string;
  deskripsi: string;
  gambar: string;
  status?: string;
}

export default function CariPengaduanPage() {
  const [idPengaduan, setIdPengaduan] = useState("");
  const [hasilLaporan, setHasilLaporan] = useState<LaporanType | null>(null);
  const [sudahCari, setSudahCari] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    setSudahCari(true);
    setLoading(true);
    setHasilLaporan(null);

    try {
      const res = await fetch(
        `/api/reports/search?code=${encodeURIComponent(idPengaduan.trim())}`
      );
      const data = await res.json();

      if (res.ok && data.report) {
        const r = data.report;
        setHasilLaporan({
          kode: r.report_code,
          nama: r.profiles?.full_name ?? "-",
          judul: r.title,
          lokasi: [r.locations?.location_name, r.locations?.buildings?.building_name]
            .filter(Boolean)
            .join(" — "),
          deskripsi: r.description ?? "-",
          gambar: r.report_images?.[0]?.image_url ?? "",
          status: r.status,
        });
      } else {
        setHasilLaporan(null);
      }
    } catch {
      setHasilLaporan(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans text-slate-800">
      <Navbar />

      <div className="flex-grow flex flex-col items-center p-6 my-6 w-full max-w-2xl mx-auto gap-6">

        <div className="w-full bg-white p-8 rounded-2xl shadow-md border border-slate-200">
          <h2 className="text-xl font-bold text-[#1a4175] mb-6 tracking-wide">
            Cari Pengaduan Fasilitas
          </h2>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex flex-col gap-2 flex-grow w-full">
              <label className="text-sm font-semibold text-slate-600">
                ID / Nomor Pengaduan
              </label>
              <input
                type="text"
                value={idPengaduan}
                onChange={(e) => setIdPengaduan(e.target.value)}
                placeholder="Masukkan nomor pengaduan Anda"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1a4175] focus:bg-white transition text-sm shadow-inner"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-[#e88a24] hover:bg-[#d0761c] text-white font-bold px-8 py-3 rounded-xl transition shadow-md shadow-[#e88a24]/20 h-[46px] whitespace-nowrap text-sm"
              disabled={loading}
            >
              {loading ? "Memuat..." : "Cari Laporan"}
            </button>
          </form>

          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            * Gunakan ID Pengaduan (REP-XXXX) yang Anda dapatkan sesaat setelah membuat laporan keluhan untuk melacak status penanganan oleh admin.
          </p>
        </div>

        {sudahCari && !loading && (
          <div className="w-full transition-all duration-300">
            {hasilLaporan ? (
              <div className="flex flex-col gap-3">
                {hasilLaporan.status && (
                  <div className="self-start px-4 py-1.5 rounded-full text-xs font-bold bg-[#1a4175] text-white capitalize">
                    Status: {hasilLaporan.status.replace("_", " ")}
                  </div>
                )}
                <LaporanCard
                  kode={hasilLaporan.kode}
                  nama={hasilLaporan.nama}
                  judul={hasilLaporan.judul}
                  lokasi={hasilLaporan.lokasi}
                  deskripsi={hasilLaporan.deskripsi}
                  gambar={hasilLaporan.gambar}
                />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm shadow-sm">
                Pengaduan dengan ID <strong className="text-red-500">&quot;{idPengaduan}&quot;</strong> tidak ditemukan. Pastikan kode yang Anda masukkan sudah benar.
              </div>
            )}
          </div>
        )}

      </div>

      <footer className="bg-[#1a4175] py-4 text-center text-xs text-white/70 border-t border-white/10">
        &copy; 2026 Kelompok Laporan Fasilitas Rusak. All rights reserved.
      </footer>
    </div>
  );
}
