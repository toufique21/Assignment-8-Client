"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import type { Borrow } from "@/lib/borrows";
import { getCoverSrc } from "@/lib/images";

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const headCellClass =
  "px-4 py-3 text-[0.6875rem] font-semibold tracking-wide uppercase text-muted-foreground";

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const MyBorrowsPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const userEmail = user?.email;

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loadedEmail, setLoadedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<string | null>(null);

  const isLoading = Boolean(userEmail) && loadedEmail !== userEmail;

  useEffect(() => {
    if (!userEmail) return;

    const controller = new AbortController();

    fetch("/api/borrows", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load your borrows. Please try again.");
        }

        return response.json() as Promise<Borrow[]>;
      })
      .then((result) => {
        setBorrows(Array.isArray(result) ? result : []);
        setError(null);
        setLoadedEmail(userEmail);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        setBorrows([]);
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setLoadedEmail(userEmail);
      });

    return () => controller.abort();
  }, [userEmail]);

  const handleReturn = async (borrow: Borrow) => {
    setReturningId(borrow._id);
    const toastId = toast.loading(`Returning "${borrow.bookTitle}"...`);

    try {
      const response = await fetch(`/api/borrows/${borrow._id}`, { method: "DELETE" });
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? "Could not return this book. Please try again.");
      }

      setBorrows((current) => current.filter((item) => item._id !== borrow._id));
      toast.success(result.message ?? "Book returned successfully.", { id: toastId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.", {
        id: toastId,
      });
    } finally {
      setReturningId(null);
    }
  };

  const showEmptyState = Boolean(user) && !isLoading && !error && borrows.length === 0;

  return (
    <section className="container mx-auto px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Your reading list
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            My Borrows
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            {user
              ? "Every book you have borrowed, with its due date and a quick way to return it."
              : "Sign in to see the books you have borrowed."}
          </p>
        </div>

        {(isPending || isLoading) && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card p-10 text-sm text-muted-foreground shadow-sm">
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
            />
            Loading your borrows...
          </div>
        )}

        {!isPending && !user && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">You are not signed in</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Sign in to see the books you have borrowed.
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
            <h2 className="text-lg font-semibold text-foreground">
              Could not load your borrows
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {showEmptyState && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
            <h2 className="text-lg font-semibold text-foreground">No borrowed books yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Browse the collection and borrow your first book. It will show up right here.
            </p>
            <Link href="/All-Books" className={`${primaryButtonClass} mt-6`}>
              Browse Books
            </Link>
          </div>
        )}

        {user && !isLoading && !error && borrows.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] text-left text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th scope="col" className={headCellClass}>
                      Image
                    </th>
                    <th scope="col" className={headCellClass}>
                      Title
                    </th>
                    <th scope="col" className={headCellClass}>
                      Borrow Date
                    </th>
                    <th scope="col" className={headCellClass}>
                      Return Date
                    </th>
                    <th scope="col" className={`${headCellClass} text-right`}>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {borrows.map((borrow) => {
                    const coverSrc = getCoverSrc(borrow.bookImage);
                    const isReturning = returningId === borrow._id;

                    return (
                      <tr key={borrow._id} className="align-middle">
                        <td className="px-4 py-4">
                          <div className="relative h-16 w-12 overflow-hidden rounded-md bg-muted ring-1 ring-border">
                            {coverSrc ? (
                              <Image
                                src={coverSrc}
                                alt={`Cover of ${borrow.bookTitle}`}
                                fill
                                unoptimized
                                sizes="3rem"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-center text-[0.5625rem] leading-tight text-muted-foreground">
                                No cover
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <Link
                            href={`/All-Books/${borrow.bookId}`}
                            className="line-clamp-2 font-semibold text-foreground transition hover:text-brand"
                          >
                            {borrow.bookTitle}
                          </Link>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">
                          {formatDate(borrow.borrowDate)}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">
                          {formatDate(borrow.returnDate)}
                        </td>

                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleReturn(borrow)}
                            disabled={isReturning}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isReturning && (
                              <span
                                aria-hidden="true"
                                className="size-3 animate-spin rounded-full border-2 border-brand/30 border-t-brand"
                              />
                            )}
                            {isReturning ? "Returning..." : "Return Book"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBorrowsPage;
