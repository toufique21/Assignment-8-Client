<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BookNook — Client

BookNook is a book browsing / borrowing app. This repo is the **client only** (Next.js App Router); there is no API or database in this codebase yet.

## Stack

- **Next.js 16.4.5** (App Router, Turbopack) + **React 19.3**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** + **daisyUI 5** + **shadcn/ui** (`base-mira` style, Hugeicons)
- React Compiler and `cacheComponents` are enabled in `next.config.ts`

## Commands

```bash
npm run dev     # start dev server (localhost:3000)
npm run build   # production build
npm run start   # run the production build
npm run lint    # ESLint (flat config, eslint.config.mjs)
npx tsc --noEmit # type-check (no dedicated script)
```

There is no test runner configured.

## Project layout

```
src/
  app/                    # App Router routes
    layout.tsx            # root layout — renders Navbar + Footer on every page
    page.tsx              # "/" home
    globals.css           # Tailwind v4 entry, theme tokens, daisyUI plugin
    All-Books/page.tsx    # /All-Books
    Add-Books/page.tsx    # /Add-Books
    My-Books/page.tsx     # /My-Books
    My-Borrows/page.tsx   # /My-Borrows
  components/
    Navbar.tsx
    Footer.tsx
    ui/                   # shadcn-generated primitives (button.tsx)
  lib/utils.ts            # re-exports cn from the "cn" package
public/                   # static assets (logo: 5078755.png)
```

Import alias: `@/*` maps to `./src/*` (e.g. `@/components/Navbar`, `@/lib/utils`).

## Conventions & gotchas

- **Routes are capitalized and case-sensitive** (`/All-Books`, `/My-Books`). Match the existing folder names exactly and always use a leading slash in `Link href` — the current Navbar hrefs like `"All-Books"` are relative and should not be copied to new links.
- **Navbar and Footer are global** (mounted in `src/app/layout.tsx`). Page components should return page content only; don't re-add the layout chrome.
- **Next 16 APIs differ from older versions.** Before using route params, `searchParams`, metadata, caching, or navigation APIs, read the matching guide under `node_modules/next/dist/docs/01-app/`. Note the global generated types such as `LayoutProps<"/">` used in `layout.tsx`.
- **`cacheComponents: true` is on.** Assume caching/partial-prefetch semantics apply; use the Next 16 docs rather than pre-16 patterns (`dynamic = "force-dynamic"`, etc.).
- **React Compiler is on.** Don't add manual `useMemo`/`useCallback`/`memo` unless there is a demonstrated need.
- **Styling:** use Tailwind utility classes with the semantic theme tokens defined in `globals.css` (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, …) instead of hard-coded colors. daisyUI is available via `@plugin "daisyui"`, but existing components use Tailwind utilities, so prefer that style.
- **`cn` helper:** import from `@/lib/utils` (`utils.ts` re-exports it). Some generated shadcn files import directly from `"cn"`; both resolve, but new code should use `@/lib/utils`.
- **UI primitives** live in `src/components/ui/`. Add new shadcn components with the CLI (`components.json` is configured) rather than hand-rolling, and keep the configured alias/style.
- Use `next/image` for images and `next/link` for navigation (both are already used in Navbar/Footer).
- The app is still early-stage: most pages are placeholders and `metadata` in `layout.tsx` is still the create-next-app default. Follow the existing simple `const XPage = () => …; export default XPage` page style.
- **Case-insensitive filesystem:** route folders are case-sensitive in URLs but macOS is not on disk, so generated types can disagree about casing (e.g. `My-Borrows` vs `My-borrows`). If `npx tsc --noEmit` reports a TS1149 "differs only in casing" error from `.next/dev/types/`, stop `next dev` and delete `.next/` so it regenerates.

## Don'ts

- Don't edit files in `.next/` or `next-env.d.ts`.
- Don't remove the `BEGIN:nextjs-agent-rules` block above — `next dev` regenerates it.
- Don't introduce a second styling system (CSS modules, styled-components, etc.); stay on Tailwind + shadcn/daisyUI.
