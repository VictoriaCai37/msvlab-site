# Ms V Lab - Image Management Guide

This guide explains how images work in this Astro-based review site and how to easily manage them when you get real affiliate images.

---

## 📁 Current Image Structure

```
public/images/
├── reviews/
│   ├── airpods-pro-2-usbc/
│   │   ├── hero.svg
│   │   ├── adaptive-audio.svg
│   │   ├── conversation.svg
│   │   └── usb-c-case.svg
│   ├── sony-wh-1000xm5/
│   │   ├── hero.svg
│   │   ├── anc-demo.svg
│   │   ├── comfort.svg
│   │   └── multipoint.svg
│   └── ... (20 review folders total)
├── best-products/
│   ├── best-headphones/
│   │   └── hero.svg
│   ├── best-laptops/
│   │   └── hero.svg
│   └── best-robot-vacuums/
│       └── hero.svg
└── deals/
    ├── macbook-air-m3-deal/
    │   └── hero.svg
    ├── roborock-s8-maxv-ultra-deal/
    │   └── hero.svg
    └── sony-wh-1000xm5-deal/
        └── hero.svg
```

---

## 🎯 How Images Are Referenced

Each content file (MDX) references images in its frontmatter:

```yaml
# Review example (src/content/reviews/sony-wh-1000xm5.mdx)
---
heroImage: "/images/reviews/sony-wh-1000xm5/hero.jpg"
heroAlt: "Sony WH-1000XM5 in Midnight Blue on a traveler's neck"
images:
  - src: "/images/reviews/sony-wh-1000xm5/anc-demo.jpg"
    alt: "Graph showing ANC performance across frequencies"
    caption: "Dual Processor (V1 + QN1) + 8 mics = best low-frequency isolation"
  - src: "/images/reviews/sony-wh-1000xm5/comfort.jpg"
    alt: "Side view showing soft leatherette earcups"
    caption: "New design: softer pads, stepless slider, 250g"
---

# Best Products example (src/content/best-products/best-headphones.mdx)
---
heroImage: "/images/best-products/best-headphones/hero.jpg"
products:
  - name: "Sony WH-1000XM5"
    image: "/images/reviews/sony-wh-1000xm5/hero.jpg"  # References review hero
---

# Deals example (src/content/deals/macbook-air-m3-deal.mdx)
---
heroImage: "/images/reviews/macbook-air-m3-13/hero.jpg"  # References review hero
```

**Key Point:** The file extension in frontmatter is `.jpg` but the actual files are `.svg` (placeholders). Astro/Vite handles the extension automatically.

---

## ✨ Replacing Placeholders with Real Images

### When You Get Affiliate Images

1. **Get your images** from affiliate programs (Amazon Associates, ShareASale, Impact, etc.)
2. **Resize to recommended dimensions:**
   - Hero images: **1200×675** (16:9) - used in article headers, cards, OG images
   - Detail images: **1200×675** (16:9) - used in article body
   - Thumbnail (optional): **400×300** - for small cards
3. **Use WebP format** for best performance (or JPG/PNG)
4. **Name files exactly** as the current `.svg` placeholders (just change extension)
5. **Drop into the same folders** - no code changes needed!

### Example: Replacing Sony WH-1000XM5 Images

```bash
# Current placeholder structure
public/images/reviews/sony-wh-1000xm5/
├── hero.svg          → replace with hero.webp (1200×675)
├── anc-demo.svg      → replace with anc-demo.webp (1200×675)
├── comfort.svg       → replace with comfort.webp (1200×675)
└── multipoint.svg    → replace with multipoint.webp (1200×675)
```

### No Code Changes Needed!

Because the frontmatter references use the path/filename (not extension), simply:
1. Delete the `.svg` file
2. Add your real image with the same base name (e.g., `hero.webp`)
3. The site will automatically use the new image

---

## 🛠️ Regenerating Placeholders

If you add new content or change frontmatter, regenerate placeholders:

```bash
node scripts/generate-placeholders.js
```

This reads all MDX frontmatter and creates matching SVG placeholders.

---

## 📐 Image Requirements

| Image Type | Dimensions | Format | Use Case |
|------------|------------|--------|----------|
| Hero | 1200×675 | WebP/JPG | Article header, OG image, cards |
| Detail | 1200×675 | WebP/JPG | In-article illustrations |
| Thumbnail | 400×300 | WebP/JPG | Small cards, related posts |
| Logo/Avatar | 32×32+ | SVG | Site logo, favicon |

### Quality Guidelines
- **Product shots**: Clean background, good lighting, multiple angles
- **Lifestyle shots**: Real usage context (person wearing headphones, laptop on desk)
- **Detail shots**: Close-ups of key features (ports, buttons, texture)
- **Comparison shots**: Side-by-side with competitors
- **File size**: < 200KB per image (WebP recommended)

---

## 🔧 Automating Image Downloads (Future)

When you have affiliate API access, you can create a script like:

```javascript
// scripts/fetch-affiliate-images.js
// Example structure for future automation

async function fetchFromAmazon(asin, savePath) {
  // Use Product Advertising API to get images
  // Download and resize to 1200x675
  // Save as WebP
}

async function fetchFromShareASale(merchantId, productId, savePath) {
  // Use ShareASale API
}

async function fetchFromImpact(programId, productId, savePath) {
  // Use Impact API
}
```

---

## 📝 Checklist for New Reviews

When adding a new review:

1. [ ] Create MDX file in `src/content/reviews/`
2. [ ] Add frontmatter with `heroImage`, `heroAlt`, `images[]`
3. [ ] Run `node scripts/generate-placeholders.js`
4. [ ] Verify images appear in `public/images/reviews/[slug]/`
5. [ ] Later: replace `.svg` with real affiliate images

---

## 🚀 Quick Commands

```bash
# Regenerate all placeholders
node scripts/generate-placeholders.js

# Check image count
find public/images -name "*.svg" | wc -l
find public/images -name "*.webp" | wc -l

# Build and test
npm run build
npm run preview
```

---

## 📞 Need Help?

- Check `scripts/generate-placeholders.js` for the generation logic
- Frontmatter schema in `src/content/config.ts`
- Image components in `src/components/` (ProductCard, etc.)

The system is designed so **you only manage image files** - no code changes when swapping placeholders for real affiliate images!
