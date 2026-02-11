import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import SearchForm from "@/components/search-form";
import { Event } from "@/types"; // ตรวจสอบว่าคุณมี type นี้ หรือจะใช้ any ไปก่อนก็ได้

// บังคับให้โหลดข้อมูลใหม่เสมอ (ไม่ Cache) เพื่อความสดใหม่
export const dynamic = "force-dynamic";

// Next.js 15+: Params ต้องเป็น Promise
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventPage(props: PageProps) {
  // 1. ดึงค่า Slug จาก URL (ต้อง await)
  const params = await props.params;
  const slug = decodeURIComponent(params.slug);

  // 2. ค้นหาข้อมูล Event จาก Supabase
  const { data: eventData, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  // 3. ถ้าไม่เจอ หรือมี Error ให้ส่งไปหน้า 404
  if (error || !eventData) {
    console.error(`Event not found: ${slug}`, error);
    notFound();
  }

  // Cast type ข้อมูล
  const event = eventData as Event;

  // Fallback: ถ้าไม่ได้ตั้งสีมา ให้ใช้สีกรมท่าเป็นค่าเริ่มต้น
  const themeColor = event.theme_color || "#192768";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* --- Background Section --- */}
      {/* 1. Theme Color Gradient (Fallback) */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          background: `linear-gradient(135deg, ${themeColor} 0%, #1e293b 100%)` 
        }}
      />

      {/* 2. Poster Image (Overlay with Blur) */}
      {event.poster_url && (
        <div className="absolute inset-0 z-0 opacity-60">
           <img
            src={event.poster_url}
            alt="Event Background"
            className="w-full h-full object-cover blur-sm scale-110"
          />
          {/* Noise Texture for premium feel (Optional) */}
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        </div>
      )}

      {/* --- Main Content Card --- */}
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 relative z-10 border border-white/20">
        
        {/* Header / Branding Section */}
        <div className="flex flex-col items-center pt-12 pb-8 px-6 text-center space-y-8">
          
          {/* Logo Container - Clean & Integrated (Adjusted Size) */}
          {event.logo_url && (
            <div className="h-20 md:h-32 w-auto max-w-[280px] relative flex items-center justify-center mix-blend-multiply mx-auto">
               <img
                src={event.logo_url}
                alt={`${event.name} Logo`}
                className="h-full w-auto object-contain hover:scale-105 transition-transform"
              />
            </div>
          )}

          {/* Title */}
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {event.name}
            </h1>
            <p className="text-slate-500 text-lg font-light">
              ระบบดาวน์โหลดใบประกาศนียบัตรออนไลน์
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-slate-200" />

        {/* Content Section (Search) */}
        <div className="p-8 md:p-12 bg-slate-50/50">
          <div className="max-w-2xl mx-auto">
             <div className="mb-6 text-left">
                <h2 className="text-lg font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full inline-block" style={{ backgroundColor: themeColor }}/>
                  ค้นหาใบประกาศนียบัตร
                </h2>
                <p className="text-sm text-slate-400 pl-3">กรอกรหัสพนักงาน หรือ เบอร์โทรศัพท์ เพื่อตรวจสอบสิทธิ์</p>
             </div>
             
             <SearchForm
              eventId={event.id}
              bucketUrl={event.storage_bucket_url}
              themeColor={themeColor}
              eventSlug={slug}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 py-4 text-center text-slate-400 text-xs border-t border-slate-200">
           &copy; {new Date().getFullYear()} Digital Certificate Platform
        </div>

      </div>
    </main>
  );
}
