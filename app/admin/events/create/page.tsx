"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BasicInfoCard } from "@/components/admin/events/basic-info-card";
import { AssetsCard } from "@/components/admin/events/assets-card";
import { generateSlug } from "@/lib/utils";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // States สำหรับเก็บไฟล์รูปภาพ
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewPoster, setPreviewPoster] = useState<string | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  // Form State (ตัด poster_url, logo_url, storage ออก เพราะเดี๋ยวเราจัดการให้)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    theme_color: "#192768",
  });

  // Auto-generate slug (Support Thai Language)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  // Helper Function: อัปโหลดรูปไป Supabase Storage
  const uploadImage = async (file: File, path: string) => {
    // 1. Upload
    const { error: uploadError } = await supabase.storage
      .from("event-assets") // ชื่อ Bucket ที่สร้างใน Step 1
      .upload(path, file, { upsert: true });

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data } = supabase.storage.from("event-assets").getPublicUrl(path);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let posterUrl = "";
      let logoUrl = "";

      // Create a safe ASCII-only slug for storage paths
      // If slug contains non-ASCII, use timestamp as prefix instead to avoid "Invalid key" errors
      const safeStorageSlug = /[^\w-]/.test(formData.slug)
        ? `event-${Date.now()}`
        : formData.slug;

      // 1. Upload Poster (ถ้ามี)
      if (posterFile) {
        const fileExt = posterFile.name.split(".").pop();
        const filePath = `${safeStorageSlug}/poster-${Date.now()}.${fileExt}`;
        posterUrl = await uploadImage(posterFile, filePath);
      }

      // 2. Upload Logo (ถ้ามี)
      if (logoFile) {
        const fileExt = logoFile.name.split(".").pop();
        const filePath = `${safeStorageSlug}/logo-${Date.now()}.${fileExt}`;
        logoUrl = await uploadImage(logoFile, filePath);
      }

      // 3. เตรียมข้อมูล R2 URL จาก Environment
      const r2BucketUrl = process.env.NEXT_PUBLIC_R2_BUCKET_URL;
      if (!r2BucketUrl)
        throw new Error("System Config Error: R2 Bucket URL not found in .env");

      // 4. บันทึกลลง Database
      const { error } = await supabase.from("events").insert([
        {
          name: formData.name,
          slug: formData.slug,
          theme_color: formData.theme_color,
          poster_url: posterUrl || null,
          logo_url: logoUrl || null,
          storage_bucket_url: r2BucketUrl, // ใส่ให้อัตโนมัติ!
        },
      ]);

      if (error) throw error;

      router.push("/admin");
    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle File Selection & Preview
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "poster" | "logo"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "poster") {
      setPosterFile(file);
      setPreviewPoster(URL.createObjectURL(file));
    } else {
      setLogoFile(file);
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 pb-10">
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="h-4 w-4" /> กลับสู่ Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">
          สร้างงานกิจกรรมใหม่
        </h1>
        <p className="text-slate-500">กรอกข้อมูลพื้นฐานและอัปโหลดรูปภาพ</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: ข้อมูลทั่วไป */}
        <BasicInfoCard
          formData={formData}
          setFormData={setFormData}
          onNameChange={handleNameChange}
        />

        {/* Card 2: รูปภาพ */}
        <AssetsCard
          previewPoster={previewPoster}
          previewLogo={previewLogo}
          onFileChange={handleFileChange}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            ยกเลิก
          </Button>
          <Button
            type="submit"
            className="bg-[#192768] hover:bg-[#2a3b8f] min-w-[150px]"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Save className="mr-2" />
            )}
            สร้างงานกิจกรรม
          </Button>
        </div>
      </form>
    </div>
  );
}

