#!/usr/bin/env node
/**
 * Generate photorealistic SVG placeholders for all review/best-products/deals content
 * Run: node scripts/generate-placeholders.js
 */

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

// Product-specific SVG drawings for each category
const PRODUCT_SVGS = {
  // Audio - headphones
  headphones: (colors) => `
    <g transform="translate(600, 337) scale(1.2)">
      <!-- Headband -->
      <path d="M-80,-40 Q0,-100 80,-40" stroke="${colors.accent}" stroke-width="8" fill="none" stroke-linecap="round" filter="url(#shadow)"/>
      <!-- Ear cups -->
      <circle cx="-80" cy="-40" r="35" fill="${colors.dark}" filter="url(#shadow)"/>
      <circle cx="-80" cy="-40" r="28" fill="${colors.mid}"/>
      <circle cx="-80" cy="-40" r="18" fill="${colors.light}" opacity="0.3"/>
      <circle cx="80" cy="-40" r="35" fill="${colors.dark}" filter="url(#shadow)"/>
      <circle cx="80" cy="-40" r="28" fill="${colors.mid}"/>
      <circle cx="80" cy="-40" r="18" fill="${colors.light}" opacity="0.3"/>
      <!-- Ear pads detail -->
      <ellipse cx="-80" cy="-40" rx="30" ry="22" fill="none" stroke="${colors.highlight}" stroke-width="1.5" opacity="0.6"/>
      <ellipse cx="80" cy="-40" rx="30" ry="22" fill="none" stroke="${colors.highlight}" stroke-width="1.5" opacity="0.6"/>
      <!-- Hinge details -->
      <rect x="-95" y="-50" width="12" height="20" rx="3" fill="${colors.dark}" filter="url(#shadow)"/>
      <rect x="83" y="-50" width="12" height="20" rx="3" fill="${colors.dark}" filter="url(#shadow)"/>
    </g>
  `,

  // Audio - earbuds/TWS
  earbuds: (colors) => `
    <g transform="translate(600, 337) scale(1.5)">
      <!-- Case -->
      <rect x="-60" y="-25" width="120" height="50" rx="15" fill="${colors.dark}" filter="url(#shadow)"/>
      <rect x="-55" y="-20" width="110" height="40" rx="10" fill="${colors.mid}"/>
      <!-- Earbuds in case -->
      <ellipse cx="-25" cy="0" rx="18" ry="12" fill="${colors.dark}" filter="url(#shadow)"/>
      <ellipse cx="-25" cy="0" rx="14" ry="9" fill="${colors.mid}"/>
      <ellipse cx="25" cy="0" rx="18" ry="12" fill="${colors.dark}" filter="url(#shadow)"/>
      <ellipse cx="25" cy="0" rx="14" ry="9" fill="${colors.mid}"/>
      <!-- LED indicator -->
      <circle cx="0" cy="-30" r="4" fill="${colors.accent}" filter="url(#glow)"/>
      <!-- Hinge line -->
      <line x1="0" y1="-45" x2="0" y2="45" stroke="${colors.dark}" stroke-width="1" stroke-dasharray="4,4" opacity="0.5"/>
    </g>
  `,

  // Computing - laptop
  laptop: (colors) => `
    <g transform="translate(600, 337) scale(1.1)">
      <!-- Screen -->
      <rect x="-100" y="-120" width="200" height="130" rx="4" fill="${colors.dark}" filter="url(#shadow)"/>
      <rect x="-92" y="-112" width="184" height="114" rx="2" fill="#0a0f1a"/>
      <!-- Screen content reflection -->
      <rect x="-92" y="-112" width="184" height="57" rx="2" fill="${colors.accent}" opacity="0.05"/>
      <!-- Keyboard deck -->
      <rect x="-110" y="15" width="220" height="35" rx="4" fill="${colors.dark}" filter="url(#shadow)"/>
      <rect x="-100" y="20" width="200" height="25" rx="2" fill="${colors.mid}"/>
      <!-- Keys hint -->
      ${Array.from({length: 5}, (_, i) => 
        Array.from({length: 12}, (_, j) => 
          `<rect x="${-90 + j * 16}" y="${25 + i * 4}" width="12" height="3" rx="1" fill="${colors.dark}" opacity="0.7"/>`
        ).join('')
      ).join('')}
      <!-- Trackpad -->
      <rect x="-30" y="55" width="60" height="40" rx="4" fill="${colors.mid}"/>
      <!-- Hinge -->
      <rect x="-10" y="10" width="20" height="8" rx="2" fill="${colors.dark}"/>
    </g>
  `,

  // Computing - keyboard
  keyboard: (colors) => `
    <g transform="translate(600, 337) scale(1.3)">
      <!-- Base -->
      <rect x="-130" y="-30" width="260" height="60" rx="6" fill="${colors.dark}" filter="url(#shadow)"/>
      <rect x="-120" y="-20" width="240" height="40" rx="4" fill="${colors.mid}"/>
      <!-- Keys -->
      ${Array.from({length: 4}, (_, row) => 
        Array.from({length: 14}, (_, col) => {
          const x = -110 + col * 18;
          const y = -15 + row * 10;
          const isLarge = (row === 3 && (col === 0 || col === 13));
          const w = isLarge ? 30 : 14;
          return `<rect x="${x}" y="${y}" width="${w}" height="8" rx="2" fill="${colors.dark}" filter="url(#shadow)"/>`;
        }).join('')
      ).join('')}
      <!-- Space bar -->
      <rect x="-50" y="25" width="100" height="8" rx="2" fill="${colors.dark}" filter="url(#shadow)"/>
      <!-- Cable -->
      <path d="M-140,-30 Q-160,-50 -150,-80" stroke="${colors.mid}" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>
  `,

  // Computing - mouse
  mouse: (colors) => `
    <g transform="translate(600, 337) scale(1.8)">
      <!-- Mouse body -->
      <ellipse cx="0" cy="10" rx="35" ry="50" fill="${colors.dark}" filter="url(#shadow)"/>
      <ellipse cx="0" cy="5" rx="30" ry="45" fill="${colors.mid}"/>
      <!-- Buttons -->
      <ellipse cx="-15" cy="-15" rx="20" ry="25" fill="${colors.mid}" filter="url(#shadow)"/>
      <ellipse cx="15" cy="-15" rx="20" ry="25" fill="${colors.mid}" filter="url(#shadow)"/>
      <!-- Scroll wheel -->
      <rect x="-5" y="-25" width="10" height="8" rx="2" fill="${colors.accent}" filter="url(#glow)"/>
      <!-- Sensor glow -->
      <circle cx="0" cy="45" r="8" fill="${colors.accent}" opacity="0.3" filter="url(#glow)"/>
    </g>
  `,

  // Smart home - robot vacuum
  robot: (colors) => `
    <g transform="translate(600, 337) scale(1.2)">
      <!-- Main body -->
      <circle cx="0" cy="0" r="70" fill="${colors.dark}" filter="url(#shadow)"/>
      <circle cx="0" cy="0" r="60" fill="${colors.mid}"/>
      <!-- Top cover -->
      <ellipse cx="0" cy="-10" rx="55" ry="50" fill="none" stroke="${colors.highlight}" stroke-width="2" opacity="0.4"/>
      <!-- LIDAR turret -->
      <circle cx="0" cy="-20" r="18" fill="${colors.dark}" filter="url(#shadow)"/>
      <circle cx="0" cy="-20" r="12" fill="${colors.accent}" opacity="0.3" filter="url(#glow)"/>
      <circle cx="0" cy="-20" r="6" fill="${colors.accent}" opacity="0.6"/>
      <!-- Bumper -->
      <ellipse cx="0" cy="55" rx="65" ry="15" fill="${colors.dark}" opacity="0.7" filter="url(#shadow)"/>
      <!-- Wheels -->
      <ellipse cx="-55" cy="45" rx="15" ry="10" fill="${colors.dark}" filter="url(#shadow)"/>
      <ellipse cx="55" cy="45" rx="15" ry="10" fill="${colors.dark}" filter="url(#shadow)"/>
      <!-- Brushes -->
      <g stroke="${colors.accent}" stroke-width="3" fill="none" opacity="0.6">
        <line x1="-45" y1="60" x2="-55" y2="75"/>
        <line x1="-40" y1="60" x2="-48" y2="75"/>
        <line x1="45" y1="60" x2="55" y2="75"/>
        <line x1="40" y1="60" x2="48" y2="75"/>
      </g>
    </g>
  `,

  // Smart home - smart speaker
  speaker: (colors) => `
    <g transform="translate(600, 337) scale(1.3)">
      <!-- Body -->
      <rect x="-45" y="-80" width="90" height="100" rx="20" fill="${colors.dark}" filter="url(#shadow)"/>
      <rect x="-40" y="-75" width="80" height="90" rx="16" fill="${colors.mid}"/>
      <!-- Fabric texture -->
      ${Array.from({length: 30}, (_, i) => 
        `<line x1="-35" y1="${-70 + i * 3}" x2="35" y2="${-70 + i * 3}" stroke="${colors.dark}" stroke-width="0.5" opacity="0.1"/>`
      ).join('')}
      <!-- LED ring -->
      <circle cx="0" cy="-20" r="18" fill="none" stroke="${colors.accent}" stroke-width="3" filter="url(#glow)"/>
      <circle cx="0" cy="-20" r="14" fill="none" stroke="${colors.accent}" stroke-width="1" opacity="0.4"/>
      <!-- Buttons on top -->
      <circle cx="-18" cy="-65" r="5" fill="${colors.dark}" filter="url(#shadow)"/>
      <circle cx="0" cy="-65" r="5" fill="${colors.dark}" filter="url(#shadow)"/>
      <circle cx="18" cy="-65" r="5" fill="${colors.dark}" filter="url(#shadow)"/>
      <!-- Base -->
      <ellipse cx="0" cy="35" rx="50" ry="8" fill="${colors.dark}" opacity="0.5"/>
    </g>
  `,

  // Smart home - smart lock
  lock: (colors) => `
    <g transform="translate(600, 337) scale(1.5)">
      <!-- Outer ring -->
      <circle cx="0" cy="0" r="50" fill="${colors.dark}" filter="url(#shadow)"/>
      <circle cx="0" cy="0" r="42" fill="${colors.mid}"/>
      <!-- Keypad area -->
      <rect x="-30" y="-40" width="60" height="55" rx="8" fill="${colors.dark}" opacity="0.8" filter="url(#shadow)"/>
      <!-- Keys -->
      ${Array.from({length: 4}, (_, row) => 
        Array.from({length: 3}, (_, col) => 
          `<rect x="${-20 + col * 13}" y="${-35 + row * 12}" width="10" height="10" rx="2" fill="${colors.mid}" filter="url(#shadow)"/>`
        ).join('')
      ).join('')}
      <!-- Deadbolt -->
      <rect x="-8" y="20" width="16" height="30" rx="3" fill="${colors.dark}" filter="url(#shadow)"/>
      <rect x="-5" y="23" width="10" height="24" rx="2" fill="${colors.mid}"/>
      <!-- Status LED -->
      <circle cx="0" cy="-50" r="4" fill="${colors.accent}" filter="url(#glow)"/>
    </g>
  `,

  // Smart home - thermostat
  thermostat: (colors) => `
    <g transform="translate(600, 337) scale(1.6)">
      <!-- Outer ring -->
      <circle cx="0" cy="0" r="55" fill="${colors.dark}" filter="url(#shadow)"/>
      <circle cx="0" cy="0" r="48" fill="${colors.mid}"/>
      <!-- Display -->
      <circle cx="0" cy="0" r="35" fill="#0a0f1a"/>
      <!-- Temperature -->
      <text x="0" y="5" text-anchor="middle" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="${colors.accent}">22°</text>
      <text x="0" y="22" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="${colors.mid}">Target 21°</text>
      <!-- Ring indicator -->
      <circle cx="0" cy="0" r="42" fill="none" stroke="${colors.accent}" stroke-width="4" stroke-dasharray="180,200" filter="url(#glow)"/>
      <!-- Outer dial texture -->
      ${Array.from({length: 60}, (_, i) => {
        const angle = (i * 6 - 90) * Math.PI / 180;
        const r1 = 50, r2 = 55;
        return `<line x1="${Math.cos(angle) * r1}" y1="${Math.sin(angle) * r1}" x2="${Math.cos(angle) * r2}" y2="${Math.sin(angle) * r2}" stroke="${colors.highlight}" stroke-width="1" opacity="0.3"/>`;
      }).join('')}
    </g>
  `,

  // Default generic product
  default: (colors) => `
    <g transform="translate(600, 337) scale(1.2)">
      <!-- Product box -->
      <rect x="-60" y="-80" width="120" height="160" rx="8" fill="${colors.dark}" filter="url(#shadow)"/>
      <rect x="-50" y="-70" width="100" height="140" rx="6" fill="${colors.mid}"/>
      <!-- Top face -->
      <path d="M-50,-70 L-60,-80 L60,-80 L50,-70 Z" fill="${colors.dark}" opacity="0.3"/>
      <!-- Front label area -->
      <rect x="-30" y="-30" width="60" height="40" rx="4" fill="${colors.dark}" opacity="0.2"/>
      <text x="0" y="-10" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="${colors.accent}">Ms V Lab</text>
      <!-- Highlight lines -->
      <line x1="-40" y1="-60" x2="40" y2="-60" stroke="${colors.highlight}" stroke-width="1" opacity="0.4"/>
      <line x1="-40" y1="60" x2="40" y2="60" stroke="${colors.highlight}" stroke-width="1" opacity="0.4"/>
    </g>
  `
};

// Category color schemes with more depth
const CATEGORY_COLORS = {
  audio: { 
    bg: '#0f172a', dark: '#1e293b', mid: '#334155', light: '#64748b', 
    accent: '#3b82f6', highlight: '#93c5fd', text: '#e2e8f0' 
  },
  computing: { 
    bg: '#0f172a', dark: '#1e293b', mid: '#334155', light: '#64748b', 
    accent: '#3b82f6', highlight: '#93c5fd', text: '#e2e8f0' 
  },
  'smart-home': { 
    bg: '#052e16', dark: '#064e1b', mid: '#166534', light: '#22c55e', 
    accent: '#22c55e', highlight: '#86efac', text: '#dcfce7' 
  },
  default: { 
    bg: '#0f172a', dark: '#1e293b', mid: '#334155', light: '#64748b', 
    accent: '#3b82f6', highlight: '#93c5fd', text: '#e2e8f0' 
  }
};

function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
}

function getProductIcon(title, tags = []) {
  const text = (title + ' ' + tags.join(' ')).toLowerCase();
  
  // More specific product type detection
  if (text.includes('earbuds') || text.includes('airpods') || text.includes('tw4') || text.includes('momentum') || text.includes('tw ') || (text.includes('wireless') && text.includes('ear'))) return 'earbuds';
  if (text.includes('headphones') || text.includes('headphone') || text.includes('wh-1000') || text.includes('qc ultra') || text.includes('over-ear') || text.includes('over ear')) return 'headphones';
  if (text.includes('macbook') || text.includes('laptop') || text.includes('notebook') || text.includes('xps') || text.includes('zephyrus') || text.includes('thinkpad')) return 'laptop';
  if (text.includes('keyboard') || text.includes('keychron') || text.includes('mx keys')) return 'keyboard';
  if (text.includes('mouse') || text.includes('mx master') || text.includes('g502') || text.includes('viper')) return 'mouse';
  if (text.includes('monitor') || text.includes('display') || text.includes('ultrafine') || text.includes('oled')) return 'laptop';
  if (text.includes('ssd') || text.includes('990 pro') || text.includes('storage') || text.includes('drive')) return 'default';
  if (text.includes('vacuum') || text.includes('robot') || text.includes('roborock') || text.includes('dreame') || text.includes('narwal') || text.includes('ecovacs') || text.includes('freo')) return 'robot';
  if (text.includes('speaker') || text.includes('sonos') || text.includes('era 300') || text.includes('jbl') || text.includes('charge')) return 'speaker';
  if (text.includes('lock') || text.includes('switchbot')) return 'lock';
  if (text.includes('thermostat') || text.includes('ecobee')) return 'thermostat';
  if (text.includes('light') || text.includes('govee') || text.includes('strip') || text.includes('led')) return 'speaker';
  
  return 'default';
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return yaml.parse(match[1]);
  } catch (e) {
    console.error('YAML parse error:', e.message);
    return null;
  }
}

function generateSVG({ title, category, productType, width = 1200, height = 675, variant = 'hero' }) {
  const colors = getCategoryColor(category);
  const fontSize = Math.min(width, height) * 0.035;
  const titleFontSize = Math.min(width, height) * 0.055;
  
  const productSVG = PRODUCT_SVGS[productType] || PRODUCT_SVGS.default;
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background gradient - studio lighting -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.bg}"/>
      <stop offset="40%" style="stop-color:${colors.dark}"/>
      <stop offset="100%" style="stop-color:${colors.mid}"/>
    </linearGradient>
    
    <!-- Floor reflection gradient -->
    <linearGradient id="floorGrad" x1="0%" y1="50%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.dark};stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:${colors.bg};stop-opacity:0"/>
    </linearGradient>
    
    <!-- Rim light gradient -->
    <radialGradient id="rimLight" cx="50%" cy="20%" r="60%">
      <stop offset="0%" style="stop-color:${colors.accent};stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:0"/>
    </radialGradient>
    
    <!-- Soft shadow filter -->
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="4" dy="8" stdDeviation="6" flood-color="${colors.dark}" flood-opacity="0.4"/>
    </filter>
    
    <!-- Glow filter -->
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Subtle noise texture -->
    <filter id="noise" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" result="noise"/>
      <feBlend in="SourceGraphic" in2="noise" mode="overlay"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  
  <!-- Rim light / key light simulation -->
  <ellipse cx="${width/2}" cy="${height * 0.15}" rx="${width * 0.6}" ry="${height * 0.3}" fill="url(#rimLight)"/>
  
  <!-- Floor / surface reflection -->
  <rect x="0" y="${height * 0.55}" width="${width}" height="${height * 0.45}" fill="url(#floorGrad)"/>
  
  <!-- Subtle vignette -->
  <rect width="${width}" height="${height}" fill="none" stroke="${colors.bg}" stroke-width="${width * 0.3}" opacity="0.3" filter="url(#noise)"/>
  
  ${productSVG(colors)}
  
  <!-- Category badge -->
  <rect x="40" y="40" width="140" height="36" rx="18" fill="${colors.dark}" opacity="0.8" filter="url(#shadow)"/>
  <text x="110" y="66" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${fontSize * 0.7}" font-weight="700" fill="${colors.accent}" letter-spacing="0.5px">
    ${category.toUpperCase()}
  </text>
  
  <!-- Title (only for hero) -->
  ${variant === 'hero' ? `
  <text x="${width/2}" y="${height - 80}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${titleFontSize}" font-weight="700" fill="${colors.text}" filter="url(#shadow)">
    ${title.length > 55 ? title.substring(0, 55) + '...' : title}
  </text>
  ` : ''}
  
  <!-- Placeholder label -->
  <text x="${width/2}" y="${height - 40}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${fontSize}" font-weight="400" fill="${colors.text}" opacity="0.5">
    ${variant === 'hero' ? 'Hero Image Placeholder' : 'Detail Image Placeholder'}
  </text>
  
  <!-- Ms V Lab watermark -->
  <text x="${width - 40}" y="${height - 30}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${fontSize * 0.6}" fill="${colors.text}" opacity="0.15">
    Ms V Lab
  </text>
</svg>`;
}

function getMdxFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => path.join(dir, f));
}

function processReviews() {
  const files = getMdxFiles('src/content/reviews');
  const results = [];
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const fm = parseFrontmatter(content);
    if (!fm) continue;
    
    const slug = path.basename(file, '.mdx');
    const category = fm.category || 'default';
    const productType = getProductIcon(fm.title, fm.tags);
    
    // Hero image
    const heroDir = `public/images/reviews/${slug}`;
    fs.mkdirSync(heroDir, { recursive: true });
    const heroSVG = generateSVG({ 
      title: fm.title, 
      category, 
      productType,
      width: 1200, 
      height: 675,
      variant: 'hero'
    });
    fs.writeFileSync(`${heroDir}/hero.jpg`, heroSVG);
    
    // Detail images
    let detailCount = 0;
    if (fm.images && Array.isArray(fm.images)) {
      for (let i = 0; i < fm.images.length; i++) {
        const img = fm.images[i];
        const detailSVG = generateSVG({ 
          title: img.caption || `${fm.title} - Detail ${i + 1}`, 
          category, 
          productType,
          width: 1200, 
          height: 675,
          variant: 'detail'
        });
        const ext = path.extname(img.src) || '.jpg';
        const filename = path.basename(img.src, ext) + '.jpg';
        fs.writeFileSync(`${heroDir}/${filename}`, detailSVG);
        detailCount++;
      }
    }
    
    results.push({ slug, title: fm.title, category, hero: true, details: detailCount });
  }
  
  return results;
}

function processBestProducts() {
  const files = getMdxFiles('src/content/best-products');
  const results = [];
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const fm = parseFrontmatter(content);
    if (!fm) continue;
    
    const slug = path.basename(file, '.mdx');
    const category = fm.category || 'default';
    const productType = getProductIcon(fm.title, []);
    
    const heroDir = `public/images/best-products/${slug}`;
    fs.mkdirSync(heroDir, { recursive: true });
    const heroSVG = generateSVG({ 
      title: fm.title, 
      category, 
      productType,
      width: 1200, 
      height: 675,
      variant: 'hero'
    });
    fs.writeFileSync(`${heroDir}/hero.jpg`, heroSVG);
    
    results.push({ slug, title: fm.title, category, hero: true });
  }
  
  return results;
}

function processDeals() {
  const files = getMdxFiles('src/content/deals');
  const results = [];
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const fm = parseFrontmatter(content);
    if (!fm) continue;
    
    const slug = path.basename(file, '.mdx');
    const category = fm.category || 'default';
    const productType = getProductIcon(fm.productName || fm.title, []);
    
    const heroDir = `public/images/deals/${slug}`;
    fs.mkdirSync(heroDir, { recursive: true });
    const heroSVG = generateSVG({ 
      title: fm.productName || fm.title, 
      category, 
      productType,
      width: 1200, 
      height: 675,
      variant: 'hero'
    });
    fs.writeFileSync(`${heroDir}/hero.jpg`, heroSVG);
    
    results.push({ slug, title: fm.productName || fm.title, category, hero: true });
  }
  
  return results;
}

function main() {
  console.log('🎨 Generating photorealistic SVG placeholders...\n');
  
  console.log('📝 Processing reviews...');
  const reviews = processReviews();
  console.log(`  ✅ ${reviews.length} reviews processed`);
  
  console.log('🏆 Processing best-products...');
  const bestProducts = processBestProducts();
  console.log(`  ✅ ${bestProducts.length} best-products processed`);
  
  console.log('💰 Processing deals...');
  const deals = processDeals();
  console.log(`  ✅ ${deals.length} deals processed`);
  
  let totalImages = reviews.reduce((a, r) => a + 1 + (r.details || 0), 0) + bestProducts.length + deals.length;
  
  console.log('\n📊 Summary:');
  console.log(`  Total images generated: ${totalImages}`);
  console.log('\n✨ Done! Images saved to public/images/');
  console.log('\n📝 Next steps:');
  console.log('  1. Review the generated images in public/images/');
  console.log('  2. When you get real affiliate images, replace the .jpg files');
  console.log('  3. Keep the same filenames - no code changes needed!');
  console.log('  4. Recommended: use WebP/JPG, 1200x675 for hero, 1200x675 for details');
}

main();
