"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // เพิ่ม import supabase
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/select"; // เพิ่ม Select
import {
  Loader2,
  Upload,
  FolderUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function UploadPdfForm() {
  // เพิ่ม State เก็บรายการ Events
  const [events, setEvents] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>(""); // เก็บ slug ของ event

  const [pdfFiles, setPdfFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // 1. ดึงข้อมูล Event มาใส่ Dropdown ตอนเปิดหน้าเว็บ
  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase.from("events").select("id, name, slug");
      if (data) setEvents(data);
    };
    fetchEvents();
  }, []);

  const handleUpload = async () => {
    // เพิ่มเงื่อนไขเช็คว่าเลือก Folder หรือยัง
    if (!pdfFiles || pdfFiles.length === 0 || !selectedFolder) {
      setStatus({
        type: "error",
        message: "กรุณาเลือกงาน (Event) และไฟล์ PDF",
      });
      return;
    }

    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    // ส่งค่า folder ไปด้วย
    formData.append("folder", selectedFolder);

    Array.from(pdfFiles).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch("/api/upload-certs", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Upload failed");

      setStatus({
        type: "success",
        message: `✅ อัปโหลดสำเร็จ! ไฟล์ถูกเก็บในโฟลเดอร์ "${result.folder}" จำนวน ${result.uploaded} ไฟล์`,
      });

      // Reset
      const fileInput = document.getElementById("pdfInput") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      setPdfFiles(null);
    } catch (error: any) {
      console.error(error);
      setStatus({ type: "error", message: `เกิดข้อผิดพลาด: ${error.message}` });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b p-6">
        <CardTitle className="flex items-center gap-3 text-[#192768]">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FolderUp className="h-6 w-6" />
          </div>
          Bulk Upload Certificates
        </CardTitle>
        <CardDescription className="text-slate-500 ml-12">
          เลือกงานที่ต้องการ และอัปโหลดไฟล์ PDF ขึ้น Cloud (ระบบจะสร้าง Folder
          ตามชื่องานอัตโนมัติ)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        {/* --- ส่วนที่เพิ่มมา: Dropdown เลือก Folder --- */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            เลือกงาน (Target Folder)
          </label>
          <Select onValueChange={setSelectedFolder}>
            <SelectTrigger className="h-12 border-slate-200">
              <SelectValue placeholder="-- กรุณาเลือกงานที่จะอัปโหลดไฟล์ --" />
            </SelectTrigger>
            <SelectContent>
              {events.map((evt) => (
                <SelectItem key={evt.id} value={evt.slug}>
                  {evt.name} (/{evt.slug})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-400">
            * หากต้องการโฟลเดอร์ใหม่ กรุณาไปสร้าง Event ใหม่ที่เมนู Events ก่อน
          </p>
        </div>

        {/* ส่วน Upload เดิม */}
        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer group relative bg-slate-50/50 ${!selectedFolder ? "opacity-50 pointer-events-none border-slate-200" : "border-slate-300 hover:bg-slate-50 hover:border-[#192768]/50"}`}
        >
          <Input
            id="pdfInput"
            type="file"
            accept="application/pdf"
            multiple
            onChange={(e) => setPdfFiles(e.target.files)}
            disabled={!selectedFolder} // ห้ามเลือกไฟล์ถ้ายังไม่เลือก Folder
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Upload className="h-8 w-8 text-[#192768]" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-700">
                {pdfFiles && pdfFiles.length > 0
                  ? `${pdfFiles.length} ไฟล์ถูกเลือก`
                  : "คลิกหรือลากไฟล์ PDF มาวางที่นี่"}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {selectedFolder
                  ? `ไฟล์จะถูกอัปโหลดไปที่: /${selectedFolder}/...`
                  : "กรุณาเลือกงานด้านบนก่อน"}
              </p>
            </div>
          </div>
        </div>

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
          onClick={handleUpload}
          disabled={uploading || !pdfFiles || !selectedFolder}
          className="w-full h-14 text-lg bg-[#192768] hover:bg-[#2a3b8f] shadow-lg shadow-blue-900/10 transition-all active:scale-[0.99]"
        >
          {uploading ? (
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
          ) : (
            <Upload className="mr-2 h-5 w-5" />
          )}
          {uploading ? "เริ่มอัปโหลดเข้า Folder" : "เริ่มอัปโหลดเข้า Folder"}
        </Button>
      </CardContent>
    </Card>
  );
}
