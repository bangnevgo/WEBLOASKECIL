import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/community.css";
import { Toaster } from "sonner";
import CookieConsent from "@/components/cookie-consent";
import Script from "next/script";

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
  description:
    "Pelajari Hukum Asumsi dari Neville Goddard melalui kurikulum terstruktur: 10 bagian, 49 pelajaran, praktik harian, dan kutipan bersumber dari seluruh karyanya. Mulai perjalanan manifestasi Anda sekarang.",
  keywords: [
    "Neville Goddard",
    "Law of Assumption",
    "Hukum Asumsi",
    "Consciousness",
    "I AM",
    "Manifestation",
    "Kesadaran",
    "Imajinasi",
    "SATS",
    "Manifestasi",
  ],
  authors: [{ name: "Neville Goddard Curriculum" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Neville Goddard — Hukum Asumsi",
    description:
      "Kurikulum lengkap ajaran Neville Goddard: 10 bagian, 49 pelajaran, praktik harian, dan kutipan bersumber. Mulai jelajahi kekuatan asumsi Anda.",
    type: "website",
    locale: "id_ID",
    siteName: "Hukum Asumsi — Neville Goddard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neville Goddard — Hukum Asumsi",
    description:
      "Kurikulum lengkap ajaran Neville Goddard: 10 bagian, 49 pelajaran, praktik harian, dan kutipan bersumber.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        <Script
          src="https://app.midtrans.com/snap/snap.js"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--nv-bg-2)",
              color: "var(--nv-text)",
              border: "1px solid var(--nv-glass-border)",
              borderRadius: "10px",
              fontSize: "14px",
            },
          }}
        />
        <CookieConsent />
      </body>
    </html>
  );
}
