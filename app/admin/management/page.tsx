"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Trash2,
  Search,
  DownloadCloud,
  Calendar,
  FileText,
  ExternalLink,
  AlertTriangle,
  Filter,
} from "lucide-react";
import Link from "next/link";

export default function ManagementPage() {
  const [activeTab, setActiveTab] = useState("certificates");

  // --- States ---
  const [certs, setCerts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("all");

  // --- Delete States ---
  const [deleteCertId, setDeleteCertId] = useState<string | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  // --- Fetch Events (Once) ---
  const fetchEvents = async () => {
    const { data: eventData } = await supabase
      .from("events")
      .select("*, certificates(count)")
      .order("created_at", { ascending: false });

    if (eventData) {
      const eventsWithCount = eventData.map((e: any) => ({
        ...e,
        cert_count: e.certificates[0]?.count || 0,
      }));
      setEvents(eventsWithCount);
    }
  };

  // --- Fetch Certificates (Depends on filter) ---
  const fetchCerts = async () => {
    setLoading(true);
    let query = supabase
      .from("certificates")
      .select("*, events(name)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (selectedEventId && selectedEventId !== "all") {
      query = query.eq("event_id", selectedEventId);
    }

    const { data: certData } = await query;
    if (certData) setCerts(certData);
    setLoading(false);
  };

  // Initial Load
  useEffect(() => {
    fetchEvents();
  }, []);

  // Reload Certs on Filter Change
  useEffect(() => {
    fetchCerts();
  }, [selectedEventId]);

  // --- Actions ---

  const confirmDeleteCert = async () => {
    if (!deleteCertId) return;
    const { error } = await supabase.from("certificates").delete().eq("id", deleteCertId);
    if (!error) {
      setCerts(certs.filter((c) => c.id !== deleteCertId));
      // Optionally re-fetch to be safe
      fetchCerts();
    }
    setDeleteCertId(null);
  };

  const confirmDeleteEvent = async () => {
    if (!deleteEventId) return;
    const { error } = await supabase.from("events").delete().eq("id", deleteEventId);

    if (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } else {
      setEvents(events.filter((e) => e.id !== deleteEventId));
      fetchEvents(); // Refresh list
    }
    setDeleteEventId(null);
  };

  // Filter Search
  const filteredCerts = certs.filter(
    (c) =>
      c.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user_identifier.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 pb-24 px-4 sm:px-6">
      
      {/* Header Section */}
      <div className="mb-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Management</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manage your Events and Certificates efficiently.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 px-3 py-1 rounded-md text-xs font-medium text-slate-600">
              Admin Portal
            </div>
            <div className="text-slate-300">|</div>
            <div className="text-sm text-slate-500">
              v1.0.0
            </div>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="certificates"
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] h-10 p-1 bg-slate-100 rounded-lg">
          <TabsTrigger value="certificates" className="gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all text-sm font-medium">
            <FileText className="h-4 w-4" /> Certificates
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all text-sm font-medium">
            <Calendar className="h-4 w-4" /> Events
          </TabsTrigger>
        </TabsList>

        {/* ================= TAB 1: CERTIFICATES ================= */}
        <TabsContent value="certificates" className="space-y-4">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  รายชื่อผู้รับใบประกาศล่าสุด
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  จัดการและตรวจสอบสถานะการดาวน์โหลดทั้งหมด
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                 {/* Event Filter */}
                 <div className="w-full sm:w-[280px]">
                  <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                    <SelectTrigger className="pl-3 h-9 w-full bg-white border-slate-200 rounded-md focus:ring-primary/20 text-sm">
                      <div className="flex items-center gap-2 truncate">
                        <Filter className="h-3.5 w-3.5 text-slate-400" />
                        <SelectValue placeholder="Filter by Event" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด (All Events)</SelectItem>
                      {events.map((evt) => (
                        <SelectItem key={evt.id} value={evt.id}>
                          {evt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                 </div>

                 {/* Search Box */}
                 <div className="relative w-full sm:w-72 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="ค้นหาชื่อ หรือ รหัส..."
                    className="pl-9 h-9 bg-white border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-md transition-all text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="w-[200px] font-semibold text-slate-600">Event</TableHead>
                    <TableHead className="font-semibold text-slate-600">Name</TableHead>
                    <TableHead className="font-semibold text-slate-600">ID</TableHead>
                    <TableHead className="text-center font-semibold text-slate-600">Downloads</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-48 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <Loader2 className="animate-spin h-8 w-8 text-primary" />
                          <p>กำลังโหลดข้อมูล...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredCerts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-48 text-center text-slate-500">
                        <div className="flex flex-col items-center gap-2 opacity-60">
                          <FileText className="h-10 w-10" />
                          <p>ไม่พบข้อมูลใบประกาศ</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCerts.map((cert) => (
                      <TableRow key={cert.id} className="hover:bg-slate-50/40 transition-colors border-b border-slate-100 last:border-0">
                        <TableCell className="font-medium text-slate-600">
                          <div className="truncate max-w-[180px] text-xs font-medium bg-slate-100 text-slate-600 inline-block px-2 py-1 rounded-md border border-slate-200">
                            {cert.events?.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-700 font-medium">
                          {cert.user_name}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md">
                            {cert.user_identifier}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                              cert.download_count > 0 
                                ? "bg-green-50 text-green-700 border-green-200" 
                                : "bg-slate-50 text-slate-400 border-slate-200"
                            }`}
                          >
                            <DownloadCloud className="h-3 w-3" />
                            {cert.download_count}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors h-8 w-8"
                            onClick={() => setDeleteCertId(cert.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* ================= TAB 2: EVENTS ================= */}
        <TabsContent value="events" className="space-y-4">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  รายการงานกิจกรรมทั้งหมด
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  จัดการ Event และตั้งค่า URL สำหรับดาวน์โหลด
                </p>
              </div>
              <Link href="/admin/events/create">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-sm transition-all rounded-md px-4 h-9 text-sm font-medium">
                  + สร้างงานใหม่
                </Button>
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="w-[80px]"></TableHead>
                    <TableHead className="font-semibold text-slate-600">Event Name</TableHead>
                    <TableHead className="font-semibold text-slate-600">Slug / URL</TableHead>
                    <TableHead className="text-center font-semibold text-nowrap text-slate-600">Total Certs</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-48 text-center">
                         <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : events.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-48 text-center text-slate-500">
                         <div className="flex flex-col items-center gap-2 opacity-60">
                          <Calendar className="h-10 w-10" />
                          <p>ไม่มี Events ในระบบ</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    events.map((evt) => (
                      <TableRow key={evt.id} className="hover:bg-slate-50/40 transition-colors border-b border-slate-100 last:border-0">
                        <TableCell>
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm flex items-center justify-center">
                            {evt.logo_url ? (
                              <img
                                src={evt.logo_url}
                                className="w-full h-full object-contain p-1"
                                alt="Event Logo"
                              />
                            ) : (
                              <Calendar className="h-4 w-4 text-slate-300" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-800 text-sm">
                          {evt.name}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/events/${evt.slug}`}
                            target="_blank"
                            className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary transition-colors bg-slate-50 hover:bg-primary/5 px-2.5 py-1 rounded-md border border-slate-200 hover:border-primary/20"
                          >
                            <span className="font-mono text-xs">/{evt.slug}</span>
                            <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md text-xs font-semibold border border-slate-200">
                            {evt.cert_count.toLocaleString()} ใบ
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors h-8 w-8"
                            onClick={() => setDeleteEventId(evt.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* --- Delete Confirmation Dialogs --- */}
      
      {/* 1. Delete Cert Dialog */}
      <AlertDialog open={!!deleteCertId} onOpenChange={() => setDeleteCertId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบข้อมูล?</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบข้อมูลใบประกาศนียบัตรนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถเรียกคืนได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCert} className="bg-red-600 hover:bg-red-700">
              ลบข้อมูล
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 2. Delete Event Dialog */}
       <AlertDialog open={!!deleteEventId} onOpenChange={() => setDeleteEventId(null)}>
        <AlertDialogContent className="border-l-4 border-l-red-500">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 justify-center sm:justify-start text-red-600 mb-2">
              <AlertTriangle className="h-6 w-6" />
              <AlertDialogTitle className="text-red-600">คำเตือน: ลบงานกิจกรรม</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-slate-600">
              คุณกำลังจะลบงานกิจกรรมนี้ <strong className="text-red-600 underline">รวมถึงใบประกาศนียบัตรทั้งหมดในงานนี้</strong>
              <br/><br/>
              การกระทำนี้ <span className="font-bold text-red-500">ไม่สามารถกู้คืนได้ (Irreversible)</span> คุณแน่ใจหรือไม่?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEvent} className="bg-red-600 hover:bg-red-700">
              ยืนยันการลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
