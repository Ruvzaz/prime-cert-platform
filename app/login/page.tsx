"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Login with Supabase Auth
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message); // หรือ 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      setLoading(false);
    } else {
      // Login สำเร็จ -> ไปหน้า Admin
      router.push("/admin");
    }
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      {/* Left Side: Branding (โชว์เฉพาะจอใหญ่) */}
      <div className="hidden lg:flex flex-col justify-between bg-[#192768] p-10 text-white">
        <div className="flex items-center gap-2 font-bold text-xl">
          <ShieldCheck className="h-8 w-8" />
          CertPlatform Admin
        </div>
        <div className="space-y-4">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;ระบบจัดการใบประกาศนียบัตรดิจิทัลที่ทันสมัย รวดเร็ว
              และปลอดภัยสำหรับองค์กรของคุณ&rdquo;
            </p>
            <footer className="text-sm text-slate-300">
              Internal System v1.0
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4 lg:hidden">
              <div className="bg-[#192768] p-3 rounded-full">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              เข้าสู่ระบบผู้ดูแล
            </CardTitle>
            <CardDescription>
              กรอกอีเมลและรหัสผ่านเพื่อเข้าจัดการข้อมูล
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2">
                  <Lock className="h-4 w-4" /> {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#192768] hover:bg-[#2a3b8f]"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : null}
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
