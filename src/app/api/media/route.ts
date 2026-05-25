import { NextRequest, NextResponse } from "next/server"
import { signBunnyUrl } from "@/lib/bunny"
import { verifySession } from "@/lib/session"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const file = searchParams.get("file")

    if (!type || !file) {
      return NextResponse.json(
        { error: "Parameter type dan file diperlukan" },
        { status: 400 }
      )
    }

    if (type !== "audio" && type !== "pdf" && type !== "video") {
      return NextResponse.json(
        { error: "Tipe media tidak valid" },
        { status: 400 }
      )
    }

    const cdnUrl = process.env.BUNNY_CDN_URL
    const securityKey = process.env.BUNNY_SECURITY_KEY

    if (!cdnUrl || !securityKey) {
      console.error("Bunny.net credentials are not configured in .env")
      return NextResponse.json(
        { error: "Konfigurasi CDN server tidak lengkap" },
        { status: 500 }
      )
    }

    // Get session payload from cookie
    const sessionCookie = req.cookies.get("nv-session")?.value
    const session = verifySession(sessionCookie)
    const userTier = session?.tier || "free"

    let isAllowed = false

    // 1. Free PDF files (accessible to anyone)
    const freeFiles = [
      "iam-guide.pdf",
      "assumption-cheatsheet.pdf",
      "jurnal-harian.pdf",
      "daftar-bacaan.pdf",
      "dummy.pdf",
      "7 Hari Mencapai Kealamian Manifestasi.pdf",
      "Asumsimu Itu Dahsyat.pdf",
      "IMAJINASI MENCIPTAKAN REALITAS.pdf",
      "Somatic Zero - Jalur Cepat Menuju Manifestasi Impian.pdf"
    ]

    if (freeFiles.includes(file)) {
      isAllowed = true
    } else {
      // 2. Gated Premium files
      const hasBasicAccess = userTier === "basic" || userTier === "premium" || userTier === "master"
      const hasPremiumAccess = userTier === "premium" || userTier === "master"

      if (type === "pdf") {
        // VIP Workbook or specialized guides require Premium/Master
        const isVipPdf = file.includes("workbook") || file.includes("pdf-2")
        isAllowed = isVipPdf ? hasPremiumAccess : hasBasicAccess
      } else if (type === "audio") {
        // Audio meditations access rules
        const basicAudios = [
          "sats-meditation.mp3",
          "visualisasi-kesehatan.mp3",
          "theta_sats.mp3",
          "audio-1"
        ]
        const isBasicAudio = basicAudios.includes(file) || file.includes("sats") || file.includes("kesehatan")
        isAllowed = isBasicAudio ? hasBasicAccess : hasPremiumAccess
      } else if (type === "video") {
        // All video webinars and Tiktok recordings require Premium/Master access
        isAllowed = hasPremiumAccess
      }
    }

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Akses ditolak. Silakan upgrade tier keanggotaan Anda untuk mengakses file ini." },
        { status: 403 }
      )
    }

    // Specific file path overrides relative to CDN root (bypasses folder prefixing)
    const cdnFilePaths: Record<string, string> = {
      "7 Hari Mencapai Kealamian Manifestasi.pdf": "File-file%20PDF/PDF%20FILE%20BOOTCAMP/7%20Hari%20Mencapai%20Kealamian%20Manifestasi.pdf",
      "Asumsimu Itu Dahsyat.pdf": "File-file%20PDF/PDF%20FILE%20BOOTCAMP/Asumsimu%20Itu%20Dahsyat.pdf",
      "IMAJINASI MENCIPTAKAN REALITAS.pdf": "File-file%20PDF/PDF%20FILE%20BOOTCAMP/IMAJINASI%20MENCIPTAKAN%20REALITAS.pdf",
      "Somatic Zero - Jalur Cepat Menuju Manifestasi Impian.pdf": "File-file%20PDF/PDF%20FILE%20BOOTCAMP/Somatic%20Zero%20-%20Jalur%20Cepat%20Menuju%20Manifestasi%20Impian.pdf",
      "EMOSI NEGATIF.pdf": "EMOSI%20NEGATIF.pdf",
      "workbook-manifestasi-digital-30hari.html": "workbook-manifestasi-digital-30hari.html"
    }

    let targetUrl = ""
    if (cdnFilePaths[file]) {
      targetUrl = `${cdnUrl}/${cdnFilePaths[file]}`
    } else {
      // Normalize legacy CDN path structure
      const folder = type === "audio" ? "audio/meditations" : type === "video" ? "videos" : "downloads"
      targetUrl = `${cdnUrl}/${folder}/${file}`
    }

    // Sign the URL with 5 minutes (300s) expiry
    const signedUrl = signBunnyUrl(targetUrl, securityKey, 300)

    // Redirect browser to stream the secured Bunny.net source
    return NextResponse.redirect(signedUrl)
  } catch (error) {
    console.error("Media Gating API error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat memproses media" },
      { status: 500 }
    )
  }
}
