"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/navbar";

interface ReportDetail {
  id: string;
  report_code: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  reporter: { id: string; full_name: string; student_id: string; email: string } | null;
  assigned_admin: { id: string; full_name: string } | null;
  categories: { id: string; category_name: string } | null;
  locations: { id: string; location_name: string; buildings: { building_name: string } | null } | null;
  report_images: { id: string; image_url: string }[];
  feedback: { rating: number; comment: string | null }[];
}

interface HistoryEntry {
  id: string;
  old_status: string | null;
  new_status: string;
  changed_at: string;
  changed_by: { full_name: string } | null;
}

interface AdminOption {
  id: string;
  full_name: string;
  email: string;
}

export default function AdminReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [report, setReport] = useState<ReportDetail | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [admins, setAdmins] = useState<AdminOption[]>([]);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedAdminId, setAssignedAdminId] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const [reportRes, historyRes, adminsRes] = await Promise.all([
        fetch(`/api/admin/reports/${id}`),
        fetch(`/api/admin/reports/${id}/history`),
        fetch(`/api/admin/admins`),
      ]);

      const reportData = await reportRes.json();
      if (!reportRes.ok) {
        setErrorMsg(reportData.error ?? "Gagal memuat laporan.");
        setLoading(false);
        return;
      }

      setReport(reportData.report);
      setStatus(reportData.report.status);
      setPriority(reportData.report.priority);
      setAssignedAdminId(reportData.report.assigned_admin?.id ?? "");

      const historyData = await historyRes.json();
      if (historyRes.ok) setHistory(historyData.history ?? []);

      const adminsData = await adminsRes.json();
      if (adminsRes.ok) setAdmins(adminsData.admins ?? []);
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          priority,
          assigned_admin_id: assignedAdminId || null,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Gagal menyimpan perubahan.");
        return;
      }

      setSuccessMsg("Perubahan berhasil disimpan.");
      await loadAll();
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <Navbar />
        <p className="text-center text-slate-400 mt-10">Memuat...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <Navbar />
        <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-500">
          {errorMsg || "Laporan tidak ditemukan."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      <Navbar />

      <div className="flex-grow w-full max-w-4xl mx-auto p-6 my-6 flex flex-col gap-6">
        <button
          onClick={() => router.push("/admin")}
          className="text-sm text-[#1a4175] font-semibold self-start hover:underline"
        >
          ← Kembali ke daftar
        </button>

        {/* Report details */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-[#1a4175] text-white p-5">
            <span className="text-xs font-mono text-slate-300">{report.report_code}</span>
            <h1 className="text-xl font-bold mt-1">{report.title}</h1>
          </div>

          <div className="p-6 grid sm:grid-cols-2 gap-5">
            {report.report_images?.[0]?.image_url && (
              <div className="sm:col-span-2">
                <img
                  src={report.report_images[0].image_url}
                  alt="Bukti"
                  className="w-full max-h-80 object-contain rounded-xl border"
                />
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-slate-500">Pelapor</p>
              <p className="text-slate-800">
                {report.reporter?.full_name} ({report.reporter?.student_id})
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500">Lokasi</p>
              <p className="text-slate-800">
                {report.locations?.location_name}
                {report.locations?.buildings?.building_name
                  ? ` — ${report.locations.buildings.building_name}`
                  : ""}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500">Kategori</p>
              <p className="text-slate-800">{report.categories?.category_name ?? "-"}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500">Diajukan</p>
              <p className="text-slate-800">
                {new Date(report.created_at).toLocaleString("id-ID")}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-slate-500">Deskripsi</p>
              <p className="text-slate-800 whitespace-pre-line">{report.description || "-"}</p>
            </div>

            {report.feedback?.[0] && (
              <div className="sm:col-span-2 bg-slate-50 rounded-xl p-4 border">
                <p className="text-xs font-semibold text-slate-500 mb-1">
                  Feedback Mahasiswa
                </p>
                <p className="text-sm text-slate-700">
                  Rating: {report.feedback[0].rating}/5 — {report.feedback[0].comment || "(tanpa komentar)"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Update controls */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-[#1a4175] mb-4">Kelola Laporan</h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1a4175]"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">Diproses</option>
                <option value="resolved">Selesai</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Prioritas</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1a4175]"
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
                <option value="urgent">Mendesak</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Ditugaskan ke</label>
              <select
                value={assignedAdminId}
                onChange={(e) => setAssignedAdminId(e.target.value)}
                className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1a4175]"
              >
                <option value="">Belum ditugaskan</option>
                {admins.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errorMsg && (
            <p className="text-red-500 text-xs font-bold bg-red-50 p-2.5 rounded-xl border border-red-200 mt-4">
              ⚠️ {errorMsg}
            </p>
          )}
          {successMsg && (
            <p className="text-green-600 text-xs font-bold bg-green-50 p-2.5 rounded-xl border border-green-200 mt-4">
              ✅ {successMsg}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-5 bg-[#e88a24] hover:bg-[#d0761c] text-white font-bold px-6 py-2.5 rounded-xl transition disabled:opacity-60 text-sm"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

        {/* Status history */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-[#1a4175] mb-4">Riwayat Status</h2>

          {history.length === 0 ? (
            <p className="text-sm text-slate-400">Belum ada perubahan status.</p>
          ) : (
            <ol className="flex flex-col gap-3">
              {history.map((h) => (
                <li key={h.id} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-[#1a4175] shrink-0" />
                  <div>
                    <p className="text-slate-800">
                      <span className="capitalize font-semibold">
                        {h.old_status ? h.old_status.replace("_", " ") : "dibuat"}
                      </span>{" "}
                      →{" "}
                      <span className="capitalize font-semibold">
                        {h.new_status.replace("_", " ")}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(h.changed_at).toLocaleString("id-ID")} oleh{" "}
                      {h.changed_by?.full_name ?? "-"}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <footer className="bg-[#1a4175] py-4 text-center text-xs text-white/70 border-t border-white/10">
        &copy; 2026 Badan Sarana dan Prasarana Universitas Gunadarma. All rights reserved.
      </footer>
    </div>
  );
}
