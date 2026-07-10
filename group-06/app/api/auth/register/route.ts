import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Student self-registration only. Admin accounts are provisioned
// manually (seeded directly in the DB) — there is no public admin
// sign-up path.
export async function POST(request: Request) {
  const body = await request.json();
  const { nama, npm, email, password, program_id } = body ?? {};

  if (!nama || !npm || !email || !password || !program_id) {
    return NextResponse.json(
      { error: "Semua field wajib diisi, termasuk program studi." },
      { status: 400 }
    );
  }

  if (String(password).length < 6) {
    return NextResponse.json(
      { error: "Password minimal 6 karakter." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: nama } },
  });

  if (signUpError || !signUpData.user) {
    return NextResponse.json(
      { error: signUpError?.message ?? "Gagal membuat akun." },
      { status: 400 }
    );
  }

  const profileCode = `MHS-${npm}`;

  const { error: profileError } = await supabase.from("profiles").insert({
    id: signUpData.user.id,
    profile_code: profileCode,
    student_id: npm,
    full_name: nama,
    email,
    role: "student",
    program_id,
  });

  if (profileError) {
    // The auth user now exists without a profile row. We can't delete
    // auth.users from here without the service-role key (anon key can't
    // do it, and RLS being off doesn't grant that — it's a separate,
    // privileged admin API). Surface a clear error; a stray auth user
    // with no profile can be cleaned up manually from the Supabase
    // dashboard, or this can be hardened later with a service-role
    // cleanup step once the service key is wired up.
    return NextResponse.json(
      {
        error: profileError.message.includes("duplicate")
          ? "NPM atau kode profil sudah terdaftar."
          : profileError.message,
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Pendaftaran berhasil.",
    needsEmailConfirmation: !signUpData.session,
  });
}
