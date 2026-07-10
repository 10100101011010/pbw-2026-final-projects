import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-helpers";

const SORTABLE = new Set(["created_at", "priority", "status", "updated_at"]);

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }
  const { supabase } = admin;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const categoryId = searchParams.get("category_id");
  const assignedAdminId = searchParams.get("assigned_admin_id");
  const q = searchParams.get("q")?.trim();
  const sortBy = SORTABLE.has(searchParams.get("sort_by") ?? "")
    ? (searchParams.get("sort_by") as string)
    : "created_at";
  const sortDir = searchParams.get("sort_dir") === "asc" ? true : false;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 20)));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("reports")
    .select(
      `id, report_code, title, priority, status, created_at, updated_at, resolved_at,
       reporter:profiles!reports_reporter_id_fkey(id, full_name, student_id),
       assigned_admin:profiles!reports_assigned_admin_id_fkey(id, full_name),
       categories(id, category_name),
       locations(id, location_name, buildings(building_name))`,
      { count: "exact" }
    )
    .order(sortBy, { ascending: sortDir })
    .range(from, to);

  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (categoryId) query = query.eq("category_id", categoryId);
  if (assignedAdminId) query = query.eq("assigned_admin_id", assignedAdminId);
  if (q) query = query.or(`title.ilike.%${q}%,report_code.ilike.%${q}%`);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    reports: data,
    total: count ?? 0,
    page,
    limit,
  });
}
