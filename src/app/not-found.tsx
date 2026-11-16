import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found — BookNook",
  description: "The page you are looking for does not exist on BookNook.",
};

const primaryButtonClass =
  "btn-gloss inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const secondaryButtonClass =
  "btn-gloss inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const NotFound = () => {
  return (
    <section className="container mx-auto px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Error 404
        </p>

        <p
          aria-hidden="true"
          className="mt-4 text-7xl font-bold tracking-tight text-brand sm:text-8xl"
        >
          404
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          This page is off the shelf
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
          We could not find the page you were looking for. It may have been moved,
          removed, or never existed in the first place.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className={primaryButtonClass}>
            <span aria-hidden="true">←</span> Back to home
          </Link>

          <Link href="/All-Books" className={secondaryButtonClass}>
            Browse all books
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Looking for a specific title? Try the{" "}
          <Link
            href="/All-Books"
            className="font-semibold text-foreground hover:underline"
          >
            full collection
          </Link>{" "}
          or check your{" "}
          <Link
            href="/My-Borrows"
            className="font-semibold text-foreground hover:underline"
          >
            current borrows
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default NotFound;
