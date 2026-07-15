import { chromium } from 'playwright';

async function run() {
  console.log('Starting screenshot script...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:3033...');
  await page.goto('http://localhost:3033', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('Clicking on Pabrik Konten menu...');
  // Temukan elemen menu berdasarkan teks
  const menuBtn = page.locator('button:has-text("Pabrik Konten")');
  await menuBtn.click();
  console.log('Clicked, waiting for content and iframe to render...');
  await page.waitForTimeout(8000); // Tunggu agak lama agar server Next.js port 3005 rendering selesai

  const screenshotPath = '/Users/ding/.gemini/antigravity/brain/e43c79b9-1c1a-463e-94e7-982a1ccea47c/pabrik_konten_screenshot.png';
  console.log(`Taking screenshot and saving to: ${screenshotPath}`);
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Screenshot saved successfully.');

  await browser.close();
}

run().catch(err => {
  console.error('Screenshot failed:', err);
  process.exit(1);
});
