import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-helpers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }
  const { id } = await params;
  const { supabase } = admin;

  const { data: history, error } = await supabase
    .from("status_history")
    .select(
      `id, old_status, new_status, changed_at,
       changed_by:profiles!status_history_changed_by_fkey(full_name)`
    )
    .eq("report_id", id)
    .order("changed_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ history });
}
