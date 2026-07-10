"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/navbar";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = useState<"mahasiswa" | "admin">("mahasiswa");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          password,
          role: role === "admin" ? "admin" : "student",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Gagal masuk. Coba lagi.");
        setLoading(false);
        return;
      }

      const callback = searchParams.get("callback");
      router.push(callback || (role === "admin" ? "/admin" : "/"));
      router.refresh();
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans text-slate-800">

      <Navbar />

      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">

          <div className="bg-[#1a4175] text-white p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 p-3">
              <img
                src="/logokampus.png"
                alt="Logo Campus"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>

            <h2 className="text-2xl font-bold tracking-wide">
              Login {role === "mahasiswa" ? "Mahasiswa" : "Admin / Staff"}
            </h2>

            <p className="text-xs text-slate-300 mt-1">
              Portal Laporan Fasilitas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Masuk Sebagai
              </label>

              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setRole("mahasiswa")}
                  className={`py-2 text-sm font-bold rounded-lg transition ${
                    role === "mahasiswa"
                      ? "bg-[#e88a24] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Mahasiswa
                </button>

                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`py-2 text-sm font-bold rounded-lg transition ${
                    role === "admin"
                      ? "bg-[#1a4175] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                {role === "mahasiswa"
                  ? "Email Mahasiswa"
                  : "Email Admin"}
              </label>

              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  role === "mahasiswa"
                    ? "Masukkan email mahasiswa"
                    : "Masukkan email admin"
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1a4175] focus:bg-white transition text-sm"
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
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1a4175] focus:bg-white transition text-sm"
                required
              />
            </div>

            {errorMsg && (
              <p className="text-red-500 text-xs font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                ⚠️ {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e88a24] hover:bg-[#d0761c] text-white font-bold py-3.5 rounded-xl transition mt-2 shadow-md shadow-[#e88a24]/20 disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>

            <p className="text-center text-xs text-slate-500 mt-2">
              Belum punya akun?{" "}
              <Link
                href="/daftar"
                className="text-[#e88a24] font-semibold hover:underline"
              >
                Aktivasi Akun
              </Link>
            </p>

          </form>
        </div>
      </div>

      <footer className="bg-[#1a4175] py-4 text-center text-xs text-white/70 border-t border-white/10">
        &copy; 2026 Tim Pengaduan Mahasiswa Gunadarma. All rights reserved.
      </footer>

    </div>
  );
}
