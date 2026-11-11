"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BOOKS_API, type Book } from "@/lib/books";

const backLinkClass =
  "inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground";

const pillClass =
  "rounded-full bg-muted px-3 py-1 text-[0.6875rem] font-semibold tracking-wide text-muted-foreground uppercase";

const formatDate = (value?: string) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const BookDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    fetch(`${BOOKS_API}/All-Books/${id}`, { signal: controller.signal })
      .then((response) => {
        if (response.status === 404) {
          throw new Error("We could not find that book. It may have been removed.");
        }

        if (!response.ok) {
          throw new Error("Could not load this book. Please try again.");
        }

        return response.json() as Promise<Book>;
      })
      .then((result) => {
        setBook(result);
        setError(null);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        setBook(null);
        setError(err instanceof Error ? err.message : "Something went wrong.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [id, reloadKey]);

  const handleRetry = () => {
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

  if (isLoading) {
    return <BookDetailsSkeleton />;
  }

  if (error || !book) {
    return (
      <section className="container mx-auto px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <Link href="/All-Books" className={backLinkClass}>
            <span aria-hidden="true">←</span> Back to All Books
          </Link>

          <div
            role="alert"
            className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center"
          >
            <h1 className="text-lg font-semibold text-foreground">Book unavailable</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {error ?? "Something went wrong."}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const addedOn = formatDate(book.createdAt);

  return (
    <section className="container mx-auto px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <Link href="/All-Books" className={backLinkClass}>
          <span aria-hidden="true">←</span> Back to All Books
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-10">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
            {book.imageUrl ? (
              <Image
                src={book.imageUrl}
                alt={`Cover of ${book.title}`}
                fill
                unoptimized
                sizes="(min-width: 768px) 20rem, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                No cover
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              {book.category && <span className={pillClass}>{book.category}</span>}
              <span className="rounded-full bg-brand/10 px-3 py-1 text-[0.6875rem] font-semibold text-brand">
                {typeof book.copies === "number" ? `${book.copies} copies` : "Available"}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {book.title}
            </h1>
            <p className="mt-2 text-base text-muted-foreground">by {book.author}</p>

            {book.description && (
              <div className="mt-8 border-t border-border pt-6">
                <h2 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  About this book
                </h2>
                <p className="mt-3 text-sm leading-7 whitespace-pre-line text-muted-foreground">
                  {book.description}
                </p>
              </div>
            )}

            <dl className="mt-8 space-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
              {book.userName && (
                <div className="flex flex-wrap gap-1">
                  <dt className="font-medium text-foreground">Added by</dt>
                  <dd>{book.userName}</dd>
                </div>
              )}
              {addedOn && (
                <div className="flex flex-wrap gap-1">
                  <dt className="font-medium text-foreground">Added on</dt>
                  <dd>{addedOn}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

export const BookDetailsSkeleton = () => (
  <section className="container mx-auto px-4 py-10 sm:py-14">
    <div className="mx-auto max-w-5xl" aria-hidden="true">
      <div className="h-4 w-36 animate-pulse rounded bg-muted" />

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-10">
        <div className="aspect-[3/4] w-full animate-pulse rounded-2xl bg-muted" />

        <div className="space-y-4">
          <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-32 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  </section>
);
