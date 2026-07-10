import { createClient } from "@/lib/supabase/server";

export async function getSessionProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, profile_code, student_id, full_name, email, role, program_id")
    .eq("id", user.id)
    .single();

  return { supabase, user, profile };
}

/**
 * For any /api/admin/* route. RLS is off, so this manual check is the
 * only thing standing between the anon key and the data — every admin
 * route handler must call this before touching `reports`/`profiles`.
 * Returns a ready-to-return NextResponse-shaped error object when the
 * caller isn't an authenticated admin, or the supabase client + profile
 * when they are.
 */
export async function requireAdmin() {
  const { supabase, user, profile } = await getSessionProfile();

  if (!user || !profile) {
    return { ok: false as const, status: 401, error: "Anda harus login." };
  }
  if (profile.role !== "admin") {
    return { ok: false as const, status: 403, error: "Akses khusus admin." };
  }
  return { ok: true as const, supabase, user, profile };
}

export function generateCode(prefix: string) {
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}`;
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${datePart}-${randomPart}`;
}
