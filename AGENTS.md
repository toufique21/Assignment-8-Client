<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BookNook — Client

BookNook is a book browsing / borrowing app. This repo is the **Next.js App Router client**. It talks to a separate backend at `http://localhost:8000` (not in this repo) and also hosts its own auth + book routes under `src/app/api/`.

## Stack

- **Next.js 16.4.5** (App Router, Turbopack) + **React 19.3**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** + **daisyUI 5** + **shadcn/ui** (`base-mira` style, Hugeicons)
- **better-auth** (`better-auth/react` client, MongoDB adapter on the server)
- **MongoDB** (`mongodb` driver, database name `BookNook`)
- **react-hot-toast** for user feedback, **react-icons** (Fa*) and **Hugeicons** for icons
- **swiper** for the home-page hero carousel
- React Compiler, `cacheComponents`, and `partialPrefetching` are enabled in `next.config.ts`

## Commands

```bash
npm run dev     # start dev server (localhost:3000)
npm run build   # production build
npm run start   # run the production build
npm run lint    # ESLint (flat config, eslint.config.mjs; script is bare `eslint`)
npx tsc --noEmit # type-check (no dedicated script)
```

There is no test runner configured.

## Environment variables

`.env` (git-ignored, `BETTER_AUTH_*` + Mongo):

```
BETTER_AUTH_URL=...      # e.g. http://localhost:3000
BETTER_AUTH_SECRET=...
MONGODB_URL=...          # mongodb:// connection string
```

`src/lib/db.ts` throws on import if `MONGODB_URL` is missing, so any route/page that imports `@/lib/auth` or `@/lib/db` will fail to build without it.

## Project layout

```
src/
  app/
    layout.tsx            # root layout — Navbar, children, Footer, <Toaster />
    page.tsx              # "/" home (Suspense-wrapped HeroPage + About)
    globals.css           # Tailwind v4 entry, theme tokens, daisyUI/shadcn plugins
    All-Books/page.tsx    # /All-Books (client grid of every book)
    All-Books/[id]/page.tsx        # /All-Books/[id] (server shell + Suspense)
    All-Books/[id]/BookDetails.tsx # client details view for one book
    Add-Books/page.tsx    # /Add-Books (client form)
    My-Books/page.tsx     # /My-Books (client list, fetches user's books)
    My-Borrows/page.tsx   # /My-Borrows (placeholder)
    Sign-In/page.tsx      # /Sign-In (better-auth email sign in)
    Sign-Up/page.tsx      # /Sign-Up (email sign up + Google/GitHub buttons)
    api/
      auth/[...all]/route.ts  # better-auth handler via toNextJsHandler(auth)
      books/route.ts          # POST /api/books — session-guarded Mongo insert
      image/route.ts          # GET /api/image?url= — resolves ImgBB page links to files
  components/
    Navbar.tsx            # client; active-link styling via usePathname
    UserInfo.tsx          # client; session dropdown / sign-in links
    Footer.tsx            # server; "use cache" FooterYear
    HeroPage.jsx          # client; swiper carousel
    About.tsx             # feature highlights
    ui/button.tsx         # shadcn-generated primitive
  lib/
    auth.ts               # betterAuth() server instance (Mongo adapter)
    auth-client.ts        # createAuthClient() browser client
    books.ts              # BOOKS_API base URL + shared Book type
    images.ts             # getCoverSrc() — ImgBB page links → /api/image
    db.ts                 # MongoClient + db("BookNook"), cached on globalThis in dev
    utils.ts              # re-exports cn from the "cn" package
public/                   # static assets (logo: 5078755.png, hero slides: 1.png–3.png)
```

Import alias: `@/*` maps to `./src/*` (e.g. `@/components/Navbar`, `@/lib/auth-client`).

## Data flow (two backends — read before changing fetching code)

- **Auth + `/api/books`** are handled by this Next app (`src/app/api/*`). `POST /api/books` validates the body, requires a session (`auth.api.getSession`), and inserts into the `books` collection.
- **Book CRUD used by the UI** goes to the external server instead: `Add-Books` POSTs to `/Add-Book`, `My-Books` GETs `/My-Books?email=…` and DELETEs `/My-Books/:id?email=…`, and `All-Books` / `All-Books/[id]` GET `/All-Books` and `/All-Books/:id`. Import the base URL and the `Book` type from `@/lib/books` (`BOOKS_API`) instead of re-declaring them per page.
- Before pointing pages at `/api/books` (or changing the hard-coded URL), ask — it changes which server is the source of truth.

## Conventions & gotchas

- **Routes are capitalized and case-sensitive** (`/Sign-In`, `/All-Books`, `/My-Books`). Always use a leading slash in `Link href`.
- **Git casing bug:** git tracks `src/app/Sign-in/page.tsx` while the directory on disk is `Sign-In` (macOS is case-insensitive). If you rename case-only routes, do it with `git mv` through a temp name; don't assume git sees the new casing.
- **Navbar and Footer are global** (mounted in `src/app/layout.tsx`). Page components return page content only; don't re-add the layout chrome.
- **The root layout wraps `<Navbar />` in `<Suspense>`** because `usePathname()` is runtime data on dynamic routes; without that boundary any `/segment/[id]` route fails to prerender. Keep it when editing the layout, and wrap new dynamic-route pages that read `useParams`/`searchParams` in their own `<Suspense>` too (see `All-Books/[id]/page.tsx`).
- **Session access:** client components call `authClient.useSession()` and read `session?.user` (`{ id, name, email, image }`). Server code calls `auth.api.getSession({ headers: await headers() })`. Guard UI on `isPending` before treating a missing user as signed out.
- **Feedback:** use `react-hot-toast` (`toast.loading` → `toast.success/error` with the same `id`) as the existing forms do. `<Toaster position="top-center" />` is already in the root layout.
- **Next 16 APIs differ from older versions.** Before using route params, `searchParams`, metadata, caching, or navigation APIs, read the matching guide under `node_modules/next/dist/docs/01-app/`. Note the global generated type `LayoutProps<"/">` used in `layout.tsx`.
- **`cacheComponents: true` is on.** `Footer` already uses a `"use cache"` helper. Assume caching/partial-prefetch semantics apply; use the Next 16 docs rather than pre-16 patterns (`dynamic = "force-dynamic"`, etc.).
- **React Compiler is on.** Don't add manual `useMemo`/`useCallback`/`memo` unless there is a demonstrated need.
- **Styling:** Tailwind utilities with the semantic tokens in `globals.css` (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-card`, …) plus the project-specific `bg-brand` / `text-brand-foreground` (deep green `#081c05`) used by Navbar/Footer/buttons. Prefer these over hard-coded colors.
- **daisyUI is used in places:** `<html data-theme="light">` is set in `layout.tsx`, and `UserInfo` uses `dropdown`, `menu`, and `avatar` classes. Both Tailwind utilities and daisyUI classes appear in the codebase — match the file you're editing rather than mixing styles in one component.
- **Images:** `next.config.ts` allows remote images from `avatars.githubusercontent.com`, `lh3.googleusercontent.com`, and `i.ibb.co`. Book covers from user-supplied links are rendered with `unoptimized`; add a `remotePatterns` entry before using `next/image` with a new host.
- **Book covers:** always render `book.imageUrl` through `getCoverSrc()` (`@/lib/images`). Users paste ImgBB *page* links (`https://ibb.co.com/<id>`), which are HTML pages and render as broken images; `getCoverSrc()` rewrites those to `/api/image?url=…`, which resolves the real file via ImgBB's oEmbed JSON and redirects. Direct links pass through unchanged.
- **`cn` helper:** import from `@/lib/utils`. Some generated shadcn files import directly from `"cn"`; both resolve, but new code should use `@/lib/utils`.
- **UI primitives** live in `src/components/ui/`. Add new shadcn components with the CLI (`components.json` is configured) rather than hand-rolling.
- Use `next/image` for images and `next/link` for navigation.
- **Page style:** mostly `const XPage = () => …; export default XPage` (the home page is the exception, using `export default function Home()`). Keep components small and extract shared class strings into module-level constants (see `inputClass`, `labelClass`, `primaryButtonClass`).
- **Known gaps:** `/Profile` is linked from `UserInfo` but has no route; `My-Borrows` is a placeholder; `metadata` in `layout.tsx` is still the create-next-app default; `Add-Books` still has a stray `console.log(form)`, and the `copies` field it submits is ignored by `/api/books`.

## Don'ts

- Don't edit files in `.next/` or `next-env.d.ts`.
- Don't remove the `BEGIN:nextjs-agent-rules` block above — `next dev` regenerates it.
- Don't commit `.env` or hard-code secrets; read them from `process.env`.
- Don't introduce a second styling system (CSS modules, styled-components, etc.); stay on Tailwind + shadcn/daisyUI.
