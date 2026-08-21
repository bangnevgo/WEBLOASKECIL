import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.resolve('public/tiktok-assets');
const RECORDINGS_TEMP = path.resolve('recordings-temp');

// Pastikan direktori output tersedia
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(RECORDINGS_TEMP)) {
  fs.mkdirSync(RECORDINGS_TEMP, { recursive: true });
}

async function recordTikTokVideo() {
  console.log('🚀 Memulai Perekaman Video TikTok LOAS (1080 x 1920 | 9:16)...');
  console.log(`🌐 Target URL: ${BASE_URL}`);

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 2,
    recordVideo: {
      dir: RECORDINGS_TEMP,
      size: { width: 1080, height: 1920 }
    }
  });

  const page = await context.newPage();

  // Injeksi style untuk optimasi tampilan mobile vertikal 9:16
  await page.addInitScript(() => {
    window.addEventListener('DOMContentLoaded', () => {
      // Pastikan tema gelap aktif
      document.documentElement.classList.add('dark');
      
      const style = document.createElement('style');
      style.innerHTML = `
        /* Optimasi visual render 9:16 untuk video portrait */
        html, body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        ::-webkit-scrollbar {
          display: none !important;
        }
        /* Highlight gold glow effect */
        .tiktok-highlight {
          box-shadow: 0 0 35px rgba(212, 175, 55, 0.6) !important;
          border-color: #d4a053 !important;
          transform: scale(1.03);
          transition: all 0.5s ease-in-out;
        }
      `;
      document.head.appendChild(style);
    });
  });

  console.log('📍 [00:00 - 00:03] Scene 1: Hook & Hero View...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Capture Still Frame 1: Hook / Hero
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_scene_hook_hero.png') });
  await page.waitForTimeout(2000);

  console.log('📍 [00:03 - 00:06] Scene 2: Masalah 1 (Transisi ke modul overview)...');
  // Scroll perlahan ke bawah
  await page.evaluate(() => {
    window.scrollBy({ top: 600, behavior: 'smooth' });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_scene_masalah1.png') });
  await page.waitForTimeout(1000);

  console.log('📍 [00:06 - 00:10] Scene 3: Masalah 2 (Kurikulum & Struktur Teori)...');
  await page.evaluate(() => {
    window.scrollBy({ top: 750, behavior: 'smooth' });
  });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_scene_masalah2_kurikulum.png') });
  await page.waitForTimeout(1500);

  console.log('📍 [00:10 - 00:13] Scene 4: Konsekuensi (Fokus pada kedalaman materi)...');
  await page.evaluate(() => {
    window.scrollBy({ top: 500, behavior: 'smooth' });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_scene_konsekuensi.png') });
  await page.waitForTimeout(1000);

  console.log('📍 [00:13 - 00:18] Scene 5: Pembeda (Pengalaman Membimbing & Bang Nevgo)...');
  // Scroll ke section kurikulum / modul interaktif
  await page.evaluate(() => {
    const curriculumSection = document.querySelector('#curriculum') || document.querySelector('.nv-curriculum') || document.body;
    if (curriculumSection) {
      curriculumSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_scene_pembeda_pengalaman.png') });
  await page.waitForTimeout(2000);

  console.log('📍 [00:18 - 00:23] Scene 6: Bukti Produk (10 Modul • 49 Pelajaran)...');
  // Buka atau scroll melalui daftar modul
  await page.evaluate(() => {
    window.scrollBy({ top: 600, behavior: 'smooth' });
  });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06_scene_bukti_10modul.png') });
  await page.waitForTimeout(2500);

  console.log('📍 [00:23 - 00:26] Scene 7: Penawaran (FREE AKSES & Highlight Tombol Daftar Free)...');
  // Temukan tombol Daftar Free dan scroll ke tombol tersebut
  const ctaBtn = page.locator('button:has-text("Daftar Free"), a:has-text("Daftar Free"), button:has-text("Akses Gratis"), button:has-text("Mulai Belajar")').first();
  if (await ctaBtn.count() > 0) {
    await ctaBtn.scrollIntoViewIfNeeded();
    await ctaBtn.evaluate((el) => el.classList.add('tiktok-highlight'));
  }
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_scene_penawaran_free_akses.png') });
  await page.waitForTimeout(1000);

  console.log('📍 [00:26 - 00:30] Scene 8: CTA & Modal Form (Klik Daftar Free + Placeholder Form)...');
  if (await ctaBtn.count() > 0) {
    await ctaBtn.click();
  } else {
    // Fallback trigger modal lewat evaluate jika tombol overlay
    await page.evaluate(() => {
      const btn = document.querySelector('button');
      if (btn) btn.click();
    });
  }
  
  await page.waitForTimeout(1000);

  // Isi form dengan placeholder dummy tanpa data pribadi nyata
  const nameInput = page.locator('input[type="text"], input[placeholder*="Nama"], input[name="name"]').first();
  const emailInput = page.locator('input[type="email"], input[placeholder*="email"], input[name="email"]').first();
  const phoneInput = page.locator('input[type="tel"], input[placeholder*="08"], input[name="phone"]').first();

  if (await nameInput.count() > 0) {
    await nameInput.focus();
    await page.keyboard.type('Teman Belajar', { delay: 60 });
  }
  if (await emailInput.count() > 0) {
    await emailInput.focus();
    await page.keyboard.type('akses@loas.id', { delay: 50 });
  }
  if (await phoneInput.count() > 0) {
    await phoneInput.focus();
    await page.keyboard.type('081234567890', { delay: 40 });
  }

  // Tahan frame CTA akhir minimal 3.5 detik sesuai kriteria storyboard
  await page.screenshot({ path: path.join(OUTPUT_DIR, '08_scene_cta_form_final.png') });
  await page.waitForTimeout(3800);

  // Tutup halaman untuk menyelesaikan rekaman video
  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (video) {
    const videoPath = await video.path();
    console.log(`🎥 Raw WebM Video tersimpan di: ${videoPath}`);

    const rawMp4Output = path.join(OUTPUT_DIR, 'loas_tiktok_raw_9x16.mp4');
    
    // Konversi WebM ke MP4 1080x1920 60fps dengan FFmpeg
    try {
      console.log('⚙️ Mengonversi ke MP4 Vertikal 1080x1920 (H.264 / 60 FPS)...');
      execSync(`ffmpeg -y -i "${videoPath}" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -r 60 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black" "${rawMp4Output}"`, { stdio: 'inherit' });
      console.log(`✅ Video MP4 Raw siap: ${rawMp4Output}`);
    } catch (ffmpegErr) {
      console.warn('⚠️ Gagal menjalankan FFmpeg otomatis:', ffmpegErr.message);
    }
  }

  console.log('\n✨ Perekaman Selesai!');
  console.log(`📁 Semua asset & screenshot tersimpan di: ${OUTPUT_DIR}`);
}

recordTikTokVideo().catch((err) => {
  console.error('❌ Terjadi kesalahan saat merekam video:', err);
  process.exit(1);
});
