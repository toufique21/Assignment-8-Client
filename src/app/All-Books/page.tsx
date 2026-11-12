"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BOOKS_API, type Book } from "@/lib/books";
import { getCoverSrc } from "@/lib/images";

const detailButtonClass =
  "mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

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
            {books.map((book) => {
              const coverSrc = getCoverSrc(book.imageUrl);

              return (
                <li
                  key={book._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                    {coverSrc ? (
                      <Image
                        src={coverSrc}
                        alt={`Cover of ${book.title}`}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                        No cover
                      </div>
                    )}

                    {book.category && (
                      <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-foreground uppercase shadow-sm backdrop-blur">
                        {book.category}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-1 p-5">
                    <h2 className="line-clamp-2 text-base font-bold text-foreground">
                      {book.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">by <span className="font-semibold">{book.author}</span></p>

                    <Link href={`/All-Books/${book._id}`} className={detailButtonClass}>
                      View Details
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default AllBooksPage;
