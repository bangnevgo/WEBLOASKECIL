import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = path.resolve('public/tiktok-assets');
const DOWNLOADS_TARGET = '/Users/ding/Downloads/LOAS_TikTok_iPad_POV_Final.mp4';
const BG_IMAGE = path.join(OUTPUT_DIR, 'tablet_1080x1920.png');
const MATTE_IMAGE = path.join(OUTPUT_DIR, 'ipad_foreground_matte.png');
const SCREEN_VIDEO = path.join(OUTPUT_DIR, 'LOAS_LIVE_TIKTOK_FINAL_SIAP_POST.mp4');
const AUDIO_TRACK = path.join(OUTPUT_DIR, 'user_audio.mp3');

async function renderCornerPinnedVideo() {
  console.log('🚀 Merender Video iPad Pro POV dengan True Corner-Pinning & Alpha Matte...');

  const tempVideo = path.join(OUTPUT_DIR, 'ipad_perfect_corner_pin_temp.mp4');

  // FFmpeg Filter Complex:
  // 1. Warp input video ke 4 sudut layar iPad:
  //    TL=(246, 460), TR=(764, 412), BL=(330, 1045), BR=(782, 912)
  // 2. Tempelkan video yang sudah di-warp ke background foto tablet
  // 3. Tempelkan matte jari/tangan di atasnya agar jari berada di atas layar kaca
  const filter = `[1:v]perspective=x0=246:y0=460:x1=764:y1=412:x2=330:y2=1045:x3=782:y3=912:sense=destination:interpolation=cubic[warped];[0:v][warped]overlay=0:0:shortest=1[base];[base][2:v]overlay=0:0[final]`;

  const cmd = `ffmpeg -y -loop 1 -i "${BG_IMAGE}" -i "${SCREEN_VIDEO}" -loop 1 -i "${MATTE_IMAGE}" -filter_complex "${filter}" -map "[final]" -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -r 60 -shortest "${tempVideo}"`;

  console.log('⚙️ Menjalankan rendering compositing 3-layer...');
  execSync(cmd, { stdio: 'inherit' });

  if (fs.existsSync(AUDIO_TRACK)) {
    console.log('🎵 Menggabungkan audio soundtrack...');
    execSync(`ffmpeg -y -i "${tempVideo}" -stream_loop -1 -i "${AUDIO_TRACK}" -c:v copy -c:a aac -shortest "${DOWNLOADS_TARGET}"`, { stdio: 'inherit' });
  } else {
    fs.copyFileSync(tempVideo, DOWNLOADS_TARGET);
  }

  console.log(`\n🎉 SUKSES BESAR! File video iPad Pro True Corner-Pinned telah siap di:\n👉 ${DOWNLOADS_TARGET}`);
}

renderCornerPinnedVideo().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
