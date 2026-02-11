"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadPdfForm } from "@/components/admin/upload-pdf-form";
import { ImportCsvForm } from "@/components/admin/import-csv-form";
import { AddSingleForm } from "@/components/admin/add-single-form"; // Import ตัวใหม่
import { UploadCloud, Database, UserPlus } from "lucide-react";

export default function CertificatesPage() {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Certificate Manager
        </h1>
        <p className="text-slate-500">ระบบจัดการไฟล์และข้อมูลใบประกาศนียบัตร</p>
      </div>

      <Tabs defaultValue="upload-pdf" className="flex flex-col gap-6">
        {/* Tab Navigation: เพิ่ม Tab ที่ 3 */}
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-4 h-auto bg-transparent p-0 flex-shrink-0">
          <TabsTrigger
            value="upload-pdf"
            className="group flex flex-col items-center gap-3 py-6 rounded-2xl border-2 border-transparent bg-slate-50/50 data-[state=active]:bg-white data-[state=active]:border-primary/10 data-[state=active]:shadow-lg transition-all hover:bg-white hover:border-slate-100 hover:shadow-sm"
          >
            <div className="bg-white p-3 rounded-2xl shadow-sm ring-1 ring-slate-100 group-data-[state=active]:bg-blue-50 group-data-[state=active]:text-blue-600 group-data-[state=active]:ring-blue-100 transition-all text-slate-400">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-slate-600 text-base group-data-[state=active]:text-blue-700">
                1. Bulk Upload (R2)
              </span>
              <span className="text-xs text-slate-400 font-medium group-data-[state=active]:text-blue-600/80">
                อัปโหลดไฟล์ PDF จำนวนมาก
              </span>
            </div>
          </TabsTrigger>

          <TabsTrigger
            value="import-csv"
            className="group flex flex-col items-center gap-3 py-6 rounded-2xl border-2 border-transparent bg-slate-50/50 data-[state=active]:bg-white data-[state=active]:border-primary/10 data-[state=active]:shadow-lg transition-all hover:bg-white hover:border-slate-100 hover:shadow-sm"
          >
            <div className="bg-white p-3 rounded-2xl shadow-sm ring-1 ring-slate-100 group-data-[state=active]:bg-emerald-50 group-data-[state=active]:text-emerald-600 group-data-[state=active]:ring-emerald-100 transition-all text-slate-400">
              <Database className="h-6 w-6" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-slate-600 text-base group-data-[state=active]:text-emerald-700">
                2. Import CSV
              </span>
              <span className="text-xs text-slate-400 font-medium group-data-[state=active]:text-emerald-600/80">
                นำเข้าข้อมูลจำนวนมาก
              </span>
            </div>
          </TabsTrigger>

          <TabsTrigger
            value="add-single"
            className="group flex flex-col items-center gap-3 py-6 rounded-2xl border-2 border-transparent bg-slate-50/50 data-[state=active]:bg-white data-[state=active]:border-primary/10 data-[state=active]:shadow-lg transition-all hover:bg-white hover:border-slate-100 hover:shadow-sm"
          >
            <div className="bg-white p-3 rounded-2xl shadow-sm ring-1 ring-slate-100 group-data-[state=active]:bg-purple-50 group-data-[state=active]:text-purple-600 group-data-[state=active]:ring-purple-100 transition-all text-slate-400">
              <UserPlus className="h-6 w-6" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-slate-600 text-base group-data-[state=active]:text-purple-700">
                3. Add Single
              </span>
              <span className="text-xs text-slate-400 font-medium group-data-[state=active]:text-purple-600/80">
                เพิ่มทีละคน (One-Stop)
              </span>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* --- Content Areas --- */}

        <TabsContent value="upload-pdf" className="mt-0">
          <UploadPdfForm />
        </TabsContent>

        <TabsContent value="import-csv" className="mt-0">
          <ImportCsvForm />
        </TabsContent>

        <TabsContent value="add-single" className="mt-0">
          <AddSingleForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
