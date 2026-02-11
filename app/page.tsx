import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Database, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center mx-auto px-4">
            <div className="mr-4 flex">
                <Link className="mr-6 flex items-center space-x-2" href="/">
                    <span className="font-bold inline-block">My Cert Platform</span>
                </Link>
            </div>
             <div className="flex flex-1 items-center justify-end space-x-2">
                <nav className="flex items-center space-x-2">
                    <Link href="/login">
                        <Button variant="ghost">Login</Button>
                    </Link>
                     <Link href="/register">
                        <Button>Get Started</Button>
                    </Link>
                </nav>
             </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto px-4">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
              Certify and Showcase Your Achievements
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              A secure and easy way to manage and verify digital certificates. Build trust with verifiable credentials.
            </p>
            <div className="space-x-4">
              <Link href="/login">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">Learn More</Button>
              </Link>
            </div>
          </div>
        </section>
        <section id="features" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 mx-auto px-4 rounded-xl">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Everything you need to manage digital certificates.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Card>
              <CardHeader>
                <ShieldCheck className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Easy Verification</CardTitle>
                <CardDescription>
                  Instantly verify the authenticity of any certificate issued on our platform.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Database className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Secure Storage</CardTitle>
                 <CardDescription>
                  Your data is stored securely using industry-standard encryption.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Globe className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Global Access</CardTitle>
                 <CardDescription>
                  Access your certificates from anywhere in the world, at any time.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
