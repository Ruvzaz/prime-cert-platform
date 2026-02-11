"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Papa from "papaparse";
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
} from "@/components/ui/select";
import {
  Loader2,
  FileUp,
  CheckCircle,
  AlertCircle,
  FileType,
} from "lucide-react";

export function ImportCsvForm() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase.from("events").select("id, name");
      if (data) setEvents(data);
    };
    fetchEvents();
  }, []);

  const handleUpload = async () => {
    if (!csvFile || !selectedEventId) {
      setStatus({
        type: "error",
        message: "กรุณาเลือกงาน (Event) และไฟล์ CSV",
      });
      return;
    }

    setUploading(true);
    setStatus(null);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];

        if (rows.length === 0) {
          setStatus({ type: "error", message: "ไฟล์ CSV ว่างเปล่า" });
          setUploading(false);
          return;
        }
        if (
          !rows[0].user_identifier ||
          !rows[0].user_name ||
          !rows[0].filename
        ) {
          setStatus({
            type: "error",
            message:
              "Format ผิด! หัวตารางต้องเป็น: user_identifier, user_name, filename",
          });
          setUploading(false);
          return;
        }

        const payload = rows.map((row) => ({
          event_id: selectedEventId,
          user_identifier: row.user_identifier,
          user_name: row.user_name,
          filename: row.filename,
        }));

        const { error } = await supabase.from("certificates").insert(payload);

        if (error) {
          setStatus({
            type: "error",
            message: `Database Error: ${error.message}`,
          });
        } else {
          setStatus({
            type: "success",
            message: `✅ นำเข้าข้อมูลสำเร็จ ${rows.length} รายชื่อ!`,
          });
          setCsvFile(null);
          const fileInput = document.getElementById(
            "csvInput",
          ) as HTMLInputElement;
          if (fileInput) fileInput.value = "";
        }
        setUploading(false);
      },
      error: (err) => {
        setStatus({ type: "error", message: err.message });
        setUploading(false);
      },
    });
  };

  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-slate-50 border-b p-6">
        <CardTitle className="flex items-center gap-3 text-emerald-800">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <FileUp className="h-6 w-6" />
          </div>
          Import CSV Data
        </CardTitle>
        <CardDescription className="text-slate-500 ml-12">
          จับคู่รหัสพนักงานกับชื่อไฟล์ PDF ที่อัปโหลดไปแล้ว
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <span className="bg-slate-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                1
              </span>
              เลือกงาน (Event)
            </label>
            <Select onValueChange={setSelectedEventId}>
              <SelectTrigger className="h-12 border-slate-200 shadow-sm">
                <SelectValue placeholder="-- เลือกงานที่จะเพิ่มรายชื่อ --" />
              </SelectTrigger>
              <SelectContent>
                {events.map((evt) => (
                  <SelectItem key={evt.id} value={evt.id}>
                    {evt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <span className="bg-slate-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                2
              </span>
              เลือกไฟล์ CSV
            </label>
            <div className="relative">
              <Input
                id="csvInput"
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                className="h-12 pt-2 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border-slate-200 shadow-sm"
              />
            </div>
            <p className="text-xs text-slate-400 pl-1">
              Format: <code>user_identifier, user_name, filename</code>
            </p>
          </div>
        </div>

        {status && (
          <div
            className={`p-4 rounded-xl flex items-start gap-3 border ${status.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}
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
          disabled={uploading || !selectedEventId || !csvFile}
          className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-900/10 transition-all active:scale-[0.99]"
        >
          {uploading ? (
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
          ) : (
            <FileType className="mr-2 h-5 w-5" />
          )}
          {uploading ? "กำลังประมวลผล..." : "ยืนยันการนำเข้าข้อมูล"}
        </Button>
      </CardContent>
    </Card>
  );
}
