import { NextResponse } from "next/server";
import { requireAdmin, generateCode } from "@/lib/api-helpers";

const VALID_STATUS = ["pending", "in_progress", "resolved", "rejected"];
const VALID_PRIORITY = ["low", "medium", "high", "urgent"];

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

  const { data: report, error } = await supabase
    .from("reports")
    .select(
      `id, report_code, title, description, priority, status, created_at, updated_at, resolved_at,
       reporter:profiles!reports_reporter_id_fkey(id, full_name, student_id, email),
       assigned_admin:profiles!reports_assigned_admin_id_fkey(id, full_name),
       categories(id, category_name),
       locations(id, location_name, buildings(building_name)),
       report_images(id, image_url),
       feedback(rating, comment)`
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!report) {
    return NextResponse.json({ error: "Laporan tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ report });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }
  const { id } = await params;
  const { supabase, user } = admin;

  const body = await request.json();
  const { status, priority, assigned_admin_id } = body ?? {};

  if (status !== undefined && !VALID_STATUS.includes(status)) {
    return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
  }
  if (priority !== undefined && !VALID_PRIORITY.includes(priority)) {
    return NextResponse.json({ error: "Prioritas tidak valid." }, { status: 400 });
  }

  const { data: existing, error: existingError } = await supabase
    .from("reports")
    .select("status, priority, assigned_admin_id")
    .eq("id", id)
    .maybeSingle();

  if (existingError || !existing) {
    return NextResponse.json({ error: "Laporan tidak ditemukan." }, { status: 404 });
  }

  const updatePayload: Record<string, unknown> = {};
  if (status !== undefined) updatePayload.status = status;
  if (priority !== undefined) updatePayload.priority = priority;
  if (assigned_admin_id !== undefined) updatePayload.assigned_admin_id = assigned_admin_id;

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ error: "Tidak ada perubahan yang dikirim." }, { status: 400 });
  }

  const { data: updated, error: updateError } = await supabase
    .from("reports")
    .update(updatePayload)
    .eq("id", id)
    .select(
      `id, report_code, title, priority, status, updated_at, resolved_at,
       assigned_admin:profiles!reports_assigned_admin_id_fkey(id, full_name)`
    )
    .single();

  if (updateError || !updated) {
    return NextResponse.json(
      { error: updateError?.message ?? "Gagal memperbarui laporan." },
      { status: 400 }
    );
  }

  // trg_reports_status_history already logs status changes into
  // status_history (using auth.uid() as changed_by, which resolves
  // correctly here because this update runs under the admin's own
  // session, not a service-role key). We separately log to the
  // generic audit_logs table for anything that changed, since that
  // trigger only covers status.
  const auditEntries: Record<string, unknown>[] = [];
  if (status !== undefined && status !== existing.status) {
    auditEntries.push({
      log_code: generateCode("LOG"),
      user_id: user!.id,
      entity_type: "report",
      entity_id: id,
      action: "status_change",
      old_value: { status: existing.status },
      new_value: { status },
    });
  }
  if (
    assigned_admin_id !== undefined &&
    assigned_admin_id !== existing.assigned_admin_id
  ) {
    auditEntries.push({
      log_code: generateCode("LOG"),
      user_id: user!.id,
      entity_type: "report",
      entity_id: id,
      action: "assign_admin",
      old_value: { assigned_admin_id: existing.assigned_admin_id },
      new_value: { assigned_admin_id },
    });
  }
  if (priority !== undefined && priority !== existing.priority) {
    auditEntries.push({
      log_code: generateCode("LOG"),
      user_id: user!.id,
      entity_type: "report",
      entity_id: id,
      action: "update",
      old_value: { priority: existing.priority },
      new_value: { priority },
    });
  }

  if (auditEntries.length > 0) {
    await supabase.from("audit_logs").insert(auditEntries);
  }

  return NextResponse.json({ report: updated });
}
