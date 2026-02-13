"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Search, Download, CheckCircle2, XCircle, SearchX } from "lucide-react";

interface SearchFormProps {
  eventId: string;
  bucketUrl: string;
  themeColor: string;
  eventSlug: string;
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
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);
    setSearched(true);

    try {
      const searchTerm = query.trim();
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("event_id", eventId)
        .or(`user_identifier.eq.${searchTerm},user_name.ilike.%${searchTerm}%`);

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

  const handleDownload = (certId: string) => {
    const downloadApiUrl = `/api/download?id=${certId}`;
    window.open(downloadApiUrl, "_blank");
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Input Group */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 relative z-10">
        <div className="relative flex-1 group">
          <Input
            placeholder="กรอกชื่อ, รหัสพนักงาน หรือ เบอร์โทรศัพท์"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 h-12 text-base px-4 bg-white/50 backdrop-blur-xl border-white/20 shadow-lg shadow-input/5 rounded-lg focus-visible:ring-primary/30 transition-all group-hover:bg-white/60"
            disabled={loading}
          />
          <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
        </div>
        
        <Button
          type="submit"
          disabled={loading || !query.trim()}
          className="h-12 px-6 rounded-lg text-base font-medium shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap text-white"
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

      {/* Result Display */}
      {searched && !loading && results.length === 0 && !error && (
         <div className="text-center py-8 text-muted-foreground animate-fade-in">
            <SearchX className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p className="text-sm">ไม่พบข้อมูลที่ค้นหา</p>
         </div>
      )}

      {results.length > 0 && (
        <div className="animate-slide-up space-y-4">
          <div className="flex items-center justify-between px-2 pb-1">
             <span className="text-xs font-medium text-muted-foreground">ผลการค้นหา {results.length} รายการ</span>
          </div>
          
          <div className="space-y-3">
               {results.map((result, index) => (
                 <Card 
                    key={result.id} 
                    className="group border-white/20 bg-white/60 backdrop-blur-xl hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                 >
                   <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 relative">
                      {/* Decorative accent */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5" style={{ backgroundColor: themeColor }} />
                      
                      <div className="flex items-center gap-4 w-full pl-2">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform">
                           <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-lg font-bold text-foreground truncate">{result.user_name}</h4>
                          <p className="text-xs text-muted-foreground font-medium font-mono">
                            ID: <span className="text-foreground/80">{result.user_identifier}</span>
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleDownload(result.id)}
                        className="w-full md:w-auto h-9 px-6 text-sm font-medium rounded-md shadow-sm transition-all hover:brightness-110 whitespace-nowrap text-white"
                        style={{ backgroundColor: themeColor }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                   </div>
                 </Card>
               ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="animate-slide-up flex items-center gap-3 p-4 bg-red-50/90 backdrop-blur-sm text-red-600 rounded-lg border border-red-200 shadow-sm mx-auto max-w-lg">
          <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
             <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
             <h5 className="font-semibold text-sm">ไม่สามารถทำรายการได้</h5>
             <span className="text-xs opacity-90">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
