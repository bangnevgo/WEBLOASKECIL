# WEBLOASKECIL — Web LOAS Institute

## Overview
Website LOAS (Law of Assumption) untuk NEVGO Institute. Platform coaching, materi, dan komunitas LOAS. Live di loas.nevgoinstitute.com.

## Tech Stack
- **Framework:** Next.js 16 + React 19 + TypeScript 5
- **UI:** Tailwind CSS 4 + shadcn/ui (Radix UI) + DnD Kit
- **ORM:** Prisma + SQLite
- **State:** Zustand + TanStack React Query
- **Runtime:** Bun

## How to Run
```bash
bun install
bun run db:push        # Push schema to SQLite
bun run db:generate    # Generate Prisma client
bun run dev            # Development (port 3000)
bun run build          # Production build (prisma generate + next build)
bun run start          # Start production server
```

## Deployment
- **Platform:** Vercel
- **URL:** https://loas.nevgoinstitute.com

## Development Notes
- Build script: `prisma generate && next build` (prisma di-build time)
- Deploy otomatis via Vercel git integration
- Source: `/Users/ding/projects/web-apps/WEBLOASKECIL/` (sebelumnya)

---

## 🌐 NEVGO GLOBAL AGENT RULES (WAJIB — semua agent, semua platform)

Sumber: `AGENTS.md` root workspace NEVGO BISNIS V4 (Aturan Kerja 15–16).

1. **Prinsip Read-First & Ask-First:** Jangan pernah membuat file, kode produk,
   atau struktur bab baru sebelum pengguna memberikan instruksi atau persetujuan
   tertulis.
2. **Aturan Grounding Ketat:** Jika file atau data spesifik tidak ditemukan di
   memori/database, langsung jawab "Data tidak ditemukan" dalam satu kalimat
   tanpa memberikan alternatif atau asumsi. Berlaku untuk pencarian file/data
   spesifik; klaim kapabilitas/sistem (audit & laporan formal) tetap ikut Aturan 5
   root AGENTS.md (*Verification Before Verdict*) dengan scope pemeriksaan.
