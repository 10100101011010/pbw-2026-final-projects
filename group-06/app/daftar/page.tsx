"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";

interface ProgramOption {
  id: string;
  program_code: string;
  program_name: string;
  faculties: { faculty_name: string } | null;
}

export default function RegisterPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [npm, setNpm] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [programId, setProgramId] = useState("");
  const [programs, setPrograms] = useState<ProgramOption[]>([]);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // API program
  useEffect(() => {
    fetch("/api/programs")
      .then((res) => res.json())
      .then((data) => setPrograms(data.programs ?? []))
      .catch(() => setPrograms([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok!");
      return;
    }

    if (!programId) {
      setErrorMsg("Silakan pilih program studi.");
      return;
    }

    setLoading(true);

    // API Register
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama,
          npm,
          email,
          password,
          program_id: programId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Gagal mendaftar. Coba lagi.");
        setLoading(false);
        return;
      }

      setSuccessMsg(
        data.needsEmailConfirmation
          ? "Pendaftaran berhasil! Cek email Anda untuk konfirmasi sebelum login."
          : "Pendaftaran berhasil! Mengarahkan ke halaman login..."
      );

      setTimeout(() => router.push("/login"), 1200);
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans text-slate-800">

      <Navbar />

      <div className="flex-grow flex items-center justify-center p-6 my-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">

          <div className="bg-[#1a4175] text-white p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-3 p-2.5">
              <img
                src="/logokampus.png"
                alt="Logo Kampus"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>

            <h2 className="text-xl font-bold tracking-wide">
              Buat Akun Mahasiswa
            </h2>

            <p className="text-xs text-slate-300 mt-1">
              Lengkapi data di bawah ini untuk mendaftar ke sistem
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Nama Lengkap
              </label>

              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1a4175] focus:bg-white transition text-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                NPM
              </label>

              <input
                type="text"
                value={npm}
                onChange={(e) => setNpm(e.target.value)}
                placeholder="Contoh: 10122001"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1a4175] focus:bg-white transition text-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Program Studi
              </label>

              <select
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#1a4175] focus:bg-white transition text-sm"
                required
              >
                <option value="">Pilih program studi</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.program_name}
                    {p.faculties?.faculty_name ? ` — ${p.faculties.faculty_name}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1a4175] focus:bg-white transition text-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1a4175] focus:bg-white transition text-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Konfirmasi Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Masukkan kembali password"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1a4175] focus:bg-white transition text-sm"
                required
              />
            </div>

            {errorMsg && (
              <p className="text-red-500 text-xs font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                ⚠️ {errorMsg}
              </p>
            )}

            {successMsg && (
              <p className="text-green-600 text-xs font-bold bg-green-50 p-2.5 rounded-xl border border-green-200">
                ✅ {successMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e88a24] hover:bg-[#d0761c] text-white font-bold py-3 rounded-xl transition mt-2 shadow-md shadow-[#e88a24]/20 disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Buat Akun"}
            </button>

            <p className="text-center text-xs text-slate-500 mt-1">
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="text-[#e88a24] font-semibold hover:underline"
              >
                Masuk
              </Link>
            </p>

          </form>
        </div>
      </div>

      <footer className="bg-[#1a4175] py-4 text-center text-xs text-white/70 border-t border-white/10">
        &copy; 2026 Badan Sarana dan Prasarana Universitas Gunadarma. All rights reserved.
      </footer>

    </div>
  );
}
