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
import { Loader2, Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden">
      {/* Left Side: Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-primary relative overflow-hidden p-10 text-primary-foreground">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-black/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="flex items-center gap-2 font-heading font-bold text-2xl z-10">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
            <ShieldCheck className="h-8 w-8" />
          </div>
          CertPlatform Admin
        </div>
        
        <div className="space-y-6 z-10 max-w-lg">
          <blockquote className="space-y-4">
            <p className="text-2xl font-light leading-relaxed">
              &ldquo;The most secure, efficient, and elegant way to manage your organization's digital credentials.&rdquo;
            </p>
            <footer className="text-primary-foreground/80 flex items-center gap-2">
              <div className="h-px w-8 bg-primary-foreground/50" />
              Internal System v2.0
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30 relative">
        <Link href="/" className="absolute top-8 left-8 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
             <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        
        <div className="w-full max-w-md space-y-4 animate-slide-up [animation-fill-mode:backwards]">
            <div className="flex justify-center mb-6 lg:hidden">
              <div className="bg-primary p-3 rounded-full shadow-lg shadow-primary/30">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <Card className="border-border/50 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center pb-8 border-b border-border/50 mb-6">
                <CardTitle className="text-2xl font-bold tracking-tight">
                Welcome Back
                </CardTitle>
                <CardDescription className="text-base">
                Sign in to access your administrative dashboard
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                    </div>
                    <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                    />
                </div>

                {error && (
                    <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2 border border-destructive/20 animate-fade-in">
                    <Lock className="h-4 w-4" /> {error}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full h-11 text-base shadow-primary/25"
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
            
            <p className="px-8 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="underline underline-offset-4 hover:text-primary">
                    Create New Account
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
