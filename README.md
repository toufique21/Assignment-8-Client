# BookNook

**Live site:** https://booknook.vercel.app

BookNook is an online book library where readers can discover books, borrow them for a few
days, and share their own shelf with the community. This repository is the **Next.js App
Router client** — it handles authentication, the borrow flow, and the sharing/managing of
books, and talks to a separate Express/MongoDB API for the book catalogue.

---

## Features

- **Sign in your way** — email + password with optional Google and GitHub sign-in, powered by
  better-auth with MongoDB-backed sessions. Signed-out visitors are redirected away from
  protected pages both server-side and client-side.
- **A home page that sells the library** — an auto-playing Swiper hero carousel, the six most
  recently added books, an "About BookNook" feature section, and an interactive FAQ accordion.
- **Browse the whole collection** — every shared book in a responsive cover grid with loading
  skeletons, friendly empty states, and a retry action if the API is unavailable.
- **Borrow in one click** — a confirmation modal reserves a copy atomically (so two readers
  can never take the last copy), stamps a 14-day due date, and prevents borrowing the same
  book twice until it is returned.
- **Track and return your loans** — the *My Borrows* table lists each borrowed book with its
  cover, borrow date, and due date, plus an inline **Return Book** action.
- **Share your own books** — the *Add Books* form captures title, author, category, copies,
  description, and an ImgBB cover link, and automatically attaches your name and email to the
  listing.
- **Manage your shelf** — *My Books* shows only your listings, with an edit dialog (title,
  author, category, copies, cover, description) and a delete confirmation dialog.
- **Your profile at a glance** — *My Profile* pulls the live session for your avatar (or
  initials), verification status, member-since date, account ID, quick links, and sign-out.
- **Covers that actually load** — ImgBB *page* links pasted by users are rewritten to
  `/api/image?url=…`, which resolves the real image file and redirects, so no more broken
  book covers.
- **Polished, accessible UI** — Tailwind CSS v4 + daisyUI + shadcn/ui on semantic design
  tokens, toast feedback for every async action, keyboard-friendly focus styles, and
  screen-reader labels throughout.

## Tech stack

| Layer      | Tools                                                               |
| ---------- | ------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack, React Compiler) + React 19       |
| Language   | TypeScript (strict)                                                 |
| Styling    | Tailwind CSS v4, daisyUI 5, shadcn/ui, Hugeicons + react-icons      |
| Auth       | better-auth (MongoDB adapter)                                       |
| Database   | MongoDB (`BookNook` database)                                       |
| UX         | Swiper carousel, react-hot-toast, next/image, next/link             |

## Pages

| Route              | Description                                            | Auth required |
| ------------------ | ------------------------------------------------------ | ------------- |
| `/`                | Hero carousel, recent books, about section, FAQ        | No            |
| `/All-Books`       | Full catalogue grid                                    | No            |
| `/All-Books/[id]`  | Book details + borrow button                           | Yes           |
| `/Add-Books`       | Share a new book                                       | Yes           |
| `/My-Books`        | Edit or delete the books you added                     | Yes           |
| `/My-Borrows`      | Active loans with due dates and return action          | Yes           |
| `/My-Profile`      | Account overview and sign out                          | Yes           |
| `/Sign-In`         | Email sign in + social providers                       | No            |
| `/Sign-Up`         | Create an account                                      | No            |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-here
MONGODB_URL=mongodb://localhost:27017
```

`src/lib/db.ts` throws on import if `MONGODB_URL` is missing, so these are required for both
`next dev` and `next build`.

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> The catalogue, borrowing, and book management calls go to the companion API at
> `http://localhost:8000` (configured in `src/lib/books.ts`). Start that server as well, or
> the book pages will show their error states.

### 4. Useful scripts

```bash
npm run dev      # development server on :3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
npx tsc --noEmit # type-check
```

## Project structure

```
src/
  app/                 # routes (home, All-Books, My-Books, auth, api/*)
  components/          # Navbar, hero, book cards, borrow modal, FAQ, ui primitives
  hooks/               # useRequireAuth client-side route guard
  lib/                 # auth, db, book types/API base, cover resolver, utils
  proxy.ts             # Next 16 proxy — server-side guard for protected routes
public/                # logo and hero slides
```

## Deployment

The client is deployable to any Node host that supports Next.js (Vercel is the simplest).
Set `BETTER_AUTH_URL` to the deployed origin, keep `BETTER_AUTH_SECRET` and `MONGODB_URL` in
the host's environment variables, and make sure the API's `CLIENT_URL` / CORS settings allow
the deployed domain with credentials.
