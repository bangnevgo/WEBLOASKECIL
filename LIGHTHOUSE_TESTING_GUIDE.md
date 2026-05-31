# Lighthouse & Performance Optimization Guide

## Quick Start - Test Your SEO Changes

### 1. Build & Test Locally
```bash
# Install dependencies (if needed)
bun install

# Build the project
npm run build

# Run production server
npm run start
```

### 2. Test Sitemap & Robots
Open in browser:
- **Sitemap:** http://localhost:3000/sitemap.xml
- **Robots:** http://localhost:3000/robots.txt
- **Manifest:** http://localhost:3000/manifest.json

---

## Lighthouse Testing (Chrome DevTools)

### Step-by-Step:
1. **Open Chrome DevTools**
   - Press `F12` or `Cmd+Option+I` (Mac)

2. **Navigate to Lighthouse Tab**
   - If not visible, click `>> More tools > Lighthouse`

3. **Run Audit**
   - Select "Desktop" or "Mobile"
   - Choose categories: Performance, Accessibility, Best Practices, SEO
   - Click "Analyze page load"

4. **Interpret Results**
   - **90-100:** Green (Excellent)
   - **50-89:** Orange (Needs improvement)
   - **0-49:** Red (Critical issues)

### Target Scores:
- **SEO:** 100 ✅ (Already optimized)
- **Performance:** 90+ 
- **Accessibility:** 90+
- **Best Practices:** 90+

---

## Performance Optimization Tips

### Current Optimizations ✅
- [x] Compression enabled
- [x] Standalone Next.js output
- [x] Security headers
- [x] Image optimization ready

### Additional Optimizations (Optional)

#### 1. Image Optimization
```typescript
// In your components, use Next.js Image instead of <img>
import Image from 'next/image'

// Example:
<Image
  src="/community-cover.png"
  alt="Community"
  width={1200}
  height={630}
  priority // for above-fold images
/>
```

#### 2. Font Optimization
- Already implemented: Google Fonts with subsets
- Keep Outfit, Inter, Geist_Mono as primary fonts
- Minimize custom fonts

#### 3. CSS Optimization
- Tailwind CSS is already optimized
- Remove unused CSS in production build
- Current setup: Handles this automatically

#### 4. JavaScript Optimization
- Current: Already using Next.js code-splitting
- Lazy load components when appropriate
- Keep bundle size minimal

#### 5. Caching Strategy
```typescript
// Add to next.config.ts for static assets:
headers: async () => [
  {
    source: '/static/:path*',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ],
  },
]
```

---

## Core Web Vitals Monitoring

### Key Metrics:

#### 1. LCP (Largest Contentful Paint)
- **Target:** < 2.5 seconds
- **Optimize by:**
  - Lazy loading images
  - Reducing render-blocking JS/CSS
  - Improving server response time

#### 2. FID (First Input Delay)
- **Target:** < 100ms
- **Optimize by:**
  - Breaking up long JavaScript tasks
  - Using Web Workers for heavy computation
  - Optimizing third-party scripts

#### 3. CLS (Cumulative Layout Shift)
- **Target:** < 0.1
- **Optimize by:**
  - Adding size attributes to images
  - Avoiding unsized ads
  - Respecting user preferences for animations

---

## Production Testing Checklist

### Before Deployment:
- [ ] Build passes without errors: `npm run build`
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Lighthouse scores acceptable (90+ for performance)
- [ ] All pages load correctly
- [ ] Mobile responsive verified
- [ ] Internal links working
- [ ] External links tested

### Verify SEO Files:
```bash
# Check sitemap
curl https://loas.nevgoinstitute.com/sitemap.xml

# Check robots.txt
curl https://loas.nevgoinstitute.com/robots.txt

# Check manifest
curl https://loas.nevgoinstitute.com/manifest.json
```

---

## Google Search Console Setup

1. **Add Property:**
   - Go to https://search.google.com/search-console/about
   - Click "Start now"
   - Add property: https://loas.nevgoinstitute.com

2. **Verify Ownership:**
   - DNS TXT record (recommended)
   - Or upload verification file

3. **Submit Sitemap:**
   - Go to "Sitemaps" menu
   - Enter: `https://loas.nevgoinstitute.com/sitemap.xml`
   - Click "Submit"

4. **Monitor:**
   - Check "Coverage" for indexation errors
   - Review "Enhancements" for structured data issues
   - Monitor "Performance" for rankings

---

## Real-World Testing Tools

### Free Tools:
1. **Google PageSpeed Insights:** https://pagespeed.web.dev/
2. **SEO Test by SEOBILITY:** https://www.seobility.net/en/seocheck/
3. **Schema Markup Validator:** https://validator.schema.org/
4. **Structured Data Test Tool:** https://search.google.com/test/rich-results

### Steps:
1. Enter your URL
2. Run analysis
3. Fix issues found
4. Re-test to verify fixes

---

## Common Issues & Solutions

### Issue: Sitemap Not Found
**Solution:**
```bash
# Make sure sitemap.ts file exists
ls -la src/app/sitemap.ts

# Rebuild project
npm run build
npm run start
```

### Issue: Robots.txt Not Working
**Solution:**
1. Check both files exist:
   - `src/app/robots.ts` (dynamic)
   - `public/robots.txt` (fallback)
2. Verify domain in robots.txt
3. Test: `curl https://yourdomain.com/robots.txt`

### Issue: Structured Data Errors
**Solution:**
1. Validate at: https://validator.schema.org/
2. Check JSON syntax
3. Ensure all required fields present

---

## Monitoring & Maintenance

### Weekly:
- [ ] Check Search Console for errors
- [ ] Review crawl stats
- [ ] Monitor indexation rate

### Monthly:
- [ ] Check Core Web Vitals
- [ ] Review keyword rankings
- [ ] Analyze traffic trends
- [ ] Run Lighthouse audit

### Quarterly:
- [ ] Update structured data
- [ ] Refresh content
- [ ] Review backlink profile
- [ ] Analyze competitor SEO

---

## Environment Variables (Optional)

Add to `.env` for analytics:
```bash
# Google Analytics
NEXT_PUBLIC_GA_ID=GA_XXXXXXX

# Hotjar (User behavior)
NEXT_PUBLIC_HOTJAR_ID=XXXXXXXXX

# Microsoft Clarity
NEXT_PUBLIC_CLARITY_ID=XXXXXXXXXXXX
```

---

## Next Steps

1. ✅ All SEO files created
2. ✅ Metadata optimized
3. ⏳ **Next:** Build and test
4. ⏳ **Then:** Submit to Google/Bing
5. ⏳ **Finally:** Monitor rankings

---

## Questions?

For Lighthouse issues, check:
- Chrome DevTools Documentation: https://developer.chrome.com/docs/lighthouse
- Web.dev Guides: https://web.dev/performance/

For SEO help:
- Google Search Central: https://developers.google.com/search
- SEO Starter Guide: https://developers.google.com/search/docs/beginner/seo-starter-guide
