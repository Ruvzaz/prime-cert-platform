"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search, Download, CheckCircle2, XCircle } from "lucide-react";

interface SearchFormProps {
  eventId: string;
  bucketUrl: string;
  themeColor: string;
  eventSlug: string; // รับค่า slug มาเพื่อใช้ประกอบ Link (ถ้าจำเป็นในอนาคต)
}

export default function SearchForm({
  eventId,
  bucketUrl,
  themeColor,
  eventSlug,
}: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: ห้ามค้นหาถ้าช่องว่าง
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const searchTerm = query.trim();
      // Query Database หาข้อมูลจาก event_id และ (user_identifier หรือ user_name)
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("event_id", eventId)
        .or(`user_identifier.eq.${searchTerm},user_name.ilike.%${searchTerm}%`); // ค้นหาด้วยรหัส (ตรงตัว) หรือ ชื่อ (บางส่วน)

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        setError("ไม่พบข้อมูลในระบบ กรุณาตรวจสอบรหัสหรือชื่ออีกครั้ง");
      } else {
        setResults(data);
      }
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อระบบ");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันดาวน์โหลด (Updated: นับยอดดาวน์โหลด)
  const handleDownload = (certId: string) => {
    // ✅ วิ่งไป API เพื่อบันทึกสถิติ (+1) ก่อน แล้ว API จะ Redirect ไปหาไฟล์จริงให้อัตโนมัติ
    const downloadApiUrl = `/api/download?id=${certId}`;
    // เปิด Tab ใหม่
    window.open(downloadApiUrl, "_blank");
  };

  return (
    <div className="w-full space-y-8">
      {/* Search Input Group (NCSA Style) */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
        <Input
          placeholder="กรอกชื่อ, รหัสพนักงาน หรือ เบอร์โทรศัพท์"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 h-12 text-base px-4 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading || !query.trim()}
          className="h-12 px-8 rounded-md text-base font-semibold shadow-md transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
          style={{ backgroundColor: themeColor }}
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>ค้นหา</span>
            </div>
          )}
        </Button>
      </form>

      {/* Result Display - List Row Style */}
      {results.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
             
             {/* Table Header like */}
             <div className="bg-primary/5 px-6 py-3 border-b border-primary/10 flex justify-between items-center" style={{ borderColor: `${themeColor}20`, backgroundColor: `${themeColor}05` }}>
                <span className="text-sm font-semibold text-slate-700">ผลการค้นหา</span>
                <span className="text-xs text-slate-500">พบ {results.length} รายการ</span>
             </div>

             {/* Result Rows */}
             <div className="divide-y divide-slate-100">
               {results.map((result) => (
                 <div key={result.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4 w-full">
                      <div className="h-12 w-12 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                         <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-lg font-bold text-slate-800 truncate">{result.user_name}</h4>
                        <p className="text-sm text-slate-500 font-mono truncate">ID: {result.user_identifier}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleDownload(result.id)}
                      className="w-full md:w-auto h-10 px-6 text-sm font-medium rounded-md shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap"
                      style={{ backgroundColor: themeColor }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="animate-in fade-in slide-in-from-top-2 flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 shadow-sm">
          <XCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}
