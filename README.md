# TechHowlerX (jeremdev-blog)

Next.js App Router project for the TechHowlerX blog + developer tools platform.

## Stack

- `Next.js` (App Router)
- `React`
- `TypeScript`
- `SCSS modules` + global SCSS
- `Vitest` + Testing Library
- `MDX` for articles

## Features

- Blog articles loaded from local `content/articles/*.mdx`
- Taxonomy-driven topic navigation (`/topics`)
- Developer tools (`/tools/*`)
- Client-side search powered by a generated `public/search-index.json`
- Sitemap + robots generation

## Scripts

```bash
npm run dev      # Generates search index first, then starts Next dev server
npm run build    # Generates search index, then builds production bundle
npm run start    # Starts production server
npm run test     # Runs Vitest
npm run lint     # Runs ESLint (Next + TS flat config)
npm run validate # Full release check: lint + tests + production build
```

## Git Hooks (Husky)

- `pre-commit`: runs `npm run lint` (fast feedback)
- `pre-push`: runs `npm run validate` (full MVP safety gate)

## Search Index

Search uses `public/search-index.json`, generated from published articles and tools.
It is generated automatically by `predev` and `prebuild`.

## Content Authoring

Articles live in `content/articles` as `.mdx` files with validated frontmatter.
Published articles require a valid taxonomy category path and ISO date.

## Environment

Optional:

- `NEXT_PUBLIC_SITE_URL` (used for canonical URLs, metadata base, sitemap, robots)

## Release Check

Before shipping:

```bash
npm run lint
npm test
npm run build
```
