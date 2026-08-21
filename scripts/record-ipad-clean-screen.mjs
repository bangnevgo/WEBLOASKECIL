import { chromium } from 'playwright';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const LIVE_URL = 'https://loas.nevgoinstitute.com';
const OUTPUT_DIR = path.resolve('public/tiktok-assets');
const RECORDINGS_TEMP = path.resolve('recordings-temp');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(RECORDINGS_TEMP)) fs.mkdirSync(RECORDINGS_TEMP, { recursive: true });

async function recordCleanTabletScreen() {
  console.log('🚀 Merekam Layar Bersih (Clean UI) Website LOAS dalam Resolusi iPad Asli (834 x 1194)...');

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 834, height: 1194 },
    deviceScaleFactor: 2,
    recordVideo: {
      dir: RECORDINGS_TEMP,
      size: { width: 834, height: 1194 }
    }
  });

  const page = await context.newPage();

  await page.addInitScript(() => {
    window.addEventListener('DOMContentLoaded', () => {
      document.documentElement.classList.add('dark');
      const style = document.createElement('style');
      style.innerHTML = `
        html, body { scrollbar-width: none !important; -ms-overflow-style: none !important; }
        ::-webkit-scrollbar { display: none !important; }
        .highlight-glow {
          box-shadow: 0 0 50px rgba(212, 160, 83, 0.9) !important;
          transform: scale(1.04) !important;
          transition: all 0.5s ease-in-out !important;
        }
      `;
      document.head.appendChild(style);
    });
  });

  console.log('📍 [00:00 - 00:03] Hero View...');
  await page.goto(LIVE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log('📍 [00:03 - 00:06] Scroll Masalah 1...');
  await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
  await page.waitForTimeout(3000);

  console.log('📍 [00:06 - 00:10] Scroll Masalah 2...');
  await page.evaluate(() => window.scrollBy({ top: 600, behavior: 'smooth' }));
  await page.waitForTimeout(4000);

  console.log('📍 [00:10 - 00:13] Konsekuensi...');
  await page.evaluate(() => window.scrollBy({ top: 450, behavior: 'smooth' }));
  await page.waitForTimeout(3000);

  console.log('📍 [00:13 - 00:18] Pembeda (Curriculum Overview)...');
  await page.evaluate(() => {
    const el = document.querySelector('#curriculum') || document.querySelector('.nv-curriculum') || document.body;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  await page.waitForTimeout(5000);

  console.log('📍 [00:18 - 00:23] Bukti 10 Modul • 49 Pelajaran...');
  await page.evaluate(() => window.scrollBy({ top: 550, behavior: 'smooth' }));
  await page.waitForTimeout(5000);

  console.log('📍 [00:23 - 00:26] Penawaran & Highlight Daftar Free...');
  const ctaBtn = page.locator('button:has-text("Daftar Free"), a:has-text("Daftar Free"), button:has-text("Akses Semua Modul")').first();
  if (await ctaBtn.count() > 0) {
    await ctaBtn.scrollIntoViewIfNeeded();
    await ctaBtn.evaluate((el) => el.classList.add('highlight-glow'));
  }
  await page.waitForTimeout(3000);

  console.log('📍 [00:26 - 00:30] CTA Form Pop-up...');
  if (await ctaBtn.count() > 0) {
    await ctaBtn.click();
  }
  await page.waitForTimeout(1000);

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

  await page.waitForTimeout(4500);

  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (video) {
    const rawPath = await video.path();
    const cleanIpadMp4 = path.join(OUTPUT_DIR, 'clean_ipad_screen_native.mp4');

    console.log('⚙️ Mengonversi rekaman iPad asli ke MP4 60FPS...');
    execSync(`ffmpeg -y -i "${rawPath}" -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -r 60 "${cleanIpadMp4}"`, { stdio: 'inherit' });
    console.log(`✅ File rekaman tablet bersih siap: ${cleanIpadMp4}`);
  }
}

recordCleanTabletScreen().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
