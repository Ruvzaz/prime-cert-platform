import { NextRequest, NextResponse } from "next/server";
import { r2Client } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    // 1. รับค่า folder (Event Slug) ที่ส่งมาจากหน้าบ้าน
    const folder = formData.get("folder") as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files received" }, { status: 400 });
    }

    if (!folder) {
      return NextResponse.json(
        { error: "Folder (Event Slug) is required" },
        { status: 400 },
      );
    }

    const uploadResults = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      // 2. ตั้งชื่อไฟล์โดยเอา Folder นำหน้า
      // เช่น folder="demo-day", filename="EMP001.pdf" -> Key="demo-day/EMP001.pdf"
      const filePath = `${folder}/${file.name}`;

      await r2Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: filePath, // ใช้ชื่อแบบมี Path
          Body: buffer,
          ContentType: "application/pdf",
        }),
      );

      uploadResults.push(filePath);
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadResults.length,
      folder: folder,
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
