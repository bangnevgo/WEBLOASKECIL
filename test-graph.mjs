import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
console.log('Page loaded');

// Wait for ECharts to load and render
await page.waitForTimeout(5000);

// Check DOM for the graph view section
const graphSection = await page.evaluate(() => {
  const allSections = document.querySelectorAll('section');
  for (const s of allSections) {
    const outer = s.outerHTML;
    if (outer.includes('0F172A') || outer.includes('Neville Goddard')) {
      return {
        exists: true,
        id: s.id,
        className: s.className.substring(0, 100),
        innerText: s.innerText.substring(0, 200)
      };
    }
  }
  return { exists: false };
});
console.log('Graph section:', JSON.stringify(graphSection, null, 2));

// Check canvas
const hasCanvas = await page.evaluate(() => document.querySelectorAll('canvas').length);
console.log('Canvas count:', hasCanvas);

// Check key text
const text = await page.evaluate(() => document.body.innerText);
console.log('Has "Second Brain":', text.includes('Second Brain'));
console.log('Has "Neville Goddard — Second Brain":', text.includes('Neville Goddard — Second Brain'));

// Full page screenshot
await page.screenshot({ path: 'graph-view-fullpage.png', fullPage: true });
console.log('Full page screenshot saved');

// Scroll to graph section and screenshot viewport
const scrollY = await page.evaluate(() => {
  const allSections = document.querySelectorAll('section');
  for (const s of allSections) {
    if (s.outerHTML.includes('0F172A')) {
      const rect = s.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + rect.top - 50);
      return window.scrollY;
    }
  }
  return -1;
});
console.log('Scrolled to Y:', scrollY);

await page.waitForTimeout(1500);
await page.screenshot({ path: 'graph-view-viewport.png' });
console.log('Viewport screenshot saved at graph section');

// Take screenshot of just the graph section element
try {
  const sections = await page.locator('section').all();
  for (const s of sections) {
    const outer = await s.evaluate(el => el.outerHTML);
    if (outer.includes('0F172A') || outer.includes('Neville Goddard')) {
      await s.screenshot({ path: 'graph-view-element.png' });
      console.log('Graph element screenshot saved');
      break;
    }
  }
} catch (e) {
  console.log('Element screenshot failed:', e.message);
}

await browser.close();
