"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  UserPlus,
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

export function AddSingleForm() {
  // Data States
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventSlug, setSelectedEventSlug] = useState<string>("");

  // Form States
  const [formData, setFormData] = useState({
    user_identifier: "",
    user_name: "",
  });
  const [file, setFile] = useState<File | null>(null);

  // Status States
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // 1. Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase.from("events").select("id, name, slug");
      if (data) setEvents(data);
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedEventSlug ||
      !file ||
      !formData.user_identifier ||
      !formData.user_name
    ) {
      setStatus({
        type: "error",
        message: "กรุณากรอกข้อมูลให้ครบทุกช่อง และเลือกไฟล์ PDF",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      // Step 1: หา event_id จาก slug ที่เลือก
      const event = events.find((e) => e.slug === selectedEventSlug);
      if (!event) throw new Error("Event not found");

      // Step 2: Upload File to R2 (ใช้ API เดิม)
      const uploadFormData = new FormData();
      uploadFormData.append("folder", selectedEventSlug);
      uploadFormData.append("files", file);

      const uploadRes = await fetch("/api/upload-certs", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || "Upload failed");
      }

      // Step 3: Insert into Database
      // หมายเหตุ: ชื่อไฟล์ที่เก็บใน DB ต้องตรงกับไฟล์ที่เราอัปโหลด (file.name)
      const { error: dbError } = await supabase.from("certificates").insert([
        {
          event_id: event.id,
          user_identifier: formData.user_identifier,
          user_name: formData.user_name,
          filename: file.name, // ชื่อไฟล์เดียวกับที่ส่งไป R2
        },
      ]);

      if (dbError) throw dbError;

      // Success
      setStatus({
        type: "success",
        message: `✅ บันทึกข้อมูลสำเร็จ! คุณ ${formData.user_name} เข้าระบบแล้ว`,
      });

      // Reset Form
      setFormData({ user_identifier: "", user_name: "" });
      setFile(null);
      // เคลียร์ input file
      const fileInput = document.getElementById(
        "singlePdfInput",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      console.error(error);
      setStatus({ type: "error", message: `เกิดข้อผิดพลาด: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-slate-50 border-b p-6">
        <CardTitle className="flex items-center gap-3 text-purple-800">
          <div className="bg-purple-100 p-2 rounded-lg">
            <UserPlus className="h-6 w-6" />
          </div>
          Add Single Entry
        </CardTitle>
        <CardDescription className="text-slate-500 ml-12">
          เพิ่มรายชื่อและอัปโหลดไฟล์สำหรับบุคคลเดียว (One-Stop)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Select Event */}
          <div className="space-y-2">
            <Label>เลือกงาน (Event)</Label>
            <Select onValueChange={setSelectedEventSlug}>
              <SelectTrigger className="h-12 border-slate-200">
                <SelectValue placeholder="-- เลือกงาน --" />
              </SelectTrigger>
              <SelectContent>
                {events.map((evt) => (
                  <SelectItem key={evt.id} value={evt.slug}>
                    {evt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* 2. User Info */}
            <div className="space-y-2">
              <Label>รหัสพนักงาน / เบอร์โทร (Identifier)</Label>
              <Input
                placeholder="เช่น EMP-999"
                value={formData.user_identifier}
                onChange={(e) =>
                  setFormData({ ...formData, user_identifier: e.target.value })
                }
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label>ชื่อ-นามสกุล (User Name)</Label>
              <Input
                placeholder="เช่น Somchai Jaidee"
                value={formData.user_name}
                onChange={(e) =>
                  setFormData({ ...formData, user_name: e.target.value })
                }
                className="h-12"
              />
            </div>
          </div>

          {/* 3. File Upload */}
          <div className="space-y-2">
            <Label>ไฟล์ PDF (Certificate)</Label>
            <div className="border border-slate-200 rounded-lg p-4 flex items-center gap-4 bg-slate-50">
              <FileText className="h-8 w-8 text-slate-400" />
              <Input
                id="singlePdfInput"
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="h-10 text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
            {file && (
              <p className="text-xs text-slate-500 mt-1">
                ไฟล์จะถูกอัปโหลดไปที่:{" "}
                <code>
                  /{selectedEventSlug || "..."}/{file.name}
                </code>
              </p>
            )}
          </div>

          {/* Status Message */}
          {status && (
            <div
              className={`p-4 rounded-xl flex items-start gap-3 border ${status.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}
            >
              {status.type === "success" ? (
                <CheckCircle className="h-5 w-5 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">
                  {status.type === "success"
                    ? "ดำเนินการสำเร็จ"
                    : "เกิดข้อผิดพลาด"}
                </p>
                <p className="text-sm opacity-90">{status.message}</p>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-lg bg-purple-700 hover:bg-purple-800 shadow-lg shadow-purple-900/10"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Save className="mr-2" />
            )}
            {loading ? "กำลังบันทึกข้อมูล..." : "บันทึกข้อมูล"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
