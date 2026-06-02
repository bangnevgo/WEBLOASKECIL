# WEBLOASKECIL — Hukum Asumsi

<p align="center">
  <img src="/graph-view-fullpage.png" alt="Knowledge Graph View" width="100%" />
</p>

> **Platform pembelajaran digital tentang Hukum Asumsi dan ajaran Neville Goddard.** Menyediakan kurikulum terstruktur, AI-powered tools, dan komunitas eksklusif. Tampilan di atas adalah **Second Brain Knowledge Graph** — peta visual dari seluruh kurikulum 10 Bagian, 49 Pelajaran, dan literatur pendukung.

<p align="center">
  <img src="/screenshots/hero.png" alt="Hero Section" width="45%" />
  <img src="/screenshots/community.png" alt="Community Page" width="45%" />
</p>
<p align="center">
  <img src="/screenshots/pricing.png" alt="Pricing Page" width="45%" />
  <img src="/screenshots/dashboard.png" alt="Dashboard" width="45%" />
</p>

## Fitur

- **Kurikulum Terstruktur** — 49+ pelajaran dalam 10 bagian, dari dasar hingga mahir
- **AI Hub** — Asisten AI untuk manifestasi, terapi limiting belief, shadow work, dan sesi privat
- **Komunitas Eksklusif** — Forum diskusi anggota, feed posting, direktori anggota
- **eBook Collection** — Koleksi ebook manifestasi
- **Subscription Tiers** — Free, Pelajar, Premium, Master
- **Aktivasi Kode** — Sistem activation code untuk akses konten premium
- **Payment Gateway** — Integrasi Midtrans untuk pembayaran
- **Admin Panel** — Dashboard manajemen konten dan pengguna

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Bahasa:** TypeScript
- **UI:** React 19, Tailwind CSS v4, Framer Motion
- **State Management:** Zustand
- **Database:** PostgreSQL + Prisma ORM
- **Payment:** Midtrans (Snap API)
- **Authentication:** NextAuth.js
- **Deploy:** Standalone Next.js (Bun runtime)

## Mulai

### Prasyarat

- Bun (atau Node.js >= 18)
- PostgreSQL

### Instalasi

```bash
# Clone repository
git clone https://github.com/bangnevgo/WEBLOASKECIL.git
cd WEBLOASKECIL

# Install dependencies
bun install

# Setup environment
cp .env.example .env
# Edit .env — isi DATABASE_URL dan konfigurasi lainnya

# Setup database
bun run db:push

# Jalankan development server
bun run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Deskripsi |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret untuk NextAuth |
| `MIDTRANS_SERVER_KEY` | Server key Midtrans |
| `MIDTRANS_CLIENT_KEY` | Client key Midtrans |

## Scripts

| Script | Deskripsi |
|---|---|
| `bun run dev` | Development server (port 3000) |
| `bun run build` | Build produksi |
| `bun run start` | Jalankan production server |
| `bun run db:push` | Push Prisma schema ke database |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:migrate` | Jalankan Prisma migration |

## Struktur Proyek

```
src/
├── app/              # Next.js App Router pages & API
│   └── api/          # API routes (activation, payment, ai)
├── components/       # React components
│   ├── community/    # Halaman komunitas
│   └── ui/           # UI primitives (shadcn/ui)
└── lib/              # Utilities, store, data kurikulum
prisma/               # Prisma schema & migrations
public/               # Static assets
```

## Lisensi

Hak cipta © Bang Nevgo. Seluruh hak cipta dilindungi.
