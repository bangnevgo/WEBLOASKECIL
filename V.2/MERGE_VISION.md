# Strategi Penggabungan V1 → V.2

> **V.2 sebagai Rumah, V1 sebagai Konten**
>
> V.2 adalah platform Learning Management System (LMS) yang utuh.
> V1 adalah fitur yang sudah berjalan dan akan diwariskan ke dalam V.2.

---

## 1. Filosofi Penggabungan

V1 lahir lebih dulu sebagai aplikasi mandiri dengan fitur-fitur inti: activation codes, AI chat, payment, admin panel, dan konten pembelajaran. V.2 hadir sebagai platform yang lebih besar — LMS lengkap dengan courses, forum, live classes, subscription, AI tutor, dan dashboard user.

Strateginya bukan "migrasi total" melainkan **integrasi bertahap**: memindahkan fitur V1 yang sudah matang ke dalam arsitektur V.2 tanpa mengubah logika bisnisnya.

---

## 2. Perbandingan Arsitektur

| Aspek | V1 (Sumber) | V.2 (Tujuan) |
|---|---|---|
| **Framework** | Next.js (app dir) | Next.js 16 + React 19 |
| **ORM / DB** | Prisma (SQLite atau PostgreSQL) | Supabase PostgreSQL + RLS |
| **Auth** | Zustand state + cookie sederhana | JWT (jose) + Supabase SSR |
| **Payment** | Midtrans (manual webhook) | Midtrans + Stripe |
| **AI** | ZAI SDK (NVIDIA Nemotron) | AI Tutor + Rekomendasi |
| **Admin** | Modal password (admin123) | Dashboard admin terpisah |
| **Komponen** | shadcn/ui + custom | shadcn/ui + custom |
| **State** | Zustand | Zustand + SWR + TanStack Query |
| **CMS** | — (hardcoded data) | Sanity CMS |
| **Real-time** | — | Socket.io |

---

## 3. Peta Fitur: V1 → V.2

### A. Yang Langsung Diwariskan (Copy → Adapt)

Fitur V1 ini sudah matang dan akan dipindahkan ke struktur V.2:

| Fitur V1 | Lokasi V1 | Tujuan di V.2 | Catatan |
|---|---|---|---|
| **Activation Codes** | `src/app/api/activation/` | `V.2/app/api/activation/` | Logic tetap, endpoint disesuaikan dengan auth V.2 |
| **Admin Panel** | `src/components/admin-panel.tsx` | `V.2/components/admin/` | Di-refactor jadi halaman dashboard admin |
| **AI Chat (4 mode)** | `src/app/api/ai/route.ts` | `V.2/app/api/ai/` + komponen | Integrasi dengan AI Tutor V.2 yang sudah ada |
| **Payment Activation** | `src/app/api/payment/` | `V.2/app/api/payment/` | Midtrans webhook logic tetap, ditambahkan ke payment V.2 |
| **Community Page** | `src/app/community/` | `V.2/app/community/` | Integrasi dengan forum V.2 |
| **Konten Kurikulum** | `src/lib/curriculum-data.ts` | `V.2/lib/data/` | Bisa jadi seed data untuk Sanity CMS |
| **AI Prompts** | `src/lib/ai-prompts.ts` | `V.2/lib/ai/prompts.ts` | Prompt library dipakai bersama |
| **Zustand Store** | `src/lib/store.ts` | `V.2/lib/store/` | State management global |

### B. Prisma → Supabase (Data Migration)

V1 punya tabel `ActivationCode` di Prisma. Di V.2 perlu dibuat ulang di Supabase:

```sql
-- Migration dari Prisma ke Supabase
CREATE TABLE activation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('pelajar', 'master')),
  used BOOLEAN DEFAULT FALSE,
  used_by VARCHAR(255),
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE activation_codes ENABLE ROW LEVEL SECURITY;

-- Hanya admin yang bisa insert/select all
CREATE POLICY "Admin full access" ON activation_codes
  FOR ALL USING (auth.role() = 'admin');

-- User biasa bisa verifikasi code
CREATE POLICY "Users verify codes" ON activation_codes
  FOR SELECT USING (TRUE);
```

### C. Activation Code Flow (Tetap Sama)

```
[User] → Pilih tier → [Payment Midtrans] → Webhook sukses
    → Generate activation code → Simpan di DB
    → Kirim ke email user + notif Telegram admin

[User] → Input code → [API Activation] → Validasi
    → Mark used → Buka akses konten
```

**Yang berubah:**
- DB: Prisma → Supabase
- Auth: Zustand → JWT/Supabase session
- Admin guard: password modal → JWT role check

---

## 4. Analisis Kelebihan & Kekurangan

### Kelebihan Menggabungkan

**1. Platform utuh, bukan kumpulan fitur**
V1 terasa seperti "kumpulan tools" — activation codes, AI, payment — tanpa pengalaman user yang terpadu. V.2 menyatukan semuanya: user bisa register, ikut course, forum, live class, bayar subscription dalam satu ekosistem.

**2. Admin panel lebih aman dan proper**
V1 cuma modal password (`admin123`) — sangat riskan. V.2 pakai JWT + Supabase Row Level Security + role-based dashboard. Keamanan naik drastis tanpa effort tambahan.

**3. Keamanan data dengan RLS**
V1 pakai Prisma tanpa row-level security. V.2 setiap tabel punya RLS — data user aman bahkan jika ada kebocoran koneksi database.

**4. Konten bisa dikelola tanpa coding**
V1 hardcode kurikulum di `curriculum-data.ts` — setiap ganti konten harus deploy ulang. V.2 pakai Sanity CMS, admin tinggal edit dari dashboard web.

**5. Monetisasi berkelanjutan**
V1 cuma activation code (one-time payment). V.2 ada subscription system (monthly/yearly) via Midtrans + Stripe — potensi recurring revenue.

**6. Fitur V1 yang sudah matang tetap jalan tanpa rewrite**
Activation codes, AI 4 mode, Midtrans webhook — logika bisnis sudah terbukti, cukup ditempelkan ke arsitektur V.2.

### Kekurangan & Risiko

**1. Migrasi data berpotensi loss**
Activation codes yang sudah terpakai di V1 (Prisma) harus dipindahkan ke Supabase. Satu data kelewatan, user existing bisa kehilangan akses.

**2. User existing harus bridging**
V1 auth sederhana (Zustand + cookie). V.2 pakai JWT/Supabase. User yang punya activation code belum otomatis punya akun V.2 — perlu mekanisme bridging atau migrasi user table.

**3. Dua database di masa transisi**
V.2 dominan Supabase, tapi activation codes mungkin perlu Prisma dulu. Ada fase dimana dua ORM jalan bersamaan — kompleksitas naik.

**4. Fitur V1 bisa "tenggelam" di V.2 yang lebih besar**
V1 flow-nya linier: landing → activation → konten. V.2 punya dashboard, courses, forum, live class — user baru bisa bingung mulai dari mana.

**5. Over-engineering untuk skala kecil**
Kalau user baru puluhan, Supabase + Sanity + Midtrans + Stripe + Socket.io + AI tutor mungkin terlalu berat. V1 yang lightweight sudah cukup.

**6. Biaya maintenance lebih tinggi**
V.2 punya lebih banyak dependensi (Supabase, Sanity, Midtrans, Stripe). Sanity bisa kena biaya kalau melebihi batas gratis.

**7. Waktu migrasi (8-12 hari)**
Selama migrasi V1 harus tetap berjalan — maintain dua versi sekaligus, testing dua kali lipat.

### Matriks Keputusan

| Kondisi | Rekomendasi | Alasan |
|---|---|---|
| User sudah 100+ / butuh skala | **Gabung** | V.2 fondasi lebih kokoh |
| Masih validasi awal (< 50 user) | **Tahan dulu** | V1 cukup, fokus ke konten |
| Ada tim non-teknis kelola konten | **Gabung** | Sanity CMS sangat membantu |
| Sendirian, pengen cepat rilis | **V1 dulu** | Fitur inti sudah jalan |
| Target jangka panjang (6+ bulan) | **Gabung** | Biaya migrasi makin mahal nanti |
| Budget terbatas | **V1 dulu** | V.2 lebih banyak biaya infrastruktur |

---

## 5. Arsitektur Target (V.2 + V1)

```
V.2/app/
├── (marketing)/           ← Landing page V.2
│   └── page.tsx
├── auth/                  ← Auth V.2 (JWT/Supabase)
│   ├── login/
│   └── register/
├── dashboard/             ← User dashboard V.2
│   ├── courses/
│   ├── forum/
│   ├── classes/
│   ├── profile/
│   └── recommendations/
├── admin/                 ← Admin V.2 (dari V1 + baru)
│   ├── dashboard/
│   │   ├── page.tsx       ← Analitik V.2
│   │   ├── activation/    ← Dari V1: kelola kode aktivasi
│   │   └── users/
│   └── layout.tsx
├── api/
│   ├── auth/              ← Auth V.2
│   ├── activation/        ← ✅ DARI V1
│   │   ├── generate/
│   │   ├── list/
│   │   └── route.ts
│   ├── ai/                ← ✅ DARI V1 + V.2 AI Tutor
│   │   ├── chat/          ← V.2 AI chat
│   │   ├── route.ts       ← V1: 4 mode AI
│   │   └── recommendations/
│   ├── payment/           ← ✅ DARI V1 (Midtrans) + V.2
│   │   ├── create/
│   │   └── webhook/
│   ├── courses/           ← V.2
│   ├── forum/             ← V.2
│   ├── progress/          ← V.2
│   ├── certificates/      ← V.2
│   ├── live-sessions/     ← V.2
│   └── users/             ← V.2
├── community/             ← ✅ DARI V1
└── layout.tsx

V.2/components/
├── ui/                    ← shadcn/ui
├── admin/                 ← ✅ DARI V1: admin panel
├── ai/                    ← ✅ DARI V1: AI features
│   ├── ai-hub-section.tsx
│   ├── ai-manifestation.tsx
│   ├── ai-limiting-belief.tsx
│   ├── ai-shadow.tsx
│   └── ai-private-session.tsx
├── community/             ← ✅ DARI V1
├── ai-tutor.tsx           ← V.2
└── theme-provider.tsx     ← V.2

V.2/lib/
├── supabase/              ← V.2
├── sanity/                ← V.2
├── auth.ts                ← V.2 (JWT)
├── types/                 ← V.2
├── store/                 ← ✅ DARI V1: Zustand
├── ai/
│   └── prompts.ts         ← ✅ DARI V1
├── data/
│   └── curriculum.ts      ← ✅ DARI V1
└── utils.ts               ← V.2
```

---

## 5. Strategi Migrasi Bertahap

> **Peringatan**: Sebelum memulai migrasi apapun, backup data V1 terlebih dahulu:
> ```bash
> # Backup database Prisma
> cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d)
> # atau untuk PostgreSQL
> pg_dump your_db > v1_backup_$(date +%Y%m%d).sql
> ```

### Fase 1: Fondasi (Estimasi: 2-3 hari)
- Setup V.2 bisa jalan sendiri (install, env, DB Supabase)
- Pindahkan Prisma schema activation_codes ke Supabase
- Setup Midtrans credentials di V.2
- Pastikan auth JWT V.2 berfungsi

### Fase 2: Warisan V1 (Estimasi: 2-3 hari)
- Copy API activation (generate, list, verify) ke V.2
- Adaptasi admin panel V1 jadi halaman di V.2
- Integrasi Midtrans payment (create + webhook)
- Pindahkan AI prompts dan komponen AI V1

### Fase 3: Integrasi (Estimasi: 2-3 hari)
- Hubungkan activation codes dengan auth V.2
- User yang terverifikasi bisa akses konten premium
- Admin panel V.2 bisa kelola activation codes
- Community page V1 diintegrasikan ke forum V.2

### Fase 4: Final (Estimasi: 1-2 hari)
- Testing end-to-end: register → payment → activation → akses konten
- Hapus duplikasi kode
- Update dokumentasi
- Deploy V.2

---

## 6. Poin Penting

### Yang TETAP SAMA
- Logika activation codes (generate, validasi, format `NVG-XXX-XXXX`)
- Midtrans integration (Snap token, webhook)
- AI prompt templates (manifestation, limiting-belief, shadow, private-session)
- Admin authentication key (`x-admin-key: neville2222`)
- Konten kurikulum (49 lessons, 10 courses)

### Yang BERUBAH
- Database: Prisma → Supabase (perlu migrasi data activation codes)
- Admin guard: modal password → JWT role check
- Auth: Zustand state → JWT + Supabase session
- Routing: view-based (Zustand) → Next.js App Router paths
- UI: menyatu dengan tema V.2 (shadcn/ui yang sudah konsisten)

### Risiko & Mitigasi
| Risiko | Mitigasi |
|---|---|
| Data activation codes hilang | Backup Prisma DB dulu, migrasi manual |
| Auth flow berbeda | Auth V.2 handle login, activation V1 sebagai gate konten |
| Konflik dependensi | V.2 punya Supabase + Sanity + Prisma bisa jalan bareng |
| Midtrans webhook url | Update di dashboard Midtrans ke URL V.2 |
| User existing tidak bisa login | Pastikan migrasi user table mencakup semua user |

---

## 7. Diagram Alur User

```
                    ┌─────────────────┐
                    │   Landing Page   │
                    │    (V.2 Hero)    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Register/Login │
                    │   (V.2 Auth)    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───┐  ┌──────▼──────┐  ┌────▼───────┐
     │ Dashboard  │  │ Premium     │  │ Community  │
     │ (V.2)      │  │ (V.1 Code)  │  │ (V.1+V.2)  │
     └────────────┘  └──────┬──────┘  └────────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
     ┌────────▼───┐  ┌─────▼──────┐  ┌───▼────────┐
     │ Courses    │  │ AI Tutor   │  │ Live       │
     │ & Lessons  │  │ (V1+V.2)   │  │ Classes    │
     └────────────┘  └────────────┘  └────────────┘
```

---

## 8. Catatan Tambahan

### Biaya Infrastruktur V.2 (Estimasi per Bulan)

| Layanan | Gratis | Berbayar (Min) | Catatan |
|---|---|---|---|
| Supabase | 500MB DB, 2GB bandwidth | $25/bln (Pro) | Naik kalau storage > 8GB |
| Sanity CMS | 50GB bandwidth | $15/bln (Growth) | Naik kalau dataset besar |
| Midtrans | 0% biaya bulanan | ~2% per transaksi | Payment gateway Indonesia |
| Vercel (deploy) | 100GB bandwidth | $20/bln (Pro) | Naik kalau banyak gambar/video |
| Domain | - | ~$15/tahun | .com atau .id |
| **Total estimasi** | **$0/bln (starter)** | **~$65/bln (produksi)** | |

Kalau budget terbatas, cukup Supabase free + Vercel free + Midtrans. Sanity bisa ditunda dulu selama konten masih sedikit.

### Rekomendasi Prioritas

1. **Jangan migrasi semua sekaligus.** Mulai dari activation codes dan payment dulu — itu yang paling kritis dan sudah matang.
2. **Buat fitur baru di V.2, biarkan fitur V1 tetap jalan.** Misalnya: course baru pakai Sanity, tapi activation codes tetap di Prisma dulu.
3. **Gunakan fitur V1 sebagai "premium add-on" di V.2.** User V.2 bisa akses semuanya, user V1 (activation code) cuma akses konten premium.
4. **Test di staging.** Jangan test langsung di V.2 yang terhubung ke Midtrans produksi.

---

## 9. File Kunci untuk Eksekusi

### Prioritas 1 (Infrastruktur)
- `V.2/.env.local` — Setup environment variables
- `V.2/lib/supabase/server.ts` — Server client
- `V.2/lib/supabase/client.ts` — Browser client
- `V.2/lib/auth.ts` — JWT utilities

### Prioritas 2 (Fitur V1 di V.2)
- `V.2/app/api/activation/` — 3 endpoint activation codes
- `V.2/app/api/payment/` — 2 endpoint Midtrans
- `V.2/app/api/ai/` — 4 mode AI
- `V.2/app/community/` — Community page
- `V.2/components/admin/` — Admin panel

### Prioritas 3 (Data)
- `database.sql` — Tambahkan tabel activation_codes
- `V.2/lib/ai/prompts.ts` — Copy dari V1
- `V.2/lib/data/curriculum.ts` — Copy dari V1
- `V.2/lib/store/` — Zustand store dari V1