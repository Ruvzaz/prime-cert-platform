import type { Metadata } from "next";
import { Sarabun } from "next/font/google"; // Fallback for Anantason (Not on Google Fonts)
import "./globals.css";

const sarabun = Sarabun({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "Digital Certificate Platform",
  description: "Download your digital certificate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sarabun.variable} font-sans antialiased bg-slate-50`}>
        {children}
      </body>
    </html>
  );
}
