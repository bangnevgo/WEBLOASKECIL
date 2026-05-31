import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const OUT = 'public/screenshots';

async function screenshot(page, name, opts = {}) {
  const path = `${OUT}/${name}.png`;
  await page.screenshot({ path, fullPage: opts.fullPage ?? false });
  console.log(`  ✅ ${path}`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  // ── 1. Hero section ──
  console.log('📸 Hero section');
  const hero = await ctx.newPage();
  await hero.goto(BASE, { waitUntil: 'networkidle' });
  await hero.waitForTimeout(1000);
  await hero.waitForSelector('.nv-hero', { timeout: 5000 });
  await hero.locator('.nv-hero').screenshot({ path: `${OUT}/hero.png` });
  console.log('  ✅ hero.png');
  await hero.close();

  // ── 2. Full landing page ──
  console.log('📸 Full landing page');
  const landing = await ctx.newPage();
  await landing.goto(BASE, { waitUntil: 'networkidle' });
  await landing.waitForTimeout(1000);
  await screenshot(landing, 'landing-full', { fullPage: true });
  await landing.close();

  // ── 3. Pricing page ──
  console.log('📸 Pricing page');
  const pricing = await ctx.newPage();
  await pricing.goto(BASE, { waitUntil: 'networkidle' });
  await pricing.waitForTimeout(500);
  // Use the exposed store to navigate to pricing view
  await pricing.evaluate(() => {
    window.__useAppStore.getState().setView('pricing');
  });
  await pricing.waitForTimeout(1500);
  await screenshot(pricing, 'pricing', { fullPage: true });
  await pricing.close();

  // ── 4. Community page ──
  console.log('📸 Community page');
  const community = await ctx.newPage();
  await community.goto(`${BASE}/community`, { waitUntil: 'networkidle' });
  await community.waitForTimeout(1000);
  await screenshot(community, 'community', { fullPage: true });
  await community.close();

  // ── 5. Dashboard (curriculum) page ──
  console.log('📸 Dashboard page');
  const dash = await ctx.newPage();
  // Set admin + master tier in localStorage before loading
  await dash.goto(BASE, { waitUntil: 'networkidle' });
  await dash.waitForTimeout(500);
  // Now navigate to dashboard via store
  await dash.evaluate(() => {
    window.__useAppStore.getState().setView('dashboard');
  });
  await dash.waitForTimeout(1500);
  await screenshot(dash, 'dashboard', { fullPage: true });
  await dash.close();

  await browser.close();
  console.log('\n🎉 All screenshots taken in public/screenshots/');
}

main().catch((err) => {
  console.error('Screenshot failed:', err);
  process.exit(1);
});
