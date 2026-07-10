import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { identifier, password, role } = body ?? {};

  if (!identifier || !password) {
    return NextResponse.json(
      { error: "Email dan password wajib diisi." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Supabase Auth signs in by email. If the identifier isn't an email
  // (e.g. a student typed their NPM), resolve it to an email first via
  // the profiles table (readable here since RLS is off).
  let email = identifier;
  if (!identifier.includes("@")) {
    const { data: profileByNpm } = await supabase
      .from("profiles")
      .select("email")
      .eq("student_id", identifier)
      .single();

    if (!profileByNpm) {
      return NextResponse.json(
        { error: "Akun tidak ditemukan." },
        { status: 401 }
      );
    }
    email = profileByNpm.email;
  }

  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (signInError || !signInData.user) {
    return NextResponse.json(
      { error: "Email atau password salah." },
      { status: 401 }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, profile_code, student_id, full_name, email, role, program_id")
    .eq("id", signInData.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "Profil pengguna tidak ditemukan." },
      { status: 404 }
    );
  }

  const expectedRole = role === "admin" ? "admin" : "student";
  if (profile.role !== expectedRole) {
    await supabase.auth.signOut();
    return NextResponse.json(
      {
        error:
          expectedRole === "admin"
            ? "Akun ini bukan akun admin."
            : "Akun ini terdaftar sebagai admin, gunakan tab Admin untuk masuk.",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({ user: { id: profile.id, email: profile.email }, profile });
}
