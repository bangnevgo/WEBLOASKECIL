import { execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const INPUT_VIDEO = path.resolve('public/tiktok-assets/loas_tiktok_raw_9x16.mp4');
const OUTPUT_FINAL = path.resolve('public/tiktok-assets/loas_tiktok_FINAL_READY_TO_POST.mp4');
const FONT_PATH = '/System/Library/Fonts/Supplemental/Arial Bold.ttf';

if (!fs.existsSync(INPUT_VIDEO)) {
  console.error('File video raw belum ditemukan:', INPUT_VIDEO);
  process.exit(1);
}

// Format drawtext filters with proper escaping
const filters = [
  // Scene 1: 0 - 3s (Hook)
  `drawtext=fontfile='${FONT_PATH}':text='BELAJAR MANIFESTASI':fontsize=52:fontcolor=white:box=1:boxcolor=black@0.8:boxborderw=24:x=(w-text_w)/2:y=h*0.38:enable='between(t,0,3)'`,
  `drawtext=fontfile='${FONT_PATH}':text='JANGAN CUMA DARI POTONGAN KONTEN':fontsize=44:fontcolor=0xd4af37:box=1:boxcolor=black@0.9:boxborderw=20:x=(w-text_w)/2:y=h*0.44:enable='between(t,0.5,3)'`,

  // Scene 2: 3 - 6s (Masalah 1)
  `drawtext=fontfile='${FONT_PATH}':text='Banyak orang langsung praktik...':fontsize=48:fontcolor=white:box=1:boxcolor=black@0.8:boxborderw=24:x=(w-text_w)/2:y=h*0.40:enable='between(t,3,6)'`,

  // Scene 3: 6 - 10s (Masalah 2)
  `drawtext=fontfile='${FONT_PATH}':text='Tapi tidak memahami':fontsize=46:fontcolor=white:box=1:boxcolor=black@0.8:boxborderw=20:x=(w-text_w)/2:y=h*0.38:enable='between(t,6,10)'`,
  `drawtext=fontfile='${FONT_PATH}':text='TEORINYA DENGAN BENAR':fontsize=52:fontcolor=0xd4af37:box=1:boxcolor=black@0.9:boxborderw=24:x=(w-text_w)/2:y=h*0.44:enable='between(t,6.5,10)'`,

  // Scene 4: 10 - 13s (Konsekuensi)
  `drawtext=fontfile='${FONT_PATH}':text='Saat muncul hambatan...':fontsize=46:fontcolor=white:box=1:boxcolor=black@0.8:boxborderw=20:x=(w-text_w)/2:y=h*0.38:enable='between(t,10,13)'`,
  `drawtext=fontfile='${FONT_PATH}':text='Akhirnya bingung harus bagaimana':fontsize=44:fontcolor=0xff7777:box=1:boxcolor=black@0.9:boxborderw=20:x=(w-text_w)/2:y=h*0.44:enable='between(t,10.5,13)'`,

  // Scene 5: 13 - 18s (Pembeda)
  `drawtext=fontfile='${FONT_PATH}':text='Materi ini disusun dari':fontsize=42:fontcolor=white:box=1:boxcolor=black@0.8:boxborderw=18:x=(w-text_w)/2:y=h*0.36:enable='between(t,13,18)'`,
  `drawtext=fontfile='${FONT_PATH}':text='PENGALAMAN MEMBIMBING':fontsize=50:fontcolor=0xd4af37:box=1:boxcolor=black@0.9:boxborderw=22:x=(w-text_w)/2:y=h*0.41:enable='between(t,13.3,18)'`,
  `drawtext=fontfile='${FONT_PATH}':text='(Bukan sekadar rangkuman buku)':fontsize=38:fontcolor=0xcccccc:box=1:boxcolor=black@0.8:boxborderw=16:x=(w-text_w)/2:y=h*0.47:enable='between(t,14,18)'`,

  // Scene 6: 18 - 23s (Bukti Produk)
  `drawtext=fontfile='${FONT_PATH}':text='10 MODUL • 49 PELAJARAN':fontsize=54:fontcolor=0xd4af37:box=1:boxcolor=black@0.9:boxborderw=26:x=(w-text_w)/2:y=h*0.39:enable='between(t,18,23)'`,
  `drawtext=fontfile='${FONT_PATH}':text='Tersusun Bertahap & Terstruktur':fontsize=42:fontcolor=white:box=1:boxcolor=black@0.8:boxborderw=18:x=(w-text_w)/2:y=h*0.46:enable='between(t,18.5,23)'`,

  // Scene 7: 23 - 26s (Penawaran)
  `drawtext=fontfile='${FONT_PATH}':text='Dapatkan Sekarang:':fontsize=42:fontcolor=white:box=1:boxcolor=black@0.8:boxborderw=18:x=(w-text_w)/2:y=h*0.38:enable='between(t,23,26)'`,
  `drawtext=fontfile='${FONT_PATH}':text='FREE AKSES KE SELURUH MATERI':fontsize=48:fontcolor=0xd4af37:box=1:boxcolor=black@0.9:boxborderw=24:x=(w-text_w)/2:y=h*0.44:enable='between(t,23.3,26)'`,

  // Scene 8: 26 - 35s (CTA Final)
  `drawtext=fontfile='${FONT_PATH}':text='KLIK LINK DI BIO':fontsize=60:fontcolor=0xd4af37:box=1:boxcolor=black@0.95:boxborderw=28:x=(w-text_w)/2:y=h*0.36:enable='gte(t,26)'`,
  `drawtext=fontfile='${FONT_PATH}':text='Daftar Free -> Buka 10 Modul':fontsize=44:fontcolor=white:box=1:boxcolor=black@0.9:boxborderw=22:x=(w-text_w)/2:y=h*0.43:enable='gte(t,26.5)'`
].join(',');

console.log('🎬 Merender Video Final TikTok dengan Teks Kinetik & Safe Area...');

const args = [
  '-y',
  '-i', INPUT_VIDEO,
  '-vf', filters,
  '-c:v', 'libx264',
  '-preset', 'medium',
  '-crf', '17',
  '-pix_fmt', 'yuv420p',
  '-r', '60',
  OUTPUT_FINAL
];

try {
  execFileSync('ffmpeg', args, { stdio: 'inherit' });
  console.log(`\n🎉 SUKSES! Video Final Siap Upload: ${OUTPUT_FINAL}`);
} catch (err) {
  console.error('Gagal render:', err);
  process.exit(1);
}
