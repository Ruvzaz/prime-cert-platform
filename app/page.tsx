import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Database, Globe, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans overflow-hidden">
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 transition-all duration-300">
        <div className="container flex h-16 items-center px-4 md:px-6 mx-auto">
            <Link className="mr-6 flex items-center space-x-2 transition-opacity hover:opacity-80" href="/">
                <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <span className="font-heading font-bold text-lg tracking-tight">CertPlatform</span>
            </Link>
             <div className="flex flex-1 items-center justify-end space-x-4">
                <nav className="flex items-center space-x-2">
                    <Link href="/login">
                        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Login</Button>
                    </Link>
                     <Link href="/register">
                        <Button className="font-semibold shadow-primary/25">Get Started</Button>
                    </Link>
                </nav>
             </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center gap-6 text-center">
              
              <div className="animate-fade-in opacity-0 [animation-delay:100ms] [animation-fill-mode:forwards] inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                v2.0 Now Available
              </div>
              
              <h1 className="animate-slide-up opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards] font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground max-w-[1100px]">
                Certify and Showcase <br className="hidden md:block"/>
                <span className="text-gradient">Your Achievements</span>
              </h1>
              
              <p className="animate-slide-up opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards] max-w-[42rem] leading-normal text-muted-foreground text-lg sm:text-xl sm:leading-8">
                The most secure and elegant way to manage verifiable digital certificates. 
                Built for trust, designed for the future.
              </p>
              
              <div className="animate-slide-up opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards] flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
                <Link href="/login">
                  <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20 w-full sm:w-auto">
                    Start Issuing <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base w-full sm:w-auto bg-background/50 backdrop-blur-sm hover:bg-background/80">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative glowing orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-30 mix-blend-screen" />
        </section>

        {/* Features Section */}
        <section id="features" className="container space-y-12 py-12 md:py-24 lg:py-32 px-4 md:px-6 mx-auto">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold">
              Why Choose <span className="text-primary">CertPlatform</span>?
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Enterprise-grade features packed into a beautiful, easy-to-use interface.
            </p>
          </div>
          
          <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-[1200px]">
            {[
              {
                icon: ShieldCheck,
                title: "Tamper-Proof Verification",
                desc: "Instantly verify authenticity with our cryptographic signatures. Impossible to fake."
              },
              {
                icon: Database,
                title: "Secure Cloud Vault",
                desc: "Your data is encrypted at rest and in transit using military-grade standards."
              },
              {
                icon: Globe,
                title: "Universal Access",
                desc: "Access your credentials from anywhere, anytime. Fully compatible with all devices."
              },
            ].map((feature, i) => (
              <Card key={i} className="group relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="container py-12 md:py-24 px-4 mx-auto">
           <div className="relative rounded-3xl border border-white/10 bg-linear-to-b from-primary/10 to-background overflow-hidden px-6 py-24 text-center sm:px-12">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6 font-heading">
                Ready to digitize your credentials?
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-10">
                Join thousands of organizations using CertPlatform to build trust and efficiency.
              </p>
              <Link href="/register">
                <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-xl shadow-primary/30">
                  Get Started for Free
                </Button>
              </Link>
           </div>
        </section>
      </main>
      
      <footer className="border-t border-border/40 py-6 md:py-0 bg-background/50 backdrop-blur-lg">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 mx-auto">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 CertPlatform. All rights reserved. Built with precision.
          </p>
          <div className="flex gap-4">
             <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
             <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
