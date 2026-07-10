import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code")?.trim();

  if (!code) {
    return NextResponse.json({ error: "Kode laporan wajib diisi." }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: report, error } = await supabase
    .from("reports")
    .select(
      `id, report_code, title, description, priority, status, created_at, resolved_at,
       profiles!reports_reporter_id_fkey(full_name),
       categories(category_name),
       locations(location_name, buildings(building_name)),
       report_images(image_url)`
    )
    .ilike("report_code", code)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!report) {
    return NextResponse.json({ error: "Laporan tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ report });
}
