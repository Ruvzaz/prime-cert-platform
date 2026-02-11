import { AdminNav } from "@/components/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Navbar จะติดอยู่ทุกหน้าโดยอัตโนมัติ */}
      <AdminNav />

      {/* เนื้อหาของแต่ละหน้าจะถูก Render ตรงนี้ */}
      <main className="max-w-7xl mx-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
