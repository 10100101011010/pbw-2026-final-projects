"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import LaporanCard from "../components/LaporanCard";

interface CategoryOption {
  id: string;
  category_name: string;
}

interface LocationOption {
  id: string;
  location_name: string;
  buildings: { building_name: string } | null;
}

export default function LaporPage() {
  const [lokasiId, setLokasiId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState<File | null>(null);

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [locations, setLocations] = useState<LocationOption[]>([]);

  const [result, setResult] = useState<{
    kode: string;
    nama: string;
    judul: string;
    lokasi: string;
    deskripsi: string;
    gambar: string;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [warningMsg, setWarningMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => setCategories([]));

    fetch("/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data.locations ?? []))
      .catch(() => setLocations([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setWarningMsg("");
    setResult(null);

    if (!categoryId || !lokasiId) {
      setErrorMsg("Kategori dan lokasi wajib dipilih.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("judul", judul);
      formData.append("deskripsi", deskripsi);
      formData.append("category_id", categoryId);
      formData.append("location_id", lokasiId);
      if (gambar) formData.append("gambar", gambar);

      const res = await fetch("/api/reports", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Gagal mengirim laporan.");
        setLoading(false);
        return;
      }

      if (data.warning) setWarningMsg(data.warning);

      const locationLabel =
        locations.find((l) => l.id === lokasiId)?.location_name ?? lokasiId;

      setResult({
        kode: data.report_code,
        nama: "Anda",
        judul,
        lokasi: locationLabel,
        deskripsi,
        gambar: data.image_url || (gambar ? URL.createObjectURL(gambar as File) : ""),
      });

      setJudul("");
      setDeskripsi("");
      setGambar(null);
      setCategoryId("");
      setLokasiId("");
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans text-slate-800">

      <Navbar />

      <div className="flex-grow flex items-center justify-center p-6 my-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">

          <div className="bg-[#1a4175] text-white p-6 flex flex-col items-center text-center">
            <h2 className="text-xl font-bold tracking-wide">Form Jendela Pengaduan</h2>
            <p className="text-xs text-slate-300 mt-1">Laporkan kerusakan fasilitas kampus demi kenyamanan bersama</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

            <div className="flex flex-col gap-4">

              <h3 className="text-sm font-bold text-[#1a4175] border-b border-slate-200 pb-2">
                Detail Laporan
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Lokasi
                </label>

                <select
                  value={lokasiId}
                  onChange={(e) => setLokasiId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1a4175]"
                  required
                >
                  <option value="">Pilih lokasi</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.location_name}
                      {l.buildings?.building_name ? ` — ${l.buildings.building_name}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Kategori Kerusakan
                </label>

                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1a4175]"
                  required
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Judul Laporan
                </label>

                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: LCD Ruang E523 Mati"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1a4175]"
                  required
                  minLength={5}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Deskripsi Kerusakan
                </label>

                <textarea
                  rows={5}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Jelaskan kerusakan fasilitas secara lengkap..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl resize-none text-sm focus:outline-none focus:border-[#1a4175]"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">

                <label className="text-sm font-semibold text-slate-700">
                  Upload Bukti Gambar
                </label>

                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition">

                  <div className="flex flex-col items-center gap-2">

                    <p className="text-sm font-medium text-slate-600">
                      {gambar ? gambar.name : "Klik untuk memilih gambar"}
                    </p>

                    <p className="text-xs text-slate-400">
                      PNG, JPG, JPEG (maks 5MB)
                    </p>

                  </div>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        setGambar(e.target.files[0]);
                      }
                    }}
                  />

                </label>

              </div>

              {errorMsg && (
                <p className="text-red-500 text-xs font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                  ⚠️ {errorMsg}
                </p>
              )}

              {warningMsg && (
                <p className="text-amber-600 text-xs font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  ⚠️ {warningMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#e88a24] hover:bg-[#d0761c] text-white font-bold py-3 rounded-xl transition mt-3 disabled:opacity-60"
              >
                {loading ? "Mengirim..." : "Kirim Laporan"}
              </button>

            </div>
            {result && (
              <div className="mt-6">
                <LaporanCard
                  kode={result.kode}
                  nama={result.nama}
                  judul={result.judul}
                  lokasi={result.lokasi}
                  deskripsi={result.deskripsi}
                  gambar={result.gambar}
                />
              </div>
            )}

          </form>

        </div>
      </div>

      <footer className="bg-[#1a4175] py-4 text-center text-xs text-white/70 border-t border-white/10">
        &copy; 2026 Badan Sarana dan Prasarana Universitas Gunadarma. All rights reserved.
      </footer>
    </div>
  );
}
