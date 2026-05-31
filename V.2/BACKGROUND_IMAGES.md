# Background Images - Hukum Asumsi

## Overview

Hukum Asumsi platform menggunakan AI-generated background images yang dirancang khusus untuk niche spiritual dan transformasi kesadaran. Setiap background dipilih untuk meningkatkan user experience dan menciptakan atmosphere yang inspiring.

## Generated Images

### 1. Hero Background (`/public/images/hero-bg.jpg`)

**Location**: Landing page hero section (`app/page.tsx`)

**Description**: Spiritual consciousness awakening theme dengan soft glowing lights, ethereal atmosphere

**Visual Elements**:
- Deep indigo dan purple color gradients
- Abstract light particles floating
- Cosmic energy visualization
- Professional cinematic lighting

**Use Case**: 
- Main hero section yang mengkomunikasikan essence dari platform
- Creates immediate emotional connection dengan spiritual mission

**Implementation**:
```tsx
<div 
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: 'url(/images/hero-bg.jpg)',
    backgroundAttachment: 'fixed'
  }}
/>
```

### 2. Auth Background (`/public/images/auth-bg.jpg`)

**Location**: Login dan Register pages (`app/auth/layout.tsx`)

**Description**: Serene meditation landscape dengan peaceful consciousness awakening theme

**Visual Elements**:
- Soft purple dan indigo gradient sky
- Glowing light orbs floating
- Spiritual transformation energy
- Minimalist abstract design

**Use Case**:
- Calming environment untuk authentication process
- Builds trust dan spiritual connection during signup/login
- Motivates users ke mulai transformation journey

**Implementation**:
```tsx
<div 
  className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden"
  style={{
    backgroundImage: 'url(/images/auth-bg.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  }}
>
  {/* Overlay gradient untuk readability */}
  <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-background/70 to-background/80"></div>
</div>
```

### 3. Dashboard Background (`/public/images/dashboard-bg.jpg`)

**Location**: Dashboard pages (`app/dashboard/layout.tsx`)

**Description**: Modern abstract consciousness visualization dengan elegant spiritual energy

**Visual Elements**:
- Deep purple dan indigo tones
- Spiritual energy flowing
- Light waves dan particles
- Subtle professional design

**Use Case**:
- Subtle yet inspiring background untuk learning environment
- Supports focus dan concentration
- Maintains professional appearance saat users belajar

**Implementation**:
```tsx
<div 
  className="relative min-h-screen"
  style={{
    backgroundImage: 'url(/images/dashboard-bg.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  }}
>
  {/* Background overlay */}
  <div className="fixed inset-0 bg-gradient-to-br from-background/80 via-background/85 to-background/90 pointer-events-none"></div>
</div>
```

## Design System Integration

### Color Palette

Semua backgrounds menggunakan color palette yang konsisten:
- **Primary**: Deep Indigo (#7C3AED)
- **Accent**: Vibrant Purple (#A855F7)
- **Supporting**: Various shades of purple, lavender, dan indigo

### Overlay Strategy

Untuk memastikan content readability:

1. **Landing Page**: Darker overlay dengan gradient
2. **Auth Pages**: Medium overlay (50-80% opacity)
3. **Dashboard**: Darker overlay untuk focus pada content

### Mobile Responsiveness

Semua backgrounds:
- ✅ Optimized untuk mobile screens
- ✅ Maintain aspect ratio pada berbagai screen sizes
- ✅ Use `background-attachment: fixed` untuk parallax effect (desktop)
- ✅ Fall back ke cover mode di mobile

## Performance Optimization

### Image Specifications

- **Format**: JPG (compressed)
- **Size**: Optimized untuk web
- **Dimensions**: High-resolution untuk quality
- **Compression**: Balance antara quality dan performance

### Loading Strategy

```tsx
// Lazy loading dengan background-image
style={{
  backgroundImage: 'url(/images/hero-bg.jpg)',
  backgroundAttachment: 'fixed' // Parallax effect
}}

// Mobile optimization (disable parallax)
@media (max-width: 768px) {
  backgroundAttachment: scroll;
}
```

## Alternative Background Options

### 1. Custom Photo Backgrounds

Jika ingin menggunakan custom photos:

```tsx
// Landscape/Cityscape option
backgroundImage: 'url(/images/landscape-bg.jpg)'

// Nature theme
backgroundImage: 'url(/images/nature-bg.jpg)'

// Abstract art
backgroundImage: 'url(/images/abstract-bg.jpg)'
```

### 2. Solid Gradient Backgrounds

Fallback tanpa images:

```tsx
className="bg-gradient-to-br from-primary/10 via-background to-accent/5"
```

### 3. Pattern Backgrounds

Dengan CSS patterns:

```tsx
className="bg-[linear-gradient(to_right,rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"
```

## Customization Guide

### Changing Backgrounds

Untuk mengganti background images:

1. **Generate new image**:
```bash
# Use GenerateImage tool dengan custom prompt
# Contoh:
"Professional technology background, blue and white colors, 
modern design, suitable for tech platform, 4K"
```

2. **Save ke public folder**:
```
/public/images/new-background.jpg
```

3. **Update components**:
```tsx
style={{
  backgroundImage: 'url(/images/new-background.jpg)',
}}
```

### Overlay Adjustment

Untuk mengubah darkness/brightness overlay:

```tsx
// Lighter overlay (lebih terang)
className="bg-gradient-to-br from-background/40 via-background/60 to-background/80"

// Darker overlay (lebih gelap)
className="bg-gradient-to-br from-background/70 via-background/85 to-background/95"
```

## Browser Support

- ✅ All modern browsers
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Fallback color untuk older browsers

## Best Practices

1. **Always use overlays** untuk memastikan text readability
2. **Test pada mobile** sebelum production
3. **Monitor performance** - jika images membuat loading time lama, optimize atau compress
4. **Keep consistent theme** - semua backgrounds harus cohesive dengan brand colors
5. **Consider accessibility** - ensure contrast ratios memenuhi WCAG standards

## Troubleshooting

### Background image tidak muncul?

```tsx
// Verify path is correct
backgroundImage: 'url(/images/hero-bg.jpg)' // ✅ Correct

// Check file exists
ls public/images/ # Should show hero-bg.jpg

// Verify styles are applied
// Inspect element di DevTools
```

### Performance issues?

1. Compress images menggunakan tools seperti TinyPNG
2. Use WebP format untuk browser yang support
3. Reduce image dimensions jika too large
4. Consider removing `background-attachment: fixed` untuk mobile

### Overlay too dark/light?

Adjust opacity values:

```tsx
// From: from-background/80
// Change to: from-background/60 (lighter)

// From: to-background/90
// Change to: to-background/75 (lighter)
```

## Future Enhancements

1. **Theme-based backgrounds**: Different backgrounds untuk light/dark mode
2. **Dynamic backgrounds**: Change backgrounds berdasarkan time of day
3. **User preferences**: Allow users customize backgrounds
4. **Animated backgrounds**: Subtle animations untuk more engagement
5. **Seasonal themes**: Different backgrounds untuk different seasons

## Asset Credits

Semua backgrounds di-generate menggunakan AI Image Generation tool dengan prompts yang disesuaikan untuk Hukum Asumsi branding dan spiritual niche.
