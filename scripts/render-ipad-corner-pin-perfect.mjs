import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const OUTPUT_DIR = path.resolve('public/tiktok-assets');
const DOWNLOADS_TARGET = '/Users/ding/Downloads/LOAS_TikTok_iPad_POV_Final.mp4';
const BG_IMAGE = path.join(OUTPUT_DIR, 'tablet_1080x1920.png');
const SCREEN_VIDEO = path.join(OUTPUT_DIR, 'LOAS_LIVE_TIKTOK_FINAL_SIAP_POST.mp4');
const AUDIO_TRACK = path.join(OUTPUT_DIR, 'user_audio.mp3');
const HAND_OVERLAY = path.join(OUTPUT_DIR, 'ipad_hand_cutout.png');

async function buildMasks() {
  console.log('📐 Membangun Hand Cutout & Bezel Layer...');
  const w = 1080;
  const h = 1920;

  const bg = sharp(BG_IMAGE);
  const { data, info } = await bg.raw().toBuffer({ resolveWithObject: true });
  const handBuf = Buffer.alloc(w * h * 4);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];

      // Hand/skin overlay logic
      const isRightHand = (x > 510 && y > 730 && r > g + 18 && g > b && r > 90);
      const isLeftThumb = (x < 310 && y > 700 && y < 920 && r > g + 15 && g > b);

      if (isRightHand || isLeftThumb) {
        handBuf[(y * w + x) * 4] = r;
        handBuf[(y * w + x) * 4 + 1] = g;
        handBuf[(y * w + x) * 4 + 2] = b;
        handBuf[(y * w + x) * 4 + 3] = 255;
      } else {
        handBuf[(y * w + x) * 4 + 3] = 0;
      }
    }
  }

  await sharp(handBuf, { raw: { width: w, height: h, channels: 4 } }).png().toFile(HAND_OVERLAY);
}

async function renderFullVideo() {
  await buildMasks();

  console.log('🎬 Merender Video dengan FFmpeg Perspective Corner Pinning & Multi-layer Matte...');

  const tempMp4 = path.join(OUTPUT_DIR, 'ipad_corner_pin_temp.mp4');

  // Filter Complex dengan parameter waktu durasi pasti -t 34.5
  const filter = [
    `[1:v]perspective=x0=220:y0=430:x1=760:y1=390:x2=330:y2=1040:x3=790:y3=900:sense=destination:interpolation=cubic[warped]`,
    `[0:v][warped]overlay=0:0[comp1]`,
    `[comp1][2:v]overlay=0:0[final]`
  ].join(';');

  const cmd = `ffmpeg -y -loop 1 -i "${BG_IMAGE}" -i "${SCREEN_VIDEO}" -loop 1 -i "${HAND_OVERLAY}" -filter_complex "${filter}" -map "[final]" -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p -r 60 -t 34.5 "${tempMp4}"`;

  console.log('⚙️ Menjalankan compositing FFmpeg...');
  execSync(cmd, { stdio: 'inherit' });

  if (fs.existsSync(AUDIO_TRACK)) {
    console.log('🎵 Menggabungkan soundtrack audio...');
    execSync(`ffmpeg -y -i "${tempMp4}" -stream_loop -1 -i "${AUDIO_TRACK}" -c:v copy -c:a aac -shortest "${DOWNLOADS_TARGET}"`, { stdio: 'inherit' });
  } else {
    fs.copyFileSync(tempMp4, DOWNLOADS_TARGET);
  }

  console.log(`\n🎉 SUKSES BESAR! File video iPad Pro dengan Corner Pin Presisi & Hand Matte siap di:\n👉 ${DOWNLOADS_TARGET}`);
}

renderFullVideo().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
