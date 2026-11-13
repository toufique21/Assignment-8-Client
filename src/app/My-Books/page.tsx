"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { BOOKS_API, type Book } from "@/lib/books";
import { getCoverSrc } from "@/lib/images";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const deleteButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-destructive/30 bg-destructive/5 px-4 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive disabled:cursor-not-allowed disabled:opacity-50";

const cancelButtonClass =
  "inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50";

const MyBooksPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const userEmail = user?.email;

  const [books, setBooks] = useState<Book[]>([]);
  const [loadedEmail, setLoadedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isDeletingBook = Boolean(bookToDelete) && deletingId === bookToDelete?._id;

  const isLoading = Boolean(userEmail) && loadedEmail !== userEmail;

  useEffect(() => {
    if (!userEmail) return;

    const controller = new AbortController();

    fetch(`${BOOKS_API}/My-Books?email=${encodeURIComponent(userEmail)}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load your books. Please try again.");
        }

        return response.json() as Promise<Book[]>;
      })
      .then((result) => {
        setBooks(Array.isArray(result) ? result : []);
        setError(null);
        setLoadedEmail(userEmail);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        setBooks([]);
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setLoadedEmail(userEmail);
      });

    return () => controller.abort();
  }, [userEmail]);

  const handleDelete = async (book: Book) => {
    if (!userEmail) {
      toast.error("Please sign in before deleting a book.");
      return;
    }

    setDeletingId(book._id);
    const toastId = toast.loading(`Deleting "${book.title}"...`);

    try {
      const response = await fetch(
        `${BOOKS_API}/My-Books/${book._id}?email=${encodeURIComponent(userEmail)}`,
        { method: "DELETE" },
      );
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? "Could not delete this book. Please try again.");
      }

      setBooks((current) => current.filter((item) => item._id !== book._id));
      setBookToDelete(null);
      toast.success(result.message ?? "Book deleted successfully.", { id: toastId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.", {
        id: toastId,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const showEmptyState = Boolean(user) && !isLoading && !error && books.length === 0;

  return (
    <section className="container mx-auto px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Your shelf
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            My Books
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            {user
              ? "Only the books you have added to BookNook appear here."
              : "Sign in to see the books you have added to BookNook."}
          </p>
        </div>

        {(isPending || isLoading) && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card p-10 text-sm text-muted-foreground shadow-sm">
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
            />
            Loading your books...
          </div>
        )}

        {!isPending && !user && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">You are not signed in</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Sign in to see the books you have added.
            </p>
            <Link href="/Sign-In" className={`${primaryButtonClass} mt-6`}>
              Sign in
            </Link>
          </div>
        )}

        {user && !isLoading && error && (
          <div
            role="alert"
            className="rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center"
          >
            <h2 className="text-lg font-semibold text-foreground">Could not load your books</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {showEmptyState && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
            <h2 className="text-lg font-semibold text-foreground">No books yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              You haven&apos;t added any books. Add your first book and it will show up right
              here.
            </p>
            <Link href="/Add-Books" className={`${primaryButtonClass} mt-6`}>
              Add a Book
            </Link>
          </div>
        )}

        {user && !isLoading && !error && books.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => {
              const coverSrc = getCoverSrc(book.imageUrl);

              return (
                <li
                  key={book._id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-[3/4] w-full bg-muted">
                    {coverSrc ? (
                      <Image
                        src={coverSrc}
                        alt={`Cover of ${book.title}`}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                        No cover
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      {book.category && (
                        <span className="rounded-full bg-muted px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-muted-foreground uppercase">
                          {book.category}
                        </span>
                      )}
                      <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[0.6875rem] font-semibold text-brand">
                        {typeof book.copies === "number" ? `${book.copies} copies` : "Available"}
                      </span>
                    </div>

                    <div>
                      <h2 className="line-clamp-2 text-base font-semibold text-foreground">
                        {book.title}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">by {book.author}</p>
                    </div>

                    {book.description && (
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {book.description}
                      </p>
                    )}

                    <div className="mt-auto flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
                      <button
                        type="button"
                        onClick={() => setBookToDelete(book)}
                        disabled={Boolean(deletingId)}
                        className={deleteButtonClass}
                      >
                        <FaTrash aria-hidden="true" className="size-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {bookToDelete && (
          <Dialog
            open
            onOpenChange={(open) => {
              if (!open) setBookToDelete(null);
            }}
          >
            <DialogContent showCloseButton={!isDeletingBook}>
              <DialogHeader>
                <DialogTitle>Delete this book?</DialogTitle>
                <DialogDescription>
                  <span className="font-semibold text-foreground">
                    &ldquo;{bookToDelete.title}&rdquo;
                  </span>{" "}
                  by {bookToDelete.author} will be permanently removed from BookNook and from
                  the database. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <button
                  type="button"
                  onClick={() => setBookToDelete(null)}
                  disabled={isDeletingBook}
                  className={cancelButtonClass}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(bookToDelete)}
                  disabled={isDeletingBook}
                  className={deleteButtonClass}
                >
                  {isDeletingBook && (
                    <span
                      aria-hidden="true"
                      className="size-3 animate-spin rounded-full border-2 border-destructive/30 border-t-destructive"
                    />
                  )}
                  {isDeletingBook ? "Deleting..." : "Yes, delete it"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
};

export default MyBooksPage;
