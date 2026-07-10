"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";

interface ReportRow {
  id: string;
  report_code: string;
  title: string;
  priority: string;
  status: string;
  created_at: string;
  reporter: { full_name: string; student_id: string } | null;
  assigned_admin: { id: string; full_name: string } | null;
  categories: { category_name: string } | null;
  locations: { location_name: string; buildings: { building_name: string } | null } | null;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-slate-100 text-slate-700",
  in_progress: "bg-amber-100 text-amber-700",
  resolved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-slate-100 text-slate-500",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const PAGE_SIZE = 15;

export default function AdminDashboardPage() {
  const router = useRouter();

  const [reports, setReports] = useState<ReportRow[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");

    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
      sort_by: sortBy,
      sort_dir: sortDir,
    });
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    if (q) params.set("q", q);

    try {
      const res = await fetch(`/api/admin/reports?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Gagal memuat data.");
        setReports([]);
        return;
      }

      setReports(data.reports ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [page, status, priority, q, sortBy, sortDir]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("desc");
    }
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      <Navbar />

      <div className="flex-grow w-full max-w-6xl mx-auto p-6 my-6">
        <h1 className="text-2xl font-bold text-[#1a4175] mb-1">Dashboard Admin</h1>
        <p className="text-sm text-slate-500 mb-6">Kelola seluruh laporan kerusakan fasilitas kampus.</p>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500">Cari</label>
            <input
              type="text"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Judul atau kode laporan..."
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-56 focus:outline-none focus:border-[#1a4175]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500">Status</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1a4175]"
            >
              <option value="">Semua</option>
              <option value="pending">Pending</option>
              <option value="in_progress">Diproses</option>
              <option value="resolved">Selesai</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500">Prioritas</label>
            <select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1a4175]"
            >
              <option value="">Semua</option>
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
              <option value="urgent">Mendesak</option>
            </select>
          </div>

          <span className="text-xs text-slate-400 ml-auto">{total} laporan ditemukan</span>
        </div>

        {errorMsg && (
          <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl border border-red-200 mb-4">
            ⚠️ {errorMsg}
          </p>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left text-xs text-slate-500">
                <th className="p-3 font-semibold">Kode</th>
                <th className="p-3 font-semibold">Judul</th>
                <th className="p-3 font-semibold">Pelapor</th>
                <th className="p-3 font-semibold">Lokasi</th>
                <th
                  className="p-3 font-semibold cursor-pointer select-none"
                  onClick={() => toggleSort("priority")}
                >
                  Prioritas {sortBy === "priority" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="p-3 font-semibold cursor-pointer select-none"
                  onClick={() => toggleSort("status")}
                >
                  Status {sortBy === "status" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-3 font-semibold">Ditugaskan</th>
                <th
                  className="p-3 font-semibold cursor-pointer select-none"
                  onClick={() => toggleSort("created_at")}
                >
                  Tanggal {sortBy === "created_at" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-400">
                    Memuat...
                  </td>
                </tr>
              )}
              {!loading && reports?.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-400">
                    Tidak ada laporan yang cocok dengan filter ini.
                  </td>
                </tr>
              )}
              {!loading &&
                reports?.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => router.push(`/admin/laporan/${r.id}`)}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition"
                  >
                    <td className="p-3 font-mono text-xs text-slate-400">{r.report_code}</td>
                    <td className="p-3 font-medium text-slate-800 max-w-[220px] truncate">{r.title}</td>
                    <td className="p-3 text-slate-600">{r.reporter?.full_name ?? "-"}</td>
                    <td className="p-3 text-slate-600">
                      {r.locations?.location_name}
                      {r.locations?.buildings?.building_name
                        ? ` — ${r.locations.buildings.building_name}`
                        : ""}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                          PRIORITY_STYLES[r.priority] ?? ""
                        }`}
                      >
                        {r.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                          STATUS_STYLES[r.status] ?? ""
                        }`}
                      >
                        {r.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{r.assigned_admin?.full_name ?? "Belum ditugaskan"}</td>
                    <td className="p-3 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-slate-500">
            Halaman {page} dari {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-[#1a4175] py-4 text-center text-xs text-white/70 border-t border-white/10">
        &copy; 2026 Badan Sarana dan Prasarana Universitas Gunadarma. All rights reserved.
      </footer>
    </div>
  );
}
