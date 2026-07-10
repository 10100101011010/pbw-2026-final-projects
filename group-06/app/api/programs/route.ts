import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Public master-data endpoint (no auth required) — used to populate
// the program dropdown on the registration form.
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("programs")
    .select("id, program_code, program_name, faculties(faculty_name)")
    .order("program_name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ programs: data });
}
