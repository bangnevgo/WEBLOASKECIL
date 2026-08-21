import { chromium } from 'playwright';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const HTML_FILE = path.resolve('public/tiktok-assets/tiktok-ipad-apple-studio.html');
const OUTPUT_DIR = path.resolve('public/tiktok-assets');
const RECORDINGS_TEMP = path.resolve('recordings-temp');
const DOWNLOADS_TARGET = '/Users/ding/Downloads/LOAS_TikTok_iPad_POV_Final.mp4';
const AUDIO_TRACK = path.join(OUTPUT_DIR, 'user_audio.mp3');

async function recordIpadStudio() {
  console.log('🚀 Merekam Video iPad Pro Apple Studio Edition (Clean Tablet UI + Dynamic Zoom)...');

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--allow-file-access-from-files',
      '--autoplay-policy=no-user-gesture-required',
      '--disable-web-security'
    ]
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
  console.log(`🌐 Membuka player iPad Studio: file://${HTML_FILE}`);
  await page.goto(`file://${HTML_FILE}`, { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  // Play video inside iPad screen
  await page.evaluate(() => {
    const vid = document.getElementById('ipadVideo');
    if (vid) {
      vid.muted = true;
      vid.currentTime = 0;
      vid.play().catch(e => console.log('play error:', e));
    }
  });

  console.log('🎥 Merekam alur 32.5 detik pergerakan kamera zoom iPad Pro...');
  await page.waitForTimeout(32500);

  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (video) {
    const rawPath = await video.path();
    const rawMp4 = path.join(OUTPUT_DIR, 'ipad_apple_studio_raw.mp4');

    console.log('⚙️ Mengonversi ke MP4 1080x1920 60FPS...');
    execSync(`ffmpeg -y -i "${rawPath}" -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -r 60 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black" "${rawMp4}"`, { stdio: 'inherit' });

    if (fs.existsSync(AUDIO_TRACK)) {
      console.log('🎵 Menggabungkan soundtrack audio...');
      execSync(`ffmpeg -y -i "${rawMp4}" -stream_loop -1 -i "${AUDIO_TRACK}" -c:v copy -c:a aac -shortest "${DOWNLOADS_TARGET}"`, { stdio: 'inherit' });
    } else {
      fs.copyFileSync(rawMp4, DOWNLOADS_TARGET);
    }

    console.log(`\n🎉 SUKSES BESAR! File video iPad Pro Apple Studio Edition telah tersimpan di:\n👉 ${DOWNLOADS_TARGET}`);
  }
}

recordIpadStudio().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
