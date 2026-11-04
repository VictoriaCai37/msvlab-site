#!/usr/bin/env node
/**
 * Helper script to swap placeholder SVGs with real images
 * Usage: node scripts/swap-images.js <source-folder>
 * 
 * Place your real images in a folder with the same structure:
 * source-folder/
 *   reviews/
 *     sony-wh-1000xm5/
 *       hero.webp
 *       anc-demo.webp
 *       ...
 */

import fs from 'fs';
import path from 'path';

const TARGET_BASE = 'public/images';

function copyImages(sourceBase) {
  if (!fs.existsSync(sourceBase)) {
    console.error(`❌ Source folder not found: ${sourceBase}`);
    process.exit(1);
  }

  let copied = 0;
  let skipped = 0;

  function processDir(srcDir, relPath = '') {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const targetDir = path.join(TARGET_BASE, relPath);
      const targetPath = path.join(targetDir, entry.name);
      
      if (entry.isDirectory()) {
        processDir(srcPath, path.join(relPath, entry.name));
      } else if (entry.isFile()) {
        // Only copy image files
        const ext = path.extname(entry.name).toLowerCase();
        if (['.webp', '.jpg', '.jpeg', '.png', '.avif'].includes(ext)) {
          fs.mkdirSync(targetDir, { recursive: true });
          
          // Check if placeholder exists
          const placeholderName = path.basename(entry.name, ext) + '.svg';
          const placeholderPath = path.join(targetDir, placeholderName);
          
          if (fs.existsSync(placeholderPath)) {
            fs.copyFileSync(srcPath, targetPath);
            console.log(`✅ ${relPath}/${entry.name} → replaced ${placeholderName}`);
            copied++;
          } else {
            console.log(`⚠️  ${relPath}/${entry.name} → no placeholder found (keeping anyway)`);
            fs.copyFileSync(srcPath, targetPath);
            skipped++;
          }
        }
      }
    }
  }

  processDir(sourceBase);
  
  console.log(`\n📊 Done: ${copied} replaced, ${skipped} new images added`);
  console.log('\n💡 Run `npm run build` to test');
}

// Get source folder from command line
const sourceFolder = process.argv[2];
if (!sourceFolder) {
  console.log('Usage: node scripts/swap-images.js <source-folder>');
  console.log('Example: node scripts/swap-images.js ~/Downloads/affiliate-images');
  process.exit(1);
}

copyImages(sourceFolder);
