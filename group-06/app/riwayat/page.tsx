"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/navbar";

interface ReportRow {
  id: string;
  report_code: string;
  title: string;
  priority: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
  categories: { category_name: string } | null;
  locations: { location_name: string; buildings: { building_name: string } | null } | null;
  report_images: { image_url: string }[];
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-slate-100 text-slate-700",
  in_progress: "bg-amber-100 text-amber-700",
  resolved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function RiwayatPage() {
  const [reports, setReports] = useState<ReportRow[] | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/reports/mine")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error ?? "Gagal memuat riwayat laporan.");
          return;
        }
        setReports(data.reports ?? []);
      })
      .catch(() => setErrorMsg("Terjadi kesalahan jaringan."));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans text-slate-800">
      <Navbar />

      <div className="flex-grow w-full max-w-4xl mx-auto p-6 my-6">
        <h1 className="text-2xl font-bold text-[#1a4175] mb-6">Riwayat Pengaduan Saya</h1>

        {errorMsg && (
          <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl border border-red-200 mb-4">
            ⚠️ {errorMsg}
          </p>
        )}

        {!reports && !errorMsg && (
          <p className="text-slate-500 text-sm">Memuat laporan...</p>
        )}

        {reports && reports.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm shadow-sm">
            Anda belum pernah membuat laporan.
          </div>
        )}

        <div className="flex flex-col gap-4">
          {reports?.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-mono text-slate-400">{r.report_code}</span>
                <span className="font-bold text-slate-800">{r.title}</span>
                <span className="text-sm text-slate-500">
                  {r.locations?.location_name}
                  {r.locations?.buildings?.building_name
                    ? ` — ${r.locations.buildings.building_name}`
                    : ""}
                  {r.categories?.category_name ? ` · ${r.categories.category_name}` : ""}
                </span>
                <span className="text-xs text-slate-400">
                  Diajukan: {new Date(r.created_at).toLocaleDateString("id-ID")}
                  {r.resolved_at
                    ? ` · Selesai: ${new Date(r.resolved_at).toLocaleDateString("id-ID")}`
                    : ""}
                </span>
              </div>

              <span
                className={`self-start sm:self-auto px-3 py-1.5 rounded-full text-xs font-bold capitalize ${
                  STATUS_STYLES[r.status] ?? "bg-slate-100 text-slate-700"
                }`}
              >
                {r.status.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-[#1a4175] py-4 text-center text-xs text-white/70 border-t border-white/10">
        &copy; 2026 Badan Sarana dan Prasarana Universitas Gunadarma. All rights reserved.
      </footer>
    </div>
  );
}
