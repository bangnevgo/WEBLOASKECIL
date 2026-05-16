import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neville Goddard — Hukum Asumsi | Kurikulum Lengkap",
  description: "Kurikulum lengkap ajaran Neville Goddard: 10 bagian, 49 pelajaran, praktik harian, dan kutipan bersumber dari seluruh karyanya.",
  keywords: ["Neville Goddard", "Law of Assumption", "Hukum Asumsi", "Consciousness", "I AM", "Manifestation"],
  authors: [{ name: "Neville Goddard Curriculum" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Neville Goddard — Hukum Asumsi",
    description: "Kurikulum lengkap ajaran Neville Goddard",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
