import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://msvlab.site',
  integrations: [tailwind(), mdx()],
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.astro'],
    },
  },
});
