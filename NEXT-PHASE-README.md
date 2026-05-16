# 🚀 Phase Selanjutnya — Neville Goddard "Hukum Asumsi" Website

## 📋 Status Saat Ini (Phase 1 — COMPLETED)

### Yang Sudah Dibangun
| Fitur | Status | File Utama |
|---|---|---|
| Landing page (dark golden theme) | ✅ Selesai | `src/components/landing.tsx` |
| 3 pelajaran gratis (1.1, 1.2, 1.3) | ✅ Selesai | `src/components/free-lesson-page.tsx` |
| Locked lesson modal (paywall preview) | ✅ Selesai | `src/components/locked-lesson-modal.tsx` |
| Pricing page (3 tier: Penggemar/Pelajar/Master) | ✅ Selesai | `src/components/pricing.tsx` |
| Dashboard (setelah subscribe) | ✅ Selesai | `src/components/dashboard.tsx` |
| Lesson detail page (49 pelajaran) | ✅ Selesai | `src/components/lesson-detail.tsx` |
| Zustand state management | ✅ Selesai | `src/lib/store.ts` |
| Kurikulum data (10 bagian, 49 pelajaran) | ✅ Selesai | `src/lib/curriculum-data.ts` |
| Ilustrasi & foto Neville | ✅ Selesai | `public/images/` |
| Responsive design + dark mode | ✅ Selesai | `src/app/globals.css` |

### Arsitektur Saat Ini
- **Auth**: Simulasi (Zustand store, tanpa database) — user input nama langsung subscribe
- **Payment**: Belum ada payment gateway (simulasi saja)
- **Konten**: Semua 49 pelajaran hardcode di `curriculum-data.ts`
- **Media**: Belum ada PDF, MP3, atau video
- **Database**: Prisma + SQLite tersedia tapi belum digunakan untuk fitur utama

---

## 🏗️ Phase 2 — Halaman Berbayar + Media + Fitur Premium

### 2.1 Sistem Autentikasi yang Nyata

**Tujuan**: Ganti simulasi auth dengan sistem login/register yang sesungguhnya.

**Tasks**:
- [ ] Setup NextAuth.js v4 (sudah di `package.json`) dengan credential provider
- [ ] Update Prisma schema: tambah model `Account`, `Session`, `VerificationToken` (NextAuth required)
- [ ] Buat halaman login/register dengan UI yang sesuai tema
- [ ] API routes: `/api/auth/[...nextauth].ts`, `/api/auth/register.ts`
- [ ] Middleware: protect `/dashboard` dan `/lesson` routes
- [ ] Update store: integrate NextAuth session state

**Schema Update**:
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String
  tier          String    @default("free") // "free" | "scholar" | "master"
  stripeCustomerId String?
  subscribedAt  DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
  downloads     Download[]
  completions   Completion[]
}

model Account {
  // NextAuth required model
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```

---

### 2.2 Payment Gateway (Stripe)

**Tujuan**: Integrasi Stripe untuk subscription berbayar.

**Tasks**:
- [ ] Install `stripe` dan `@stripe/stripe-js`
- [ ] Buat Stripe products: "Pelajar" ($9/bulan) dan "Master" ($27/bulan)
- [ ] API routes:
  - `POST /api/checkout/create-session.ts` — create Stripe checkout session
  - `POST /api/checkout/webhook.ts` — handle Stripe webhook (checkout.session.completed, customer.subscription.deleted, etc.)
  - `GET /api/checkout/status.ts` — check subscription status
- [ ] Update pricing page: CTA button redirect ke Stripe Checkout
- [ ] Success/cancel page setelah pembayaran
- [ ] Customer portal untuk manage/cancel subscription

**Environment Variables Needed**:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SCHOLAR_PRICE_ID=price_...
STRIPE_MASTER_PRICE_ID=price_...
```

---

### 2.3 Halaman Pelajaran Berbayar (Premium Lesson Page)

**Tujuan**: Redesign lesson detail page agar setara kualitas free lesson page (sacred scroll design).

**Tasks**:
- [ ] Buat `PremiumLessonPage` component — mirip `FreeLessonPage` tapi dengan fitur tambahan:
  - Audio player untuk meditasi panduan
  - PDF download link
  - Progress tracking (simpan ke database)
  - Navigation prev/next
  - Sidebar daftar pelajaran di bagian yang sama
- [ ] Update `LessonDetail` component yang sudah ada atau ganti dengan `PremiumLessonPage`
- [ ] API route `POST /api/progress/complete.ts` — tandai pelajaran selesai (save ke DB)
- [ ] API route `GET /api/progress/status.ts` — get progress user

**Schema Update**:
```prisma
model Completion {
  id        String   @id @default(cuid())
  userId    String
  lessonNum String   // "1.1", "2.3", etc.
  completedAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonNum])
}
```

---

### 2.4 PDF Gratis untuk Download

**Tujuan**: Sediakan PDF gratis yang bisa di-download oleh siapa saja (teaser + value).

**Daftar PDF yang Akan Disediakan**:
1. **"I AM: Pintu Menuju Segala Kemungkinan"** — Ringkasan visual dari Pelajaran 1.1-1.3 (pdf, ~5 halaman)
2. **"Cheat Sheet Hukum Asumsi"** — Satu halaman infografis ringkasan 5 prinsip utama
3. **"Jurnal Harian Neville Goddard"** — Template jurnal SATS yang bisa di-print (pdf, ~10 halaman)
4. **"Daftar Bacaan Esensial"** — Guide membaca 15+ buku Neville secara terstruktur

**Tasks**:
- [ ] Generate/create PDF files (gunakan AI atau design tool)
- [ ] Simpan PDF di `public/downloads/` folder
- [ ] Buat section "Unduhan Gratis" di landing page (setelah marquee, sebelum kurikulum)
- [ ] Component `FreeDownloadsSection` — card grid dengan preview, judul, deskripsi, tombol download
- [ ] API route `GET /api/downloads/[filename].ts` — serve file dengan tracking download count
- [ ] Untuk non-subscriber: email gate (masukkan email untuk download) — optional
- [ ] Untuk subscriber (Pelajar/Master): download langsung tanpa gate

**Schema Update**:
```prisma
model Download {
  id        String   @id @default(cuid())
  userId    String?
  email     String?  // for non-registered downloaders
  fileKey   String   // "iam-guide", "assumption-cheatsheet", etc.
  downloadedAt DateTime @default(now())
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
}
```

**UI Design untuk Download Section**:
```
┌──────────────────────────────────────────────────┐
│  ✦ Unduhan Gratis                                │
│  Sumber daya gratis untuk memulai perjalanan Anda │
│                                                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────┐│
│  │ 📄      │  │ 📄      │  │ 📄      │  │ 📄   ││
│  │ I AM    │  │ Cheat   │  │ Jurnal  │  │ Baca ││
│  │ Guide   │  │ Sheet   │  │ Harian  │  │ an   ││
│  │         │  │         │  │         │  │      ││
│  │[Download]│  │[Download]│  │[Download]│  │[Down]││
│  └─────────┘  └─────────┘  └─────────┘  └──────┘│
└──────────────────────────────────────────────────┘
```

---

### 2.5 Rekaman MP3 Meditasi Panduan

**Tujuan**: Sediakan audio meditasi panduan berdasarkan teknik Neville (SATS, revisi, afirmasi).

**Daftar MP3 yang Akan Disediakan**:
1. **"Meditasi SATS: Masuk ke Kondisi Mengantuk"** (15 menit) — Panduan audio untuk masuk ke State Akin To Sleep
2. **"Adegan Imajinasi: Kesehatan Sempurna"** (10 menit) — Loop adegan visualisasi kesehatan
3. **"Adegan Imajinasi: Kemakmuran"** (10 menit) — Loop adegan visualisasi kekayaan
4. **"Revisi Malam: Menulis Ulang Hari Anda"** (12 menit) — Panduan revisi sebelum tidur
5. **"Afirmasi I AM: Pengulangan Mendalam"** (20 menit) — Loop afirmasi I AM dengan jeda
6. **"Meditasi Gratitude: Merasa Seolah Sudah Terwujud"** (10 menit)

**Akses**:
- Tier **Pelajar** ($9/bln): 2 meditasi pertama
- Tier **Master** ($27/bln): Semua 6 meditasi

**Tasks**:
- [ ] Buat/generate audio meditasi MP3 (gunakan TTS skill + background ambient music)
- [ ] Simpan MP3 di `public/audio/meditations/` atau gunakan cloud storage (R2/S3)
- [ ] Buat in-app audio player component (`AudioPlayer.tsx`)
  - Play/pause, seek bar, volume control
  - Background play support
  - Waveform visualisasi (optional)
- [ ] Section "Meditasi Panduan" di dashboard
- [ ] API route `GET /api/audio/[slug].ts` — serve audio dengan akses kontrol
- [ ] Gated access: cek tier user sebelum serve audio file

**Component Design**:
```
┌──────────────────────────────────────────────┐
│  🎧 Meditasi Panduan                         │
│                                                │
│  ┌────────────────────────────────────────┐  │
│  │ ▶ Meditasi SATS          15:00        │  │
│  │   ═══════════●───────────             │  │
│  │   🔊 ═══════●────                      │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ ▶ Visualisasi Kemakmuran   10:00      │  │
│  │   ═══════════●───────────             │  │
│  └────────────────────────────────────────┘  │
│  ...                                          │
│  🔒 4 meditasi lagi — Upgrade ke Master     │
└──────────────────────────────────────────────┘
```

---

### 2.6 Rekaman Webinar

**Tujuan**: Sediakan rekaman webinar/workshop tentang ajaran Neville.

**Daftar Webinar yang Direncanakan**:
1. **"Memulai Perjalanan: Fondasi Ajaran Neville"** (60 menit) — Workshop untuk pemula
2. **"SATS Masterclass: Teknik Lanjutan"** (90 menit) — Deep dive ke SATS
3. **"Revisi: Mengubah Masa Lalu untuk Mengubah Masa Depan"** (45 menit)
4. **"Imajinasi Menciptakan Realitas: Studi Kasus"** (60 menit)
5. **"Tanya Jawab: Masalah dan Solusi dalam Praktik"** (45 menit)

**Akses**: Khusus tier **Master** ($27/bln)

**Tasks**:
- [ ] Rekod/generate webinar content (video + slide)
- [ ] Upload ke platform video (Vimeo/Bunny.net) atau simpan di cloud storage
- [ ] Buat section "Webinar" di dashboard (Master tier only)
- [ ] Video player component dengan chapter markers
- [ ] API route untuk serve video URL dengan token akses terbatas
- [ ] Thumbnail & deskripsi untuk setiap webinar

**Component Design**:
```
┌──────────────────────────────────────────────────┐
│  🎥 Rekaman Webinar — Khusus Master             │
│                                                    │
│  ┌────────────────┐  Memulai Perjalanan           │
│  │                │  Fondasi Ajaran Neville        │
│  │   ▶ Video     │  60 menit · 10 chapter         │
│  │   Thumbnail   │                                │
│  │                │  [Tonton Sekarang]             │
│  └────────────────┘                               │
│                                                    │
│  ┌────────────────┐  SATS Masterclass             │
│  │                │  Teknik Lanjutan               │
│  │   ▶ Video     │  90 menit · 15 chapter         │
│  └────────────────┘                               │
│  ...                                               │
└──────────────────────────────────────────────────┘
```

---

### 2.7 Update Pricing Page — Fitur Baru

**Tujuan**: Update tier pricing agar mencerminkan semua fitur baru.

**Tier Update**:

| Feature | Penggemar (Gratis) | Pelajar ($9/bln) | Master ($27/bln) |
|---|---|---|---|
| 3 pelajaran pertama | ✅ | ✅ | ✅ |
| Semua 49 pelajaran | ❌ | ✅ | ✅ |
| Konten lengkap & kutipan | ❌ | ✅ | ✅ |
| Praktik harian | ❌ | ✅ | ✅ |
| PDF gratis (4 file) | ✅ | ✅ | ✅ |
| Meditasi MP3 (2 basic) | ❌ | ✅ | ✅ |
| Meditasi MP3 (6 lengkap) | ❌ | ❌ | ✅ |
| Rekaman webinar (5 sesi) | ❌ | ❌ | ✅ |
| Jurnal praktik harian | ❌ | ✅ | ✅ |
| Akses komunitas privat | ❌ | ❌ | ✅ |
| Pembaruan materi baru | ❌ | ✅ | ✅ |
| Prioritas dukungan | ❌ | ❌ | ✅ |

**Tasks**:
- [ ] Update `TIERS` array di `pricing.tsx` dengan fitur baru
- [ ] Tambah ikon/visual per feature
- [ ] Highlight "BARU!" badge pada fitur yang baru ditambahkan
- [ ] Update locked lesson modal copy untuk mention PDF & audio

---

### 2.8 Update Landing Page

**Tujuan**: Tambah section untuk fitur baru di landing page.

**Tasks**:
- [ ] Tambah section "Unduhan Gratis" (PDF cards) — antara marquee dan kurikulum
- [ ] Tambah section "Meditasi Panduan" preview — card dengan audio preview snippet
- [ ] Tambah section "Webinar" preview — card dengan video thumbnail
- [ ] Update hero meta: tambah "4 PDF GRATIS" dan "6 Meditasi Audio"
- [ ] Update bonus section: tambah referensi ke PDF dan audio

---

## 🚀 Phase 3 — Deploy ke Production

### 3.1 Persiapan Deployment

**Platform yang Direkomendasikan**: Vercel (native Next.js support)

**Tasks**:
- [ ] Setup Vercel project
- [ ] Configure environment variables:
  ```
  DATABASE_URL=           # Production PostgreSQL/MySQL
  NEXTAUTH_SECRET=        # Random secret
  NEXTAUTH_URL=           # https://yourdomain.com
  STRIPE_SECRET_KEY=      # Live key
  STRIPE_PUBLISHABLE_KEY= # Live key
  STRIPE_WEBHOOK_SECRET=  # Webhook secret
  STRIPE_SCHOLAR_PRICE_ID=# Live price ID
  STRIPE_MASTER_PRICE_ID= # Live price ID
  ```
- [ ] Migrate dari SQLite ke PostgreSQL (untuk production)
  - Update `prisma/schema.prisma` provider ke `postgresql`
  - Setup database (Vercel Postgres / Supabase / Neon)
  - Run `prisma migrate deploy`
- [ ] Setup Stripe webhook endpoint di dashboard Stripe
- [ ] Configure custom domain
- [ ] Setup SSL (otomatis di Vercel)

### 3.2 Media Storage

**Opsi**:
1. **Vercel Blob** — Paling mudah, integrasi native
2. **Cloudflare R2** — Murah, tanpa egress fee
3. **AWS S3** — Standar industri

**Tasks**:
- [ ] Pilih storage provider
- [ ] Upload PDF files ke storage
- [ ] Upload MP3 files ke storage
- [ ] Upload video webinar ke storage atau Vimeo/Bunny.net
- [ ] Update API routes untuk serve dari cloud storage
- [ ] Setup signed URLs untuk konten premium

### 3.3 Performance & SEO

**Tasks**:
- [ ] Optimize gambar: convert semua ke WebP, gunakan Next.js Image optimization
- [ ] Setup ISR (Incremental Static Regeneration) untuk halaman kurikulum
- [ ] Tambah metadata: title, description, OG image per halaman
- [ ] Sitemap.xml dan robots.txt
- [ ] Google Analytics / Vercel Analytics
- [ ] Lighthouse audit — target 90+ untuk semua kategori

### 3.4 Security

**Tasks**:
- [ ] Rate limiting pada API routes
- [ ] CSRF protection (NextAuth built-in)
- [ ] Input validation dengan Zod
- [ ] Content security: signed URLs untuk media premium
- [ ] Stripe webhook signature verification
- [ ] HTTPS enforcement

### 3.5 Monitoring & Maintenance

**Tasks**:
- [ ] Error tracking: Sentry
- [ ] Uptime monitoring: Vercel built-in
- [ ] Log subscription events
- [ ] Email notification: welcome email, payment confirmation
- [ ] Setup cron job untuk expired subscription cleanup

---

## 📂 Struktur File yang Akan Ditambahkan

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts     # NextAuth handler
│   │   │   └── register/route.ts          # User registration
│   │   ├── checkout/
│   │   │   ├── create-session/route.ts    # Stripe checkout
│   │   │   ├── webhook/route.ts           # Stripe webhook
│   │   │   └── status/route.ts            # Check subscription
│   │   ├── downloads/
│   │   │   └── [fileKey]/route.ts         # PDF download + tracking
│   │   ├── audio/
│   │   │   └── [slug]/route.ts            # MP3 serve + access control
│   │   └── progress/
│   │       ├── complete/route.ts           # Mark lesson complete
│   │       └── status/route.ts             # Get user progress
│   └── auth/
│       ├── login/page.tsx                  # Login page
│       └── register/page.tsx               # Register page
├── components/
│   ├── free-downloads-section.tsx          # PDF download cards
│   ├── audio-player.tsx                    # In-app audio player
│   ├── video-player.tsx                    # Webinar video player
│   ├── meditation-section.tsx              # Meditasi preview
│   ├── webinar-section.tsx                 # Webinar preview
│   └── premium-lesson-page.tsx             # Premium lesson redesign
├── lib/
│   ├── auth.ts                             # NextAuth config
│   ├── stripe.ts                           # Stripe helper
│   └── storage.ts                          # Cloud storage helper
public/
├── downloads/
│   ├── iam-guide.pdf
│   ├── assumption-cheatsheet.pdf
│   ├── jurnal-harian.pdf
│   └── daftar-bacaan.pdf
├── audio/
│   └── meditations/
│       ├── sats-meditation.mp3
│       ├── visualisasi-kesehatan.mp3
│       ├── visualisasi-kemakmuran.mp3
│       ├── revisi-malam.mp3
│       ├── afirmasi-iam.mp3
│       └── meditasi-gratitude.mp3
```

---

## 🎯 Prioritas Pengerjaan

### Sprint 1 (Minggu 1) — Core Infrastructure
1. **Auth**: NextAuth + Prisma user model + login/register pages
2. **Payment**: Stripe integration + webhook
3. **Update Pricing**: Fitur baru di pricing page

### Sprint 2 (Minggu 2) — Konten & Media
4. **PDF Gratis**: Generate PDF, download section di landing page
5. **Meditasi MP3**: Generate audio, audio player, meditation section
6. **Premium Lesson Page**: Redesign lesson detail

### Sprint 3 (Minggu 3) — Webinar & Polish
7. **Webinar**: Video content, video player, gated access
8. **Landing Page Update**: Semua section baru
9. **Dashboard Update**: Tabs untuk Lessons / Meditasi / Webinar

### Sprint 4 (Minggu 4) — Deploy
10. **Database Migration**: SQLite → PostgreSQL
11. **Cloud Storage**: Setup & upload semua media
12. **Deploy**: Vercel + custom domain + SSL
13. **Testing**: End-to-end flow testing
14. **Go Live!** 🎉

---

## 💰 Proyeksi Pendapatan

| Metrik | Bulan 1 | Bulan 3 | Bulan 6 | Bulan 12 |
|---|---|---|---|---|
| Pengunjung | 500 | 2,000 | 5,000 | 15,000 |
| Free signup | 50 | 200 | 500 | 1,500 |
| Pelajar ($9) | 5 | 25 | 80 | 200 |
| Master ($27) | 2 | 8 | 25 | 60 |
| **MRR** | **$99** | **$429** | **$1,395** | **$3,420** |

---

*Dokumen ini dibuat sebagai panduan phase selanjutnya. Update status checklist seiring progress.*
