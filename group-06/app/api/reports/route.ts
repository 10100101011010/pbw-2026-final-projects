import { NextResponse } from "next/server";
import { getSessionProfile, generateCode } from "@/lib/api-helpers";

const IMAGE_BUCKET = "report-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export async function POST(request: Request) {
  const { supabase, user } = await getSessionProfile();

  if (!user) {
    return NextResponse.json({ error: "Anda harus login." }, { status: 401 });
  }

  const formData = await request.formData();
  const title = (formData.get("judul") as string | null)?.trim();
  const description = (formData.get("deskripsi") as string | null)?.trim();
  const categoryId = formData.get("category_id") as string | null;
  const locationId = formData.get("location_id") as string | null;
  const image = formData.get("gambar") as File | null;

  if (!title || title.length < 5) {
    return NextResponse.json(
      { error: "Judul laporan minimal 5 karakter." },
      { status: 400 }
    );
  }
  if (!categoryId || !locationId) {
    return NextResponse.json(
      { error: "Kategori dan lokasi wajib dipilih." },
      { status: 400 }
    );
  }
  if (image && image.size > 0) {
    if (!ALLOWED_TYPES.includes(image.type)) {
      return NextResponse.json(
        { error: "Format gambar harus PNG, JPG, atau WEBP." },
        { status: 400 }
      );
    }
    if (image.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Ukuran gambar maksimal 5MB." },
        { status: 400 }
      );
    }
  }

  const reportCode = generateCode("REP");

  const { data: report, error: reportError } = await supabase
    .from("reports")
    .insert({
      report_code: reportCode,
      reporter_id: user.id,
      category_id: categoryId,
      location_id: locationId,
      title,
      description: description || null,
    })
    .select("id, report_code")
    .single();

  if (reportError || !report) {
    return NextResponse.json(
      { error: reportError?.message ?? "Gagal membuat laporan." },
      { status: 400 }
    );
  }

  let imageUrl: string | null = null;

  if (image && image.size > 0) {
    const ext = image.name.split(".").pop() || "jpg";
    const path = `${report.id}/${crypto.randomUUID()}.${ext}`;
    const arrayBuffer = await image.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, arrayBuffer, { contentType: image.type });

    if (uploadError) {
      // Report itself was created successfully; just surface that the
      // image didn't attach so the student knows to retry the upload.
      return NextResponse.json({
        report_code: report.report_code,
        warning: `Laporan berhasil dibuat, tetapi gagal mengunggah gambar: ${uploadError.message}`,
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from(IMAGE_BUCKET)
      .getPublicUrl(path);
    imageUrl = publicUrlData.publicUrl;

    const { error: imageRowError } = await supabase.from("report_images").insert({
      image_code: generateCode("IMG"),
      report_id: report.id,
      image_url: imageUrl,
    });

    if (imageRowError) {
      return NextResponse.json({
        report_code: report.report_code,
        warning: `Laporan berhasil dibuat, tetapi gagal menyimpan data gambar: ${imageRowError.message}`,
      });
    }
  }

  return NextResponse.json({
    message: "Laporan berhasil dikirim.",
    report_code: report.report_code,
    image_url: imageUrl,
  });
}
