import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGlow" cx="50%" cy="30%" r="85%">
      <stop offset="0%" stop-color="#231a0e" />
      <stop offset="50%" stop-color="#0e0d0b" />
      <stop offset="100%" stop-color="#050505" />
    </radialGradient>
    
    <radialGradient id="goldSphere" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ffd27d" />
      <stop offset="45%" stop-color="#d4a053" />
      <stop offset="100%" stop-color="#8a5a1f" />
    </radialGradient>

    <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fdfbf7" />
      <stop offset="40%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#d4a053" />
    </linearGradient>

    <linearGradient id="badgeGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3d2a0f" />
      <stop offset="100%" stop-color="#1a1205" />
    </linearGradient>

    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="35" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="url(#bgGlow)" />

  <!-- Outer Border Frame -->
  <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="#d4a053" stroke-width="1.5" stroke-opacity="0.25" />
  <rect x="32" y="32" width="1136" height="566" rx="16" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.05" />

  <!-- Ambient Light Orbs -->
  <circle cx="1020" cy="180" r="180" fill="#d4a053" opacity="0.12" filter="url(#goldGlow)" />
  <circle cx="150" cy="500" r="140" fill="#d4a053" opacity="0.08" filter="url(#goldGlow)" />

  <!-- Left Content -->
  <!-- Badge -->
  <g transform="translate(80, 80)">
    <rect x="0" y="0" width="280" height="42" rx="21" fill="url(#badgeGold)" stroke="#d4a053" stroke-width="1.5" stroke-opacity="0.6" />
    <!-- Headphone Vector Icon -->
    <path d="M 28 26 A 9 9 0 0 1 46 26 V 30 H 43 A 2 2 0 0 1 41 28 V 24 A 2 2 0 0 1 43 22 H 45 A 8 8 0 0 0 29 22 H 31 A 2 2 0 0 1 33 24 V 28 A 2 2 0 0 1 31 30 H 28 Z" fill="#d4a053" />
    <text x="56" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="#d4a053" letter-spacing="1.5">
      AUDIO EKSKLUSIF LOAS
    </text>
  </g>

  <!-- Title -->
  <text x="80" y="195" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="52" font-weight="bold" fill="url(#goldText)" letter-spacing="-1">
    Tubuh Anda Ternyata
  </text>
  <text x="80" y="260" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="52" font-weight="bold" fill="#d4a053" letter-spacing="-1">
    Kecanduan Masa Lalu
  </text>

  <!-- Subtitle -->
  <text x="80" y="325" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="22" font-weight="normal" fill="#a3a3a3">
    Cara Memutus Respon Biologis Emosi Lama &amp; Mengizinkan Asumsi Mewujud
  </text>

  <!-- Feature Pills -->
  <g transform="translate(80, 385)">
    <!-- Pill 1: Duration -->
    <rect x="0" y="0" width="160" height="46" rx="10" fill="#141414" stroke="#262626" stroke-width="1.5" />
    <text x="24" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="15" font-weight="bold" fill="#e5e5e5">
      Durasi: 20 Menit
    </text>

    <!-- Pill 2: Speaker -->
    <rect x="175" y="0" width="190" height="46" rx="10" fill="#141414" stroke="#262626" stroke-width="1.5" />
    <text x="200" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="15" font-weight="bold" fill="#e5e5e5">
      Oleh: Bang Nevgo
    </text>

    <!-- Pill 3: Access -->
    <rect x="380" y="0" width="150" height="46" rx="10" fill="#141414" stroke="#d4a053" stroke-width="1.5" stroke-opacity="0.4" />
    <text x="405" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="15" font-weight="bold" fill="#d4a053">
      Akses Gratis
    </text>
  </g>

  <!-- Right Visual Illustration (Soundwave / Hologram) -->
  <g transform="translate(850, 160)">
    <circle cx="140" cy="140" r="130" fill="none" stroke="#d4a053" stroke-width="2" stroke-opacity="0.2" stroke-dasharray="8 8" />
    <circle cx="140" cy="140" r="105" fill="#110e09" stroke="#d4a053" stroke-width="1.5" stroke-opacity="0.4" />
    
    <circle cx="140" cy="140" r="60" fill="url(#goldSphere)" />
    <!-- Play Triangle -->
    <polygon points="132,120 132,160 160,140" fill="#0d0c0a" />

    <!-- Sound Wave Bars -->
    <rect x="30" y="125" width="8" height="30" rx="4" fill="#d4a053" opacity="0.6" />
    <rect x="45" y="110" width="8" height="60" rx="4" fill="#d4a053" opacity="0.8" />
    <rect x="60" y="130" width="8" height="20" rx="4" fill="#d4a053" opacity="0.5" />

    <rect x="212" y="130" width="8" height="20" rx="4" fill="#d4a053" opacity="0.5" />
    <rect x="227" y="105" width="8" height="70" rx="4" fill="#d4a053" opacity="0.8" />
    <rect x="242" y="125" width="8" height="30" rx="4" fill="#d4a053" opacity="0.6" />
  </g>

  <!-- Footer Info & Branding -->
  <line x1="80" y1="495" x2="1120" y2="495" stroke="#262626" stroke-width="1" />
  
  <text x="80" y="540" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="bold" fill="#d4a053" letter-spacing="1">
    NEVGO INSTITUTE · HUKUM ASUMSI SERIES
  </text>
  <text x="1120" y="540" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="500" fill="#737373">
    loas.nevgoinstitute.com
  </text>
</svg>
`;

async function main() {
  const outDir = path.resolve('public/images');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, 'og-tubuh-kecanduan-masa-lalu.png');
  await sharp(Buffer.from(svg))
    .png({ quality: 95 })
    .toFile(outPath);

  console.log('OG Image successfully created at:', outPath);
}

main().catch(err => {
  console.error('Error creating OG image:', err);
  process.exit(1);
});
