"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, Search, FileCheck } from "lucide-react";
import { Certificate } from "@/types";

interface SearchProps {
  eventId: string;
  themeColor: string;
  bucketUrl: string;
}

export default function CertificateSearch({
  eventId,
  themeColor,
  bucketUrl,
}: SearchProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Logic: Search by user_identifier within the specific Event ID
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_identifier", query.trim()) // Case sensitive check? ขึ้นอยู่กับ Requirement
        .single();

      if (error) throw error;
      if (!data) {
        setError("ไม่พบข้อมูลใบประกาศนียบัตรของรหัสนี้");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("ไม่พบข้อมูล หรือรหัสพนักงานไม่ถูกต้อง");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    // Construct R2 Public URL or Presigned URL
    // สมมติว่า bucketUrl เป็น Base URL เช่น https://pub-xxx.r2.dev
    const downloadUrl = `${bucketUrl}/${result.filename}`;
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="กรอกรหัสพนักงาน / Employee ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-white/90 backdrop-blur"
        />
        <Button
          type="submit"
          disabled={loading}
          style={{ backgroundColor: themeColor }} // Dynamic Theme Application
          className="text-white hover:opacity-90"
        >
          {loading ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {result && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-700">
              <FileCheck className="h-5 w-5 text-green-600" />
              ค้นพบใบประกาศนียบัตร
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-slate-500">
              ชื่อผู้รับ:{" "}
              <span className="font-semibold text-slate-900 text-lg block">
                {result.user_name}
              </span>
            </div>
            <Button
              onClick={handleDownload}
              className="w-full gap-2"
              style={{ backgroundColor: themeColor }}
            >
              <Download className="h-4 w-4" /> ดาวน์โหลด PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
