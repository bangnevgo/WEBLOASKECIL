# Command Center — Dashboard Operasi Dua Channel (LOAS Free Materi + Cohort)

**Tujuan:** Satu dashboard bagi admin (Bang Nevgo) untuk mengoperasikan & memantau dua channel sekaligus:
- **LOAS (Free Materi / Top-of-Funnel)** → `loas.nevgoinstitute.com`
- **Cohort (Paid / Conversion)** → `cohort.nevgoinstitute.com`

Metrik yang diminta: **Revenue, Batch, GA4, Alumni, Kesehatan Web**, + atribusi lead per sumber (TikTok).

---

## 1. Stack & Arsitektur

| Layer | LOAS | Cohort |
|---|---|---|
| Framework | Next.js 16 + React 19 + TS | Next.js 16 + React 19 + TS |
| DB | Prisma + PostgreSQL | Prisma + PostgreSQL |
| ORM client | `@/lib/db` (`PrismaClient`) | `@/lib/db` (`PrismaClient`) |
| Auth admin | — (tidak ada dashboard admin) | Password cookie `nv_admin` (`lib/admin-auth.ts`) |
| Deploy | `git push origin main` → Vercel auto-deploy | `vercel --prod --yes` (via CLI, tanpa git remote) |
| GA4 | Property `469650688` (satu property, **sudah melacak dua domain**) — API via service account | — (reuse GA4 LOAS) |

**Letak dashboard:** section baru **"Command Center"** di dalam cohort `/admin` (sudah password-gated, punya DB revenue/batch/member). Tidak bikin halaman/auth baru.

**Pola agregasi (hindari CORS & auth eksternal):**
```
Browser (cohort /admin)
   └─ GET /api/admin/metrics  (cohort, butuh cookie admin)
         ├─ Prisma: Transaction, User (revenue, batch, alumni, abandoned)
         ├─ fetch server-side → loas /api/leads/stats      (lead LOAS per sumber)
         ├─ fetch server-side → loas /api/analytics/ga4     (traffic, 1 property = 2 domain)
         ├─ fetch server-side → loas /api/analytics/gsc      (top queries SEO)
         └─ fetch server-side → ping loas.nevgo + cohort.nevgo (web health)
```
Semua upstream dijalankan paralel (`Promise.all`) dengan timeout + *graceful degrade* (sumber gagal → tampil "—").

---

## 2. Backend — LOAS (perubahan + deploy git→Vercel)

### 2.1 Schema (`prisma/schema.prisma`) — TAMBAH model `Lead`
```prisma
/// Free-material lead capture (LOAS landing). Forwarded to Google Sheet +
/// Telegram by /api/lead/register; also persisted here so the command
/// center can report volume + attribution (source: landing | tiktok | ...).
model Lead {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String
  source    String   @default("landing") // landing | tiktok | ...
  createdAt DateTime @default(now())

  @@index([source])
  @@index([createdAt])
}
```

### 2.2 `src/app/api/lead/register/route.ts` — MODIFIKASI
- Terima field `source` dari body; fallback: `?utm_source` (query) → `referer` header → default `"landing"`.
- **Simpan ke DB:** `await db.lead.create({ data: { name, email, phone, source } })`.
- **Tetap** kirim ke Google Sheet (tambah field `source` di payload) + Telegram (tambah baris `🌐 *Sumber:* ${source}` di pesan).
- Validasi & response tetap sama (backward-compatible dengan form frontend yang sudah ada).

### 2.3 `src/app/api/leads/stats/route.ts` — BARU (public GET)
Mengembalikan agregat lead (tanpa PII), agar cohort bisa fetch:
```ts
// GET /api/leads/stats
{
  total: number,
  thisMonth: number,
  lastMonth: number,
  bySource: { landing: number, tiktok: number, ... }
}
```
Query: `db.lead.groupBy({ by: ['source'], _count: true })` + count `createdAt` dalam bulan ini/ lalu.
> Catatan keamanan: endpoint publik hanya mengembalikan **count**, tidak ada email/nama/phone.

### 2.4 Migrasi & Deploy LOAS
```bash
bun run db:push          # prisma db push (DATABASE_URL ada di .env lokal + Vercel)
git add -A && git commit -m "feat: persist LOAS leads + stats endpoint"
git push origin main       # Vercel auto-deploy
```

---

## 3. Backend — Cohort (perubahan + deploy vercel CLI)

### 3.1 `src/app/api/admin/metrics/route.ts` — BARU (admin-gated)
Reuse helper `requireAdmin(req)` (sudah diperbaiki: mengembalikan `Response|null`, bukan throw).
```ts
// GET /api/admin/metrics  (butuh cookie nv_admin)
{
  revenue:   { total, thisMonth, byProgram: { COHORT, PRIVATE } },
  batch:     [{ name, total, active }],
  members:   { total, active, byProgram, conversionRate },
  abandoned: number,                                  // isActive=false
  loasLeads: { total, thisMonth, bySource },         // fetch LOAS /api/leads/stats
  ga4:       { activeUsers, pageViews, topPages },     // fetch LOAS /api/analytics/ga4
  gsc:       { topQueries },                          // fetch LOAS /api/analytics/gsc
  health:     { loas: {status,ms}, cohort: {status,ms}, sitemap, robots }
}
```

**Sumber data:**
- **Revenue:** `db.transaction.findMany({ where: { status: { in: ['settlement','capture'] } } })` → Σ `amount`. Bulan ini filter `createdAt`. Per program via `groupBy`.
- **Batch:** `db.user.groupBy({ by: ['batchName'], _count: true })` + hitung `isActive` per batch.
- **Members/Alumni:** `db.user.count({ where: { isActive: true } })`, per `program`; `conversionRate = active / totalRegistered`.
- **Abandoned:** `db.user.count({ where: { isActive: false } })` (sama dgn logika `/api/admin/recover`).
- **LOAS leads / GA4 / GSC:** `fetch('https://loas.nevgoinstitute.com/api/...')` server-side.
- **Web health:** `fetch` root, `/sitemap.xml`, `/robots.txt` kedua domain dengan `AbortController` timeout ~5s; catat status + ms.

Semua di `Promise.allSettled` agar satu sumber gagal tidak membatalkan lainnya.

---

## 4. Frontend — Cohort `/admin/page.tsx`

Tambah section **"Command Center"** (letak di atas, sebelum "Pendaftar Belum Melunasi" & "Daftar Pengguna"):

| Card | Isi |
|---|---|
| **Revenue** | Total IDR, bulan ini, breakdown COHORT vs PRIVATE |
| **Batch** | List batch + jumlah member + yang aktif |
| **Alumni / Member** | Total terdaftar, aktif, % konversi bayar |
| **Free Materi LOAS** | Total lead, lead bulan ini, **by source** (TikTok vs Landing) |
| **Traffic (GA4)** | Active users, page views, top pages (1 property = 2 domain) |
| **SEO (GSC)** | Top search queries |
| **Web Health** | Status + latency loas & cohort, sitemap/robots OK |
| **Funnel** | Leads LOAS → Paid Cohort, dengan % konversi |

**Data flow:** client fetch `GET /api/admin/metrics` (sudah bawa cookie admin) → render kartu. Loading state + fallback "—" per kartu yang gagal.

Reuse class Tailwind yang sudah dipakai di halaman admin (`rounded border bg-white p-4 shadow-sm`, `bg-amber-100` dsb.) agar konsisten.

---

## 5. Alur Data End-to-End (TikTok → Conversion)

```
[TikTok Bio: ?utm_source=tiktok]
        │
        ▼
[LOAS Free Materi] ──POST /api/lead/register (source=tiktok)
        │        ├─ db.lead.create (ATRIBUSI)
        │        ├─ Google Sheet
        │        └─ Telegram "Lead Baru Akses Loas" + 🌐 Sumber: tiktok
        │
        ▼  (user klik CTA Cohort)
[Cohort Signup + Payment] ── Transaction settlement
        │
        ▼
[Command Center /admin]
   ├─ Revenue (cohort DB)
   ├─ Free Materi LOAS leads by source=tiktok (LOAS DB)
   ├─ GA4 (1 property, 2 domain)
   ├─ GSC top queries
   └─ Web health (2 domain)
```

---

## 6. Verifikasi

1. **LOAS**
   - `curl https://loas.nevgoinstitute.com/api/leads/stats` → JSON agregat.
   - Kirim test lead dgn `source=tiktok` → cek muncul di count `bySource.tiktok`.
2. **Cohort**
   - Login admin → buka `/admin` → section "Command Center" render semua kartu.
   - `curl -H "Cookie: nv_admin=..." https://cohort.nevgoinstitute.com/api/admin/metrics` → JSON lengkap.
   - Web-health menampilkan status `200` untuk kedua domain.
3. **Build**
   - `bun run build` (LOAS & Cohort) lolos tanpa error tipe.

---

## 7. Catatan & Asumsi
- **GA4 = satu property** (`469650688`) diasumsikan sudah melacak `loas.nevgoinstitute.com` & `cohort.nevgoinstitute.com`. Bila ternyata dua property berbeda, perlu setup API GA4 untuk cohort (di luar rencana ini).
- **Tidak ada perubahan schema Cohort** — semua metrik cohort dibaca dari tabel yang sudah ada (`Transaction`, `User`).
- **LOAS `.env` lokal ada** → `prisma db push` bisa dijalankan dari lokal.
- Endpoint `/api/leads/stats` publik hanya mengembalikan **count** (aman, tanpa PII).
- Reuse helper `requireAdmin` (sudah diperbaiki di sesi sebelumnya: melempar `Response` → 500; sekarang mengembalikan `Response|null`).

---

## 8. Checklist Implementasi
- [ ] LOAS: tambah model `Lead` di schema
- [ ] LOAS: modifikasi `/api/lead/register` (simpan + source + Telegram/Sheet)
- [ ] LOAS: baru `/api/leads/stats`
- [ ] LOAS: `prisma db push` + commit + push (deploy)
- [ ] Cohort: baru `/api/admin/metrics`
- [ ] Cohort: section "Command Center" di `/admin/page.tsx`
- [ ] Cohort: `bun run build` + `vercel --prod --yes`
- [ ] Verifikasi live (LOAS stats + cohort metrics + render dashboard)
