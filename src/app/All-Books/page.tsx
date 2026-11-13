"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";
import { BOOKS_API, type Book } from "@/lib/books";

const AllBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${BOOKS_API}/All-Books`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load the books. Please try again.");
        }

        return response.json() as Promise<Book[]>;
      })
      .then((result) => {
        setBooks(Array.isArray(result) ? result : []);
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
    <section className="container mx-auto px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            The collection
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            All Books
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Browse every book shared by the BookNook community and pick your next read.
          </p>
        </div>

        {isLoading && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, index) => (
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
            <h2 className="text-lg font-semibold text-foreground">Could not load the books</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{error}</p>
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
            <h2 className="text-lg font-semibold text-foreground">No books yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Nobody has shared a book so far. Be the first to add one to the shelf.
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

export default AllBooksPage;
