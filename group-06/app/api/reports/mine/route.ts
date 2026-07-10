import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/api-helpers";

export async function GET() {
  const { supabase, user } = await getSessionProfile();

  if (!user) {
    return NextResponse.json({ error: "Anda harus login." }, { status: 401 });
  }

  const { data: reports, error } = await supabase
    .from("reports")
    .select(
      `id, report_code, title, priority, status, created_at, resolved_at,
       categories(category_name),
       locations(location_name, buildings(building_name)),
       report_images(image_url)`
    )
    .eq("reporter_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reports });
}
