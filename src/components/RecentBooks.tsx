"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";
import { BOOKS_API, type Book } from "@/lib/books";

const RECENT_BOOKS_COUNT = 6;

const getCreatedAt = (book: Book) => {
  const timestamp = book.createdAt ? Date.parse(book.createdAt) : Number.NaN;

  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const RecentBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${BOOKS_API}/All-Books`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load the latest books. Please try again.");
        }

        return response.json() as Promise<Book[]>;
      })
      .then((result) => {
        const latest = Array.isArray(result)
          ? [...result]
              .sort((a, b) => getCreatedAt(b) - getCreatedAt(a))
              .slice(0, RECENT_BOOKS_COUNT)
          : [];

        setBooks(latest);
        setError(null);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        setBooks([]);
        setError(err instanceof Error ? err.message : "Something went wrong.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [reloadKey]);

  const handleRetry = () => {
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

  return (
    <section
      aria-labelledby="recent-books-heading"
      className="bg-background py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-2">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Fresh on the shelf
            </p>
            <h2
              id="recent-books-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Recently Added Books
            </h2>
            <p className="text-sm text-muted-foreground">
              The six newest books shared by the BookNook community — find your
              next read.
            </p>
          </div>

          <Link
            href="/All-Books"
            className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-brand/40 hover:text-brand sm:self-auto"
          >
            View all books
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {isLoading && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {Array.from({ length: RECENT_BOOKS_COUNT }).map((_, index) => (
              <li
                key={index}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="aspect-[3/4] w-full animate-pulse bg-muted" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-16 animate-pulse rounded-full bg-muted" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                  <div className="h-10 w-full animate-pulse rounded-full bg-muted" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && error && (
          <div
            role="alert"
            className="rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center"
          >
            <h3 className="text-lg font-semibold text-foreground">
              Could not load the latest books
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {error}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && books.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
            <h3 className="text-lg font-semibold text-foreground">No books yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Nobody has shared a book so far. Be the first to add one to the
              shelf.
            </p>
            <Link
              href="/Add-Books"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Add a Book
            </Link>
          </div>
        )}

        {!isLoading && !error && books.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default RecentBooks;
