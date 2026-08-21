import sharp from 'sharp';

async function calibrate() {
  const image = sharp('public/tiktok-assets/tablet_1080x1920.png');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  // Let us inspect the exact pixel colors along the iPad inner bezel borders
  // In the photo (tablet_1080x1920.png):
  // Let us find the boundary where the dark iPad bezel transitions into the screen glass.
  console.log('Image dimensions:', w, 'x', h);

  // Top edge search (around y = 430 - 490):
  // Let us find the transition points for x = 300, 400, 500, 600, 700
  for (let x of [300, 400, 500, 600, 700]) {
    let topBezel = -1;
    for (let y = 350; y < 550; y++) {
      const idx = (y * w + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // Bezel is dark grey (r < 80), screen is light or drawing (r > 130)
      if (r > 120 && g > 120 && b > 120) {
        topBezel = y;
        break;
      }
    }
    console.log(`Top edge at x=${x} -> y=${topBezel}`);
  }

  // Bottom edge search (around y = 850 - 1050):
  for (let x of [400, 500, 600, 700]) {
    let bottomBezel = -1;
    for (let y = 800; y < 1100; y++) {
      const idx = (y * w + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (r < 100 && g < 100 && b < 100) {
        bottomBezel = y;
        break;
      }
    }
    console.log(`Bottom edge at x=${x} -> y=${bottomBezel}`);
  }

  // Left edge search (around x = 200 - 350):
  for (let y of [500, 600, 700, 800, 900]) {
    let leftBezel = -1;
    for (let x = 150; x < 400; x++) {
      const idx = (y * w + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (r > 120 && g > 120 && b > 120) {
        leftBezel = x;
        break;
      }
    }
    console.log(`Left edge at y=${y} -> x=${leftBezel}`);
  }

  // Right edge search (around x = 700 - 850):
  for (let y of [500, 600, 700, 800, 900]) {
    let rightBezel = -1;
    for (let x = 650; x < 850; x++) {
      const idx = (y * w + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (r < 100 && g < 100 && b < 100) {
        rightBezel = x;
        break;
      }
    }
    console.log(`Right edge at y=${y} -> x=${rightBezel}`);
  }
}

calibrate();
