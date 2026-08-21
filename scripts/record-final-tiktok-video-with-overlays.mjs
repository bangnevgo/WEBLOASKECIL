import { chromium } from 'playwright';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const LIVE_URL = 'https://loas.nevgoinstitute.com';
const OUTPUT_DIR = path.resolve('public/tiktok-assets');
const RECORDINGS_TEMP = path.resolve('recordings-temp');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(RECORDINGS_TEMP)) fs.mkdirSync(RECORDINGS_TEMP, { recursive: true });

async function recordLiveLOASTikTok() {
  console.log(`🚀 Merekam Langsung dari Live Website: ${LIVE_URL}...`);

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

  // Injeksi Overlay Kinetik Typography Premium ke dalam DOM Page Live
  await page.addInitScript(() => {
    window.addEventListener('DOMContentLoaded', () => {
      document.documentElement.classList.add('dark');

      const style = document.createElement('style');
      style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');

        html, body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        ::-webkit-scrollbar { display: none !important; }

        /* TikTok Overlay Layer */
        #tiktok-kinetic-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 0 40px;
          text-align: center;
        }

        .kinetic-card {
          background: rgba(8, 8, 12, 0.88);
          border: 2px solid rgba(212, 160, 83, 0.4);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(212, 160, 83, 0.35);
          backdrop-filter: blur(16px);
          border-radius: 28px;
          padding: 32px 36px;
          max-width: 920px;
          transform: scale(0.92);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .kinetic-card.active {
          transform: scale(1);
          opacity: 1;
        }

        .kinetic-badge {
          display: inline-block;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #d4a053;
          background: rgba(212, 160, 83, 0.18);
          border: 1.5px solid rgba(212, 160, 83, 0.5);
          padding: 8px 24px;
          border-radius: 999px;
          margin-bottom: 18px;
        }

        .kinetic-main-text {
          font-size: 48px;
          font-weight: 900;
          line-height: 1.25;
          color: #ffffff;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 20px rgba(0,0,0,0.8);
        }

        .gold-glow {
          color: #ffd700;
          background: linear-gradient(135deg, #ffe066 0%, #d4a053 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 16px rgba(212, 160, 83, 0.6));
        }

        .kinetic-sub-text {
          font-size: 28px;
          font-weight: 700;
          color: #d1d5db;
          margin-top: 14px;
          line-height: 1.35;
        }

        .highlight-btn {
          box-shadow: 0 0 45px rgba(212, 160, 83, 0.9) !important;
          transform: scale(1.05) !important;
          transition: all 0.4s ease-in-out !important;
        }
      `;
      document.head.appendChild(style);

      const overlay = document.createElement('div');
      overlay.id = 'tiktok-kinetic-overlay';
      overlay.innerHTML = `
        <div id="kinetic-card" class="kinetic-card">
          <div id="kinetic-badge" class="kinetic-badge">01 • HOOK</div>
          <div id="kinetic-main" class="kinetic-main-text"></div>
          <div id="kinetic-sub" class="kinetic-sub-text"></div>
        </div>
      `;
      document.body.appendChild(overlay);

      window.__setKineticText = (badge, mainHtml, subText = '') => {
        const card = document.getElementById('kinetic-card');
        const badgeEl = document.getElementById('kinetic-badge');
        const mainEl = document.getElementById('kinetic-main');
        const subEl = document.getElementById('kinetic-sub');

        if (!card) return;
        card.classList.remove('active');

        setTimeout(() => {
          badgeEl.textContent = badge;
          mainEl.innerHTML = mainHtml;
          subEl.textContent = subText;
          card.classList.add('active');
        }, 150);
      };
    });
  });

  console.log('📍 [00:00 - 00:03] Scene 1: Hook (Live Hero https://loas.nevgoinstitute.com)...');
  await page.goto(LIVE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1000);

  await page.evaluate(() => {
    window.__setKineticText('01 • HOOK', 'Belajar Manifestasi<br><span class="gold-glow">JANGAN CUMA DARI POTONGAN KONTEN</span>', '');
  });
  await page.waitForTimeout(2800);

  console.log('📍 [00:03 - 00:06] Scene 2: Masalah 1...');
  await page.evaluate(() => {
    window.__setKineticText('02 • MASALAH 1', 'Banyak orang langsung praktik...', 'Tanpa memahami fondasi dasarnya');
    window.scrollBy({ top: 600, behavior: 'smooth' });
  });
  await page.waitForTimeout(2800);

  console.log('📍 [00:06 - 00:10] Scene 3: Masalah 2...');
  await page.evaluate(() => {
    window.__setKineticText('03 • MASALAH 2', 'Tapi tidak memahami<br><span class="gold-glow">TEORINYA DENGAN BENAR</span>', 'Hanya mengandalkan potongan video pendek');
    window.scrollBy({ top: 750, behavior: 'smooth' });
  });
  await page.waitForTimeout(3800);

  console.log('📍 [00:10 - 00:13] Scene 4: Konsekuensi...');
  await page.evaluate(() => {
    window.__setKineticText('04 • KONSEKUENSI', 'Saat muncul hambatan...', 'Akhirnya bingung harus bagaimana');
    window.scrollBy({ top: 500, behavior: 'smooth' });
  });
  await page.waitForTimeout(2800);

  console.log('📍 [00:13 - 00:18] Scene 5: Pembeda (Beat Up)...');
  await page.evaluate(() => {
    window.__setKineticText('05 • PEMBEDA', 'Materi disusun dari<br><span class="gold-glow">PENGALAMAN MEMBIMBING</span>', 'Bukan sekadar rangkuman buku');
    window.scrollBy({ top: 600, behavior: 'smooth' });
  });
  await page.waitForTimeout(4800);

  console.log('📍 [00:18 - 00:23] Scene 6: Bukti Produk (10 Modul • 49 Pelajaran)...');
  await page.evaluate(() => {
    window.__setKineticText('06 • KURIKULUM', '<span class="gold-glow">10 MODUL • 49 PELAJARAN</span>', 'Tersusun bertahap & terstruktur dari dasar hingga mahir');
    window.scrollBy({ top: 600, behavior: 'smooth' });
  });
  await page.waitForTimeout(4800);

  console.log('📍 [00:23 - 00:26] Scene 7: Penawaran FREE AKSES...');
  await page.evaluate(() => {
    window.__setKineticText('07 • PENAWARAN', 'Dapatkan<br><span class="gold-glow">FREE AKSES KE SELURUH MATERI</span>', 'Buka semua 10 modul pembelajaran');
  });

  const ctaBtn = page.locator('button:has-text("Daftar Free"), a:has-text("Daftar Free"), button:has-text("Akses Semua Modul"), button:has-text("Daftar")').first();
  if (await ctaBtn.count() > 0) {
    await ctaBtn.scrollIntoViewIfNeeded();
    await ctaBtn.evaluate((el) => el.classList.add('highlight-btn'));
  }
  await page.waitForTimeout(2800);

  console.log('📍 [00:26 - 00:30] Scene 8: CTA Final & Form Access...');
  if (await ctaBtn.count() > 0) {
    await ctaBtn.click();
  }
  await page.waitForTimeout(1000);

  await page.evaluate(() => {
    window.__setKineticText('08 • DAFTAR SEKARANG', '👉 <span class="gold-glow">KLIK LINK DI BIO</span>', 'Daftar Free → Buka 10 Modul & 49 Pelajaran');
  });

  // Isi data dummy non-personal
  const nameInput = page.locator('input[type="text"], input[placeholder*="Nama"], input[name="name"]').first();
  const emailInput = page.locator('input[type="email"], input[placeholder*="email"], input[name="email"]').first();
  const phoneInput = page.locator('input[type="tel"], input[placeholder*="08"], input[name="phone"]').first();

  if (await nameInput.count() > 0) {
    await nameInput.focus();
    await page.keyboard.type('Teman Belajar', { delay: 50 });
  }
  if (await emailInput.count() > 0) {
    await emailInput.focus();
    await page.keyboard.type('akses@loas.id', { delay: 40 });
  }
  if (await phoneInput.count() > 0) {
    await phoneInput.focus();
    await page.keyboard.type('081234567890', { delay: 35 });
  }

  // Tahan frame CTA 4 detik
  await page.waitForTimeout(4000);

  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (video) {
    const rawPath = await video.path();
    const finalMp4 = path.join(OUTPUT_DIR, 'LOAS_LIVE_TIKTOK_FINAL_SIAP_POST.mp4');
    const downloadsMp4 = '/Users/ding/Downloads/LOAS_TikTok_LeadMagnet_Final_Ready.mp4';
    const audioTrack = path.join(OUTPUT_DIR, 'user_audio.mp3');

    console.log('⚙️ Mengonversi rekaman live ke MP4 1080x1920 60FPS...');
    execSync(`ffmpeg -y -i "${rawPath}" -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -r 60 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black" "${finalMp4}"`, { stdio: 'inherit' });

    if (fs.existsSync(audioTrack)) {
      console.log('🎵 Menggabungkan audio soundtrack...');
      execSync(`ffmpeg -y -i "${finalMp4}" -stream_loop -1 -i "${audioTrack}" -c:v copy -c:a aac -shortest "${downloadsMp4}"`, { stdio: 'inherit' });
    } else {
      fs.copyFileSync(finalMp4, downloadsMp4);
    }

    console.log(`\n🎉 SUKSES BESAR! File video berlatar https://loas.nevgoinstitute.com telah siap di:\n👉 ${downloadsMp4}`);
  }
}

recordLiveLOASTikTok().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
