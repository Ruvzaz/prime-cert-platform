import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ❌ อย่าลืมบรรทัดนี้! บังคับไม่ให้ Cache ไม่งั้นมันจะนับแค่ครั้งแรกครั้งเดียว
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  // 1. เรียก SQL Function ที่เราเพิ่งแก้ (increment_download)
  const { error: rpcError } = await supabase.rpc("increment_download", {
    row_id: id,
  });

  if (rpcError) {
    console.error("Count Error:", rpcError);
    // ถึงนับไม่สำเร็จ ก็ควรปล่อยให้เขาโหลดไฟล์ได้ อย่าเพิ่ง Error
  }

  // 2. ดึงข้อมูลเพื่อหา URL ไฟล์
  const { data: cert, error } = await supabase
    .from("certificates")
    .select("*, events(slug, storage_bucket_url)") // 👈 ตรวจสอบว่าดึง slug มาด้วย
    .eq("id", id)
    .single();

  if (error || !cert) {
    return NextResponse.json(
      { error: "Certificate not found" },
      { status: 404 },
    );
  }

  // 3. สร้าง Link ไป R2
  // 🚨 เช็ค Path Folder ให้ตรงกับที่คุณแก้ไปล่าสุด (Events หรือ event)
  const event = cert.events as any;
  // ตัวอย่าง: https://pub-xxx.r2.dev/primes-org/file.pdf
  const targetUrl = `${event.storage_bucket_url}/${event.slug}/${cert.filename}`;

  // 4. ดึงไฟล์จาก R2 และส่งกลับเป็น Response พร้อม Header บังคับดาวน์โหลด
  try {
    const fileResponse = await fetch(targetUrl);
    
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
    }

    const blob = await fileResponse.blob();
    const headers = new Headers();
    
    // ตั้งค่า Content-Disposition เพื่อบังคับดาวน์โหลด
    // ใช้ filename* เพื่อรองรับชื่อไฟล์ภาษาไทย
    const filename = cert.filename || "certificate.jpg";
    headers.set("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
    headers.set("Content-Type", fileResponse.headers.get("Content-Type") || "application/octet-stream");

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("Fetch error, falling back to redirect:", err);
    // หาก Fetch ไม่สำเร็จ ให้ลอง Redirect ไปยัง URL ตรงๆ เป็นแผนสำรอง
    return NextResponse.redirect(targetUrl);
  }
}
