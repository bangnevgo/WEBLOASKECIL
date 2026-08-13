# TikTok FREE AKSES LOAS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menghasilkan video TikTok faceless MP4 1080 × 1920 berdurasi 28–30 detik yang mengarahkan penonton ke formulir Daftar Free website LOAS.

**Architecture:** Video dibuat secara deterministik dari aset website lokal. Modul timeline mendefinisikan copy dan waktu; renderer Node + Sharp membuat 900 frame PNG pada 30 fps; FFmpeg membuat musik instrumental orisinal sederhana, menggabungkan frame dan audio, lalu FFprobe serta contact sheet memverifikasi hasil.

**Tech Stack:** Node.js 24, TypeScript/JavaScript ESM, `node:test`, Sharp 0.34, FFmpeg/FFprobe, aset PNG/JPG website.

## Global Constraints

- Output vertikal 9:16, 1080 × 1920 piksel, 30 fps, H.264/AAC, durasi 28–30 detik.
- Faceless dan tanpa voice-over.
- Gunakan latar gelap, aksen emas, teks putih, dan visual website lokal.
- Penawaran utama harus memakai istilah `FREE AKSES`, bukan `GRATIS`.
- Klaim produk hanya `10 modul`, `49 pelajaran`, dan materi tersusun bertahap.
- Klaim pengalaman membimbing adalah dasar penyusunan materi, bukan jaminan hasil.
- Jangan menampilkan data pribadi nyata dan jangan menyebut lead sebagai sales.
- CTA akhir harus tampil minimal 3 detik dan seluruh teks wajib berada dalam safe area TikTok.
- Musik harus instrumental, tanpa vokal, orisinal dari generator lokal, dan tidak memakai audio berhak cipta pihak lain.

---

## Struktur File

- Create: `marketing/tiktok-free-akses/timeline.mjs` — sumber tunggal scene, copy, durasi, dan utilitas timeline.
- Create: `marketing/tiktok-free-akses/timeline.test.mjs` — pengujian copy, timing, safe-area metadata, dan total durasi.
- Create: `marketing/tiktok-free-akses/render-frames.mjs` — pembuat SVG overlay dan frame PNG 1080 × 1920 menggunakan Sharp.
- Create: `marketing/tiktok-free-akses/render-frames.test.mjs` — smoke test satu frame dan pemeriksaan dimensi.
- Create: `marketing/tiktok-free-akses/render-audio.sh` — generator musik instrumental orisinal 30 detik dengan FFmpeg lavfi.
- Create: `marketing/tiktok-free-akses/render-video.sh` — orkestrasi render frame, audio, encoding H.264/AAC, dan contact sheet.
- Create: `marketing/tiktok-free-akses/verify-video.mjs` — validasi FFprobe untuk codec, ukuran, fps, durasi, dan keberadaan audio.
- Create: `marketing/tiktok-free-akses/output/.gitkeep` — direktori keluaran; file hasil besar tetap tidak perlu dikomit.
- Modify: `.gitignore` — abaikan frame sementara, WAV sementara, MP4, dan contact sheet keluaran.

### Task 1: Timeline, Copy, dan Guardrail

**Files:**
- Create: `marketing/tiktok-free-akses/timeline.mjs`
- Create: `marketing/tiktok-free-akses/timeline.test.mjs`

**Interfaces:**
- Produces: `FPS: number`, `WIDTH: number`, `HEIGHT: number`, `DURATION: number`, `SCENES: Scene[]`, dan `sceneAt(second: number): Scene`.
- `Scene` shape: `{ id, start, end, eyebrow, lines, accent, visual, emphasis }` dengan semua waktu dalam detik.

- [ ] **Step 1: Tulis pengujian timeline yang gagal**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { DURATION, SCENES, sceneAt } from './timeline.mjs'

test('timeline covers 30 seconds without gaps', () => {
  assert.equal(DURATION, 30)
  assert.equal(SCENES[0].start, 0)
  assert.equal(SCENES.at(-1).end, 30)
  for (let i = 1; i < SCENES.length; i++) assert.equal(SCENES[i - 1].end, SCENES[i].start)
})

test('offer uses FREE AKSES and never GRATIS', () => {
  const copy = JSON.stringify(SCENES)
  assert.match(copy, /FREE AKSES/)
  assert.doesNotMatch(copy, /GRATIS/i)
})

test('CTA remains on screen for at least three seconds', () => {
  const cta = SCENES.find((scene) => scene.id === 'cta')
  assert.ok(cta)
  assert.ok(cta.end - cta.start >= 3)
  assert.equal(sceneAt(29).id, 'cta')
})
```

- [ ] **Step 2: Jalankan pengujian dan pastikan gagal**

Run: `node --test marketing/tiktok-free-akses/timeline.test.mjs`

Expected: FAIL karena `timeline.mjs` belum ada.

- [ ] **Step 3: Implementasikan timeline final**

Gunakan scene berikut secara persis:

```js
export const FPS = 30
export const WIDTH = 1080
export const HEIGHT = 1920
export const DURATION = 30

export const SCENES = [
  { id: 'hook', start: 0, end: 3, eyebrow: 'BELAJAR DENGAN UTUH', lines: ['Belajar manifestasi', 'jangan cuma dari', 'potongan konten.'], accent: 'potongan konten.', visual: 'hero', emphasis: 'impact' },
  { id: 'problem-1', start: 3, end: 6, eyebrow: 'MASALAHNYA', lines: ['Banyak orang', 'langsung praktik…'], accent: 'langsung praktik…', visual: 'module', emphasis: 'normal' },
  { id: 'problem-2', start: 6, end: 10, eyebrow: 'TAPI', lines: ['Tidak memahami', 'teorinya', 'dengan benar.'], accent: 'dengan benar.', visual: 'curriculum', emphasis: 'normal' },
  { id: 'consequence', start: 10, end: 13, eyebrow: 'AKHIRNYA', lines: ['Saat muncul hambatan,', 'tidak tahu harus', 'bagaimana.'], accent: 'bagaimana.', visual: 'pause', emphasis: 'impact' },
  { id: 'difference', start: 13, end: 18, eyebrow: 'BEDANYA DI SINI', lines: ['Materi disusun dari', 'pengalaman membimbing—', 'bukan sekadar', 'rangkuman buku.'], accent: 'pengalaman membimbing—', visual: 'mentor', emphasis: 'normal' },
  { id: 'proof', start: 18, end: 23, eyebrow: 'BELAJAR BERTAHAP', lines: ['10 MODUL', '49 PELAJARAN', 'Tersusun bertahap.'], accent: '49 PELAJARAN', visual: 'curriculum-scroll', emphasis: 'stats' },
  { id: 'offer', start: 23, end: 26, eyebrow: 'UNTUK KAMU', lines: ['Dapatkan', 'FREE AKSES', 'ke seluruh materi.'], accent: 'FREE AKSES', visual: 'register-button', emphasis: 'stats' },
  { id: 'cta', start: 26, end: 30, eyebrow: 'MULAI SEKARANG', lines: ['Klik link di bio', 'Daftar Free →', 'Buka 10 modul &', '49 pelajaran'], accent: 'Klik link di bio', visual: 'lead-form', emphasis: 'cta' },
]

export function sceneAt(second) {
  return SCENES.find((scene) => second >= scene.start && second < scene.end) ?? SCENES.at(-1)
}
```

- [ ] **Step 4: Jalankan pengujian sampai lulus**

Run: `node --test marketing/tiktok-free-akses/timeline.test.mjs`

Expected: 3 tests PASS.

- [ ] **Step 5: Commit timeline**

```bash
git add marketing/tiktok-free-akses/timeline.mjs marketing/tiktok-free-akses/timeline.test.mjs
git commit -m "feat(video): define TikTok LOAS timeline"
```

### Task 2: Renderer Frame Vertikal

**Files:**
- Create: `marketing/tiktok-free-akses/render-frames.mjs`
- Create: `marketing/tiktok-free-akses/render-frames.test.mjs`
- Create: `marketing/tiktok-free-akses/output/.gitkeep`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `FPS`, `WIDTH`, `HEIGHT`, `DURATION`, `sceneAt()` dari `timeline.mjs`.
- Produces: `renderFrame(frameIndex: number, outputPath: string): Promise<void>` dan frame `tmp/frames/frame-00000.png` sampai `frame-00899.png`.

- [ ] **Step 1: Tulis smoke test renderer yang gagal**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import sharp from 'sharp'
import { renderFrame } from './render-frames.mjs'

test('renderFrame creates a 1080x1920 PNG', async () => {
  const output = '/tmp/loas-tiktok-test-frame.png'
  await renderFrame(0, output)
  const metadata = await sharp(output).metadata()
  assert.equal(metadata.width, 1080)
  assert.equal(metadata.height, 1920)
  assert.equal(metadata.format, 'png')
  await fs.unlink(output)
})
```

- [ ] **Step 2: Jalankan pengujian dan pastikan gagal**

Run: `node --test marketing/tiktok-free-akses/render-frames.test.mjs`

Expected: FAIL karena `render-frames.mjs` belum ada.

- [ ] **Step 3: Implementasikan renderer dengan safe area eksplisit**

Renderer harus:

- Memakai aset `public/screenshots/mobile/iPhone_14_landing.png`, `public/screenshots/mobile/iPhone_14_landing_full.png`, `public/screenshots/hero.png`, dan `public/images/bang-nevgo-portrait.png`.
- Membuat background cover 1080 × 1920, blur 14–24 px, overlay hitam 55–70%, dan aksen emas `#d4a053`.
- Menempatkan seluruh copy di kotak aman `x=72..936`, `y=220..1510`; area kanan 936..1080 dan bawah 1510..1920 tidak memuat pesan utama.
- Menggunakan animasi masuk `easeOutCubic = 1 - (1 - t) ** 3`, translate-y maksimum 64 px, opacity, zoom latar 1.00→1.08, dan progress bar scene di bagian atas.
- Meng-escape karakter `&`, `<`, `>` sebelum memasukkan copy ke SVG.
- Menggunakan font sistem `Arial, Helvetica, sans-serif` agar render tidak bergantung pada font eksternal.
- Menambahkan label kecil `HUKUM ASUMSI · BANG NEVGO` pada seluruh scene.
- Mengekspor `renderFrame` dan hanya merender seluruh 900 frame jika file dijalankan langsung.

Core komposisi yang harus digunakan:

```js
const second = frameIndex / FPS
const scene = sceneAt(second)
const local = (second - scene.start) / (scene.end - scene.start)
const enter = 1 - Math.pow(1 - Math.min(local / 0.22, 1), 3)
const yOffset = Math.round((1 - enter) * 64)
const opacity = Math.min(1, enter)
```

- [ ] **Step 4: Tambahkan pola output ke `.gitignore`**

```gitignore
marketing/tiktok-free-akses/tmp/
marketing/tiktok-free-akses/output/*.mp4
marketing/tiktok-free-akses/output/*.wav
marketing/tiktok-free-akses/output/*.jpg
```

- [ ] **Step 5: Jalankan smoke test renderer**

Run: `node --test marketing/tiktok-free-akses/render-frames.test.mjs`

Expected: PASS dan metadata frame 1080 × 1920 PNG.

- [ ] **Step 6: Render seluruh frame**

Run: `node marketing/tiktok-free-akses/render-frames.mjs`

Expected: 900 file PNG di `marketing/tiktok-free-akses/tmp/frames/`; log terakhir `Rendered 900/900 frames`.

- [ ] **Step 7: Commit renderer**

```bash
git add .gitignore marketing/tiktok-free-akses/render-frames.mjs marketing/tiktok-free-akses/render-frames.test.mjs marketing/tiktok-free-akses/output/.gitkeep
git commit -m "feat(video): render vertical LOAS scenes"
```

### Task 3: Musik Instrumental Orisinal dan Encoding Video

**Files:**
- Create: `marketing/tiktok-free-akses/render-audio.sh`
- Create: `marketing/tiktok-free-akses/render-video.sh`

**Interfaces:**
- Consumes: sequence `tmp/frames/frame-%05d.png`.
- Produces: `output/loas-free-akses-tiktok.mp4`, `output/loas-free-akses-contact-sheet.jpg`, dan audio sementara `tmp/loas-music.wav`.

- [ ] **Step 1: Implementasikan generator musik instrumental**

`render-audio.sh` harus memakai `set -euo pipefail`, menghitung root berdasarkan lokasi script, lalu menghasilkan WAV stereo 48 kHz berdurasi 30 detik. Gunakan sumber orisinal sintetis berikut: kick dari sine 55 Hz berpola tiap 0,5 detik; pad chord lembut dari 220/277.18/329.63 Hz; pulse 440 Hz dengan volume rendah; fade-in 0,4 detik dan fade-out mulai detik 28,5. Terapkan `alimiter=limit=0.85` agar tidak clipping.

Run: `bash marketing/tiktok-free-akses/render-audio.sh`

Expected: `tmp/loas-music.wav` ada dan FFprobe melaporkan 30 detik, stereo, 48000 Hz.

- [ ] **Step 2: Implementasikan orkestrator video**

`render-video.sh` harus:

1. Memakai `set -euo pipefail`.
2. Menjalankan `node --test` untuk dua test file.
3. Menjalankan `node render-frames.mjs`.
4. Menjalankan `bash render-audio.sh`.
5. Encode dengan input frame 30 fps dan WAV; gunakan `libx264`, `-pix_fmt yuv420p`, `-profile:v high`, `-crf 18`, `-preset medium`, AAC 192 kbps, `-movflags +faststart`, dan `-shortest`.
6. Membuat contact sheet delapan frame pada detik `1,4,8,11,15,20,24,28` menggunakan filter `select`, `scale=270:480`, dan `tile=4x2`.

Perintah encoding inti:

```bash
ffmpeg -y -framerate 30 -i "$FRAME_DIR/frame-%05d.png" -i "$AUDIO" \
  -c:v libx264 -pix_fmt yuv420p -profile:v high -crf 18 -preset medium \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest "$OUTPUT"
```

- [ ] **Step 3: Jalankan render penuh**

Run: `bash marketing/tiktok-free-akses/render-video.sh`

Expected: MP4 dan contact sheet berhasil dibuat tanpa error FFmpeg.

- [ ] **Step 4: Commit pipeline audio/video**

```bash
git add marketing/tiktok-free-akses/render-audio.sh marketing/tiktok-free-akses/render-video.sh
git commit -m "feat(video): add original audio and MP4 pipeline"
```

### Task 4: Verifikasi Teknis dan Preview

**Files:**
- Create: `marketing/tiktok-free-akses/verify-video.mjs`

**Interfaces:**
- Consumes: `output/loas-free-akses-tiktok.mp4`.
- Produces: exit code 0 serta ringkasan JSON jika video memenuhi kontrak; exit code 1 jika ada syarat yang gagal.

- [ ] **Step 1: Tulis verifier FFprobe**

Jalankan `ffprobe -v error -show_streams -show_format -of json` melalui `spawnSync`. Assert seluruh kondisi berikut dengan `node:assert/strict`:

```js
assert.equal(video.codec_name, 'h264')
assert.equal(video.width, 1080)
assert.equal(video.height, 1920)
assert.equal(video.pix_fmt, 'yuv420p')
assert.equal(video.avg_frame_rate, '30/1')
assert.equal(audio.codec_name, 'aac')
assert.equal(Number(audio.sample_rate), 48000)
assert.ok(duration >= 28 && duration <= 30.2)
assert.ok(Number(format.size) > 1_000_000)
```

Jika sukses, cetak `{ path, duration, size, videoCodec, audioCodec, dimensions, fps }`.

- [ ] **Step 2: Jalankan seluruh test dan verifier**

Run: `node --test marketing/tiktok-free-akses/*.test.mjs && node marketing/tiktok-free-akses/verify-video.mjs`

Expected: semua test PASS dan verifier exit 0.

- [ ] **Step 3: Inspeksi contact sheet dan video**

Buka `marketing/tiktok-free-akses/output/loas-free-akses-contact-sheet.jpg` untuk memeriksa delapan momen utama. Putar MP4 penuh dan periksa:

- copy tidak tertutup UI TikTok;
- setiap scene terbaca;
- tidak ada data pribadi;
- tidak ada kata `GRATIS`;
- scene 18–23 detik menampilkan `10 MODUL` dan `49 PELAJARAN`;
- CTA bertahan dari detik 26 sampai 30;
- musik tidak clipping atau terlalu keras.

- [ ] **Step 4: Commit verifier**

```bash
git add marketing/tiktok-free-akses/verify-video.mjs
git commit -m "test(video): verify TikTok delivery contract"
```

- [ ] **Step 5: Serahkan hasil**

Tautkan file berikut kepada pengguna:

- `marketing/tiktok-free-akses/output/loas-free-akses-tiktok.mp4`
- `marketing/tiktok-free-akses/output/loas-free-akses-contact-sheet.jpg`

Nyatakan video **siap posting** hanya setelah pengujian otomatis lulus dan preview visual/audio selesai.
