"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface Profile {
  full_name: string;
  role: "student" | "admin";
}

export default function Navbar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setProfile(data.profile);
        } else if (!cancelled) {
          setProfile(null);
        }
      } catch {
        if (!cancelled) setProfile(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSession();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-[#1a4175] text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logokampus.png"
            alt="Logo Kampus"
            width={40}
            height={40}
            className="object-contain"
          />
          <div className="flex flex-col">
            <span className="font-bold text-base md:text-lg leading-none tracking-wider text-white">Laporan Fasilitas</span>
            <span className="text-[10px] text-slate-300 hidden sm:block mt-0.5">Universitas Gunadarma</span>
          </div>
        </Link>

        {/* MENU TENGAH */}
        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg transition ${pathname === "/" ? "bg-white/15 text-white" : "text-slate-200 hover:text-white hover:bg-white/5"}`}
          >
            Home
          </Link>
          <Link
            href="/cari"
            className={`px-4 py-2 rounded-lg transition ${pathname === "/cari" ? "bg-white/15 text-white" : "text-slate-200 hover:text-white hover:bg-white/5"}`}
          >
            Cari Pengaduan
          </Link>
          {profile?.role === "student" && (
            <Link
              href="/riwayat"
              className={`px-4 py-2 rounded-lg transition ${pathname === "/riwayat" ? "bg-white/15 text-white" : "text-slate-200 hover:text-white hover:bg-white/5"}`}
            >
              Riwayat Saya
            </Link>
          )}
          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-lg transition ${pathname?.startsWith("/admin") ? "bg-white/15 text-white" : "text-slate-200 hover:text-white hover:bg-white/5"}`}
            >
              Dashboard Admin
            </Link>
          )}
        </nav>

        {/* KONDISI KANAN */}
        <div className="flex items-center">
          {loading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : !profile ? (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <button className="bg-white/10 text-white font-semibold px-4 py-2 text-sm rounded-lg border border-white/20 transition hover:bg-white/20">
                  Login
                </button>
              </Link>
              <Link href="/daftar">
                <button className="bg-[#e88a24] hover:bg-[#d0761c] text-white font-bold px-4 py-2 text-sm rounded-lg transition shadow-md">
                  Daftar
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Profil Box */}
              <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 pl-3 pr-4 py-1.5 rounded-full shadow-inner">
                <div className="w-8 h-8 rounded-full bg-[#e88a24] text-white flex items-center justify-center font-bold text-xs shadow-md border border-white/20 select-none">
                  {getInitials(profile.full_name)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold tracking-wide text-white leading-tight max-w-[100px] truncate">
                    {profile.full_name}
                  </span>
                  <span className="text-[9px] text-slate-300 capitalize leading-none mt-0.5">
                    {profile.role === "admin" ? "Admin" : "Mahasiswa"}
                  </span>
                </div>
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#e88a24] text-white flex md:hidden items-center justify-center font-bold text-xs shadow-md border border-white/20 select-none">
                {getInitials(profile.full_name)}
              </div>

              {/* Tombol Logout */}
              <button
                onClick={handleLogout}
                className="text-xs text-red-300 hover:text-red-400 font-medium transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
