import type { Metadata, Viewport } from "next";
import { Outfit, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/community.css";
import "@/styles/premium.css";
import { Toaster } from "sonner";
import CookieConsent from "@/components/cookie-consent";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://loas.nevgoinstitute.com"),
  title: "Neville Goddard — Hukum Asumsi | Kurikulum Lengkap",
  description:
    "Pelajari Hukum Asumsi dari Neville Goddard melalui kurikulum terstruktur: 10 bagian, 50 pelajaran, praktik harian, dan kutipan bersumber dari seluruh karyanya. Mulai perjalanan manifestasi Anda sekarang.",
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
  manifest: "/manifest.json",
  openGraph: {
    title: "Neville Goddard — Hukum Asumsi",
    description:
      "Kurikulum lengkap ajaran Neville Goddard: 10 bagian, 50 pelajaran, praktik harian, dan kutipan bersumber. Mulai jelajahi kekuatan asumsi Anda.",
    type: "website",
    locale: "id_ID",
    siteName: "Hukum Asumsi — Neville Goddard",
    url: "https://loas.nevgoinstitute.com",
    images: [
      {
        url: "/community-cover.png",
        width: 1200,
        height: 630,
        alt: "Neville Goddard - Hukum Asumsi",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neville Goddard — Hukum Asumsi",
    description:
      "Kurikulum lengkap ajaran Neville Goddard: 10 bagian, 50 pelajaran, praktik harian, dan kutipan bersumber.",
    images: ["/community-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://loas.nevgoinstitute.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Neville Goddard — Hukum Asumsi: Kurikulum Lengkap",
      description: "Pelajari Hukum Asumsi dari Neville Goddard melalui kurikulum terstruktur: 10 bagian, 50 pelajaran, praktik harian, dan kutipan bersumber dari seluruh karyanya.",
      url: "https://loas.nevgoinstitute.com",
      image: "https://loas.nevgoinstitute.com/community-cover.png",
      provider: {
        "@type": "Organization",
        name: "Nevgo Institute",
        url: "https://nevgoinstitute.com",
        sameAs: ["https://www.tiktok.com/@bangnevgo"]
      },
      educationalLevel: "Semua Level",
      inLanguage: ["id", "en"],
      isAccessibleForFree: true,
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT10H"
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
        description: "Daftar Free untuk mengakses materi pembelajaran lengkap.",
        availability: "https://schema.org/InStock",
        url: "https://loas.nevgoinstitute.com"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Apa itu Hukum Asumsi?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Hukum Asumsi adalah ajaran Neville Goddard yang menyatakan bahwa asumsi yang terus dipegang teguh akan menjadi kenyataan. Dengan mengasumsikan perasaan dari keinginan yang telah terwujud, seseorang dapat mengubah masa depannya."
          }
        },
        {
          "@type": "Question",
          name: "Apakah saya perlu latar belakang agama?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tidak. Hukum Asumsi adalah prinsip universal yang dapat dipraktikkan oleh siapa saja tanpa memandang latar belakang agama."
          }
        },
        {
          "@type": "Question",
          name: "Bagaimana teknik SATS bekerja?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SATS (State Akin To Sleep) adalah teknik di mana Anda memasuki kondisi kesadaran menjelang tidur dan memvisualisasikan keinginan Anda seolah sudah terwujud. Teknik ini dipercaya dapat memprogram alam bawah sadar."
          }
        },
        {
          "@type": "Question",
          name: "Apa perbedaan antara paket Basic, Premium, dan Master?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Paket Basic memberikan akses ke materi dasar. Premium mencakup semua 50 pelajaran dan praktik harian. Master termasuk sesi AI privat, meditasi audio, dan konsultasi personal."
          }
        },
        {
          "@type": "Question",
          name: "Apakah saya bisa membatalkan langganan?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ya, Anda dapat membatalkan langganan kapan saja tanpa denda."
          }
        },
        {
          "@type": "Question",
          name: "Dari mana sumber materi ini?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Semua materi bersumber langsung dari buku dan kuliah Neville Goddard, termasuk Five Lessons, The Power of Awareness, Feeling is the Secret, dan karya-karya lainnya."
          }
        }
      ]
    }
  ];

  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
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
        <Analytics />
        <SpeedInsights />

        {/* Structured Data */}
        {structuredData.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

        {/* Midtrans */}
        <Script
          src={process.env.MIDTRANS_IS_PRODUCTION === 'true'
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js"}
          strategy="afterInteractive"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <Script strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
