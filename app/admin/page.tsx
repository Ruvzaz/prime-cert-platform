"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// UI Components
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
  Activity,
  FileText,
  DownloadCloud,
  Users,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RePie,
  Pie,
  Legend,
} from "recharts";

export default function AdminDashboard() {
  const router = useRouter();

  // --- States ---
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("all");

  // --- Fetch Data ---
  useEffect(() => {
    const initData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      // 1. ดึง Events ทั้งหมด
      const { data: eventsData } = await supabase
        .from("events")
        .select("id, name")
        .order("created_at", { ascending: false });

      if (eventsData) setEvents(eventsData);

      // 2. ดึง Certificates ทั้งหมด (เอาแค่ column ที่จำเป็นเพื่อ performance)
      // เราดึงมาหมดทีเดียวแล้วค่อย Filter ใน Frontend (ถ้าข้อมูล < 10,000 แถว วิธีนี้เร็วและลื่นกว่า)
      const { data: certsData } = await supabase
        .from("certificates")
        .select("id, event_id, download_count");

      if (certsData) setCertificates(certsData);

      setLoading(false);
    };

    initData();
  }, [router]);

  // --- Calculation Logic (ทำงานทุกครั้งที่เลือก Filter) ---
  const stats = useMemo(() => {
    // 1. Filter Data
    const filteredCerts =
      selectedEventId === "all"
        ? certificates
        : certificates.filter((c) => c.event_id === selectedEventId);

    // 2. Calculate Metrics
    const totalCerts = filteredCerts.length;

    // ยอดดาวน์โหลดรวม (Total Traffic)
    const totalDownloads = filteredCerts.reduce(
      (sum, c) => sum + (c.download_count || 0),
      0,
    );

    // จำนวนคนที่เข้ามากดโหลดอย่างน้อย 1 ครั้ง (Active Users)
    const activeUsers = filteredCerts.filter(
      (c) => (c.download_count || 0) > 0,
    ).length;

    // คำนวณ % Conversion (Active Users / Total Issued)
    const conversionRate =
      totalCerts > 0 ? ((activeUsers / totalCerts) * 100).toFixed(1) : "0";

    return {
      totalCerts,
      totalDownloads,
      activeUsers,
      conversionRate,
    };
  }, [selectedEventId, certificates]);

  // --- Chart Data Preparation ---
  const chartData = useMemo(() => {
    if (selectedEventId === "all") {
      // กราฟแท่ง: เปรียบเทียบจำนวน Certs ของแต่ละ Event
      return events
        .map((ev) => {
          const count = certificates.filter((c) => c.event_id === ev.id).length;
          return { name: ev.name, count };
        })
        .filter((item) => item.count > 0); // โชว์เฉพาะงานที่มีข้อมูล
    } else {
      // กราฟวงกลม: Downloaded vs Not Downloaded (เฉพาะ Event ที่เลือก)
      const downloaded = stats.activeUsers;
      const notDownloaded = stats.totalCerts - downloaded;
      return [
        { name: "Downloaded", value: downloaded, fill: "#10b981" }, // Green
        { name: "Pending", value: notDownloaded, fill: "#e2e8f0" }, // Gray
      ];
    }
  }, [selectedEventId, events, certificates, stats]);

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-20">
      {/* --- Header & Filter --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {selectedEventId === "all"
              ? "Overview of system statistics"
              : `Deep dive: ${events.find((e) => e.id === selectedEventId)?.name}`}
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="w-full md:w-[280px]">
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Filter by Event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🌐 All Events</SelectItem>
              {events.map((ev) => (
                <SelectItem key={ev.id} value={ev.id}>
                  📅 {ev.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- Stat Cards Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Certificates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Issued Certificates
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalCerts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Downloads (Traffic) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Downloads
            </CardTitle>
            <DownloadCloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalDownloads.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Active Users (Unique) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique recipients active
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Success Rate (%) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Participation Rate
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* --- Dynamic Chart Section --- */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            {selectedEventId === "all"
              ? "Volume comparison across events"
              : "Download status breakdown"}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] w-full pl-2">
          <ResponsiveContainer width="100%" height="100%">
            {selectedEventId === "all" ? (
              // --- Graph 1: Bar Chart (All Events) ---
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  barSize={50}
                />
              </BarChart>
            ) : (
              // --- Graph 2: Pie Chart (Single Event) ---
              <RePie width={400} height={400}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80} // Donut Chart
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      stroke="hsl(var(--card))"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </RePie>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
