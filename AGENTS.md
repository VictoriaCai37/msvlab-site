# Repository Guidelines

## Project Structure & Module Organization

```
src/
├── components/       # Reusable Astro components (Header, Footer, ProductCard, etc.)
├── layouts/          # Page layouts (BaseLayout, ArticleLayout, PageLayout)
├── pages/            # Route pages (index, best-products/[slug], about, etc.)
├── content/          # MDX content collections
│   ├── reviews/      # Product reviews
│   ├── best-products/ # "Best X" roundup articles
│   ├── deals/        # Deal posts
│   └── config.ts     # Content collection schemas
├── data/             # Site configuration & constants
│   ├── site.ts       # Site metadata (title, description, URL)
│   └── categories.ts # Category definitions
├── utils/            # Helper functions (helpers.ts)
└── styles/           # Global CSS (global.css)
public/               # Static assets (images, favicon, robots.txt)
```

## Build, Test, and Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at localhost:4321 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run pagefind` | Build search index (run after `build`) |
| `npm run preview:build` | Build + preview in one command |

## Coding Style & Naming Conventions

- **TypeScript**: Strict mode enabled (`tsconfig.json`)
- **Indentation**: 2 spaces (Astro/JS/TS/CSS)
- **Components**: PascalCase (`.astro` files) — e.g., `ProductCard.astro`
- **Utilities**: camelCase — e.g., `formatDate.ts`
- **Content frontmatter**: snake_case keys — e.g., `publish_date`, `product_name`
- **CSS**: Tailwind utility classes preferred; custom CSS in `global.css`
- **Formatting**: No explicit formatter configured — follow existing patterns

## Testing Guidelines

- No test framework currently configured
- Manual verification via `npm run dev` and `npm run preview`
- Validate content: run `npm run build` to catch frontmatter schema errors
- Check for broken links: `npm run build` includes sitemap generation

## Commit & Pull Request Guidelines

- **Commit messages**: Conventional Commits style preferred
  - `feat: add new product card component`
  - `fix: correct date formatting in reviews`
  - `content: add Sony WH-1000XM5 review`
- **PRs**: Include description of changes, link related issues
- **Content changes**: Verify frontmatter matches `src/content/config.ts` schemas
- **Images**: Optimize before committing (WebP preferred, max ~200KB)

## Security & Configuration Tips

- Environment variables: Use `.env` (not committed); see `src/env.d.ts` for types
- Site URL: Configure in `src/data/site.ts` — used for sitemap, RSS, canonical URLs
- Content collections: Defined in `src/content/config.ts` — update schemas when adding fields
- Search: Pagefind indexes `dist/` after build; no server needed

## Agent-Specific Instructions

- When adding content: create `.mdx` files in appropriate `src/content/` subdirectory
- When adding components: place in `src/components/` and import in layouts/pages
- When modifying styles: prefer Tailwind; add globals only to `src/styles/global.css`
- TypeScript: Run `npx astro check` to validate types before committing
