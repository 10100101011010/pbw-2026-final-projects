import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  let query = supabase
    .from("locations")
    .select(
      "id, location_code, location_name, location_type, floor, buildings(building_name)"
    )
    .eq("is_active", true)
    .order("location_name")
    .limit(50);

  if (q) {
    query = query.ilike("location_name", `%${q}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ locations: data });
}
