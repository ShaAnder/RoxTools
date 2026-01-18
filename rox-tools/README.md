# Rox Tools

Rox Tools is a Next.js web app for Ragnarok Online (Global) that hosts
**multiple mini apps** (calculators, planners, trackers, etc.) alongside
**wiki-style documentation**.

The core idea is simple:

- A **folder** in the Next.js App Router becomes a **page**.
- “Mini apps” live under `/apps/*`.
- “Docs / wiki pages” live under `/docs/*`.

This keeps the project easy to navigate and makes it fast to add new tools.

## Why slugs?

We use **slugs** because they make URLs stable, readable, and scalable.

- **Readable URLs**: `/apps/damage-calc` is clearer than `/apps?id=12`.
- **One dynamic route for many tools**: a single page can serve many mini apps
  using a dynamic segment.
- **Stable links**: renaming a title doesn’t have to break the URL if the slug
  stays the same.
- **Works great for wiki-style docs**: slugs mirror folder structure like
  `/docs/tools/overview`.

In Next.js App Router, a bracketed folder name means “this part of the path is
dynamic”:

- `app/apps/[slug]/page.tsx` handles `/apps/<anything>`
- `app/docs/[...slug]/page.tsx` handles `/docs/<one-or-more-segments>`

## Folder-based routes in this repo

- Home
  - `app/page.tsx` → `/`
- Mini apps
  - `app/apps/page.tsx` → `/apps`
  - `app/apps/[slug]/page.tsx` → `/apps/<slug>`
- Docs (wiki)
  - `app/docs/page.tsx` → `/docs`
  - `app/docs/[...slug]/page.tsx` → `/docs/<...slug>`

Examples you can try locally:

- `/apps/damage-calc`
- `/docs/getting-started`
- `/docs/tools/overview`

## Getting started (local dev)

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000

## How to add a new mini app

You have two options:

1. Add a dedicated folder (good when the app is “real” and deserves its own
   route file)

- Create: `app/apps/my-new-tool/page.tsx`
- Visit: `/apps/my-new-tool`

2. Use the dynamic slug route (good when you want a single page that loads many
   tools)

- Add logic in: `app/apps/[slug]/page.tsx`
- Visit: `/apps/<slug>`

## How to add a new docs page

Right now docs are placeholders rendered by the catch-all route. Later we can
swap this to MDX files or a database-backed wiki.

For now, docs routes are driven by the URL:

- `/docs/something`
- `/docs/something/with/nesting`

## Tech

- Next.js (App Router)
- TypeScript
- Tailwind CSS
