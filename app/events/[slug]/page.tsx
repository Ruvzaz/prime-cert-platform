import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import SearchForm from "@/components/search-form";
import { Event } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventPage(props: PageProps) {
  const params = await props.params;
  const slug = decodeURIComponent(params.slug);

  const { data: eventData, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !eventData) {
    console.error(`Event not found: ${slug}`, error);
    notFound();
  }

  const event = eventData as Event;
  const themeColor = event.theme_color || "#4f46e5"; // Default to indigo if missing

  // Darken theme color for gradient text
  const gradientStyle = {
    background: `linear-gradient(135deg, ${themeColor} 0%, #0f172a 100%)`,
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* --- Dynamic Background --- */}
      <div 
        className="absolute inset-0 z-0 animate-fade-in"
        style={gradientStyle}
      />
      
      {/* Background Texture/Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Optional Poster Blur Overlay */}
      {event.poster_url && (
        <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none overflow-hidden mix-blend-overlay">
           <img
            src={event.poster_url}
            alt=""
            className="w-full h-full object-cover blur-[100px] scale-150"
          />
        </div>
      )}

      {/* --- Main Glass Container --- */}
      <div className="w-full max-w-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-3xl shadow-2xl overflow-hidden animate-slide-up duration-700 relative z-10 border border-white/50 dark:border-white/10 ring-1 ring-black/5">
        
        {/* Header Section */}
        <div className="relative pt-14 pb-8 px-8 text-center space-y-6">
          
          {/* Logo - Larger & Less Rounded & Less Padding */}
          {event.logo_url && (
            <div className="relative mx-auto inline-block group">
               {/* Glow effect behind */}
               <div 
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-3xl opacity-40 rounded-full transition-opacity duration-500 group-hover:opacity-60"
                 style={{ backgroundColor: themeColor }}
               />
               
               {/* Rounded White Container */}
               <div className="relative h-40 w-40 bg-white dark:bg-slate-800 rounded-3xl p-3 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-700 flex items-center justify-center transform transition-transform duration-300 hover:scale-105 hover:-rotate-1">
                 <img
                  src={event.logo_url}
                  alt={`${event.name} Logo`}
                  className="w-full h-full object-contain filter dark:brightness-110"
                />
               </div>
            </div>
          )}

          {/* Titles */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {event.name}
            </h1>
            
            <div className="flex items-center justify-center gap-3">
               <div className="h-px w-8 bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-700" />
               <p className="text-slate-500 dark:text-slate-400 font-medium text-xs tracking-wide uppercase">
                 Digital Certificate Portal
               </p>
               <div className="h-px w-8 bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-700" />
            </div>
          </div>
        </div>

        {/* Content Section (Search) */}
        <div className="relative px-6 md:px-12 pb-12">
          {/* Subtle Separator */}
          <div className="w-full h-px bg-slate-100 dark:bg-slate-800 mb-8" />

          <div className="max-w-xl mx-auto">
             <div className="mb-6 text-center">
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Verify & Download
                </h2>
                <p className="text-slate-500 text-xs text-muted-foreground/80">
                  กรอกรหัสพนักงาน หรือ เบอร์โทรศัพท์ เพื่อค้นหาเอกสารของคุณ
                </p>
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
        <div className="bg-slate-50 dark:bg-slate-950 py-4 text-center text-slate-400 text-xs font-medium border-t border-slate-100 dark:border-slate-800">
           <span className="opacity-75">Secured by</span> <span className="text-slate-600 dark:text-slate-300 font-bold">CertPlatform</span>
        </div>

      </div>
      
    </main>
  );
}
