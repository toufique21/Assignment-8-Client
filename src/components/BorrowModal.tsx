"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import type { Book } from "@/lib/books";
import { addDays, BORROW_PERIOD_DAYS } from "@/lib/borrows";

const inputClass =
  "w-full rounded-lg border border-border bg-muted/60 px-3 py-2.5 text-sm text-muted-foreground shadow-sm outline-none";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

type BorrowModalProps = {
  book: Book;
  userName: string;
  userEmail: string;
  onClose: () => void;
  onBorrowed?: () => void;
};

const BorrowModal = ({
  book,
  userName,
  userEmail,
  onClose,
  onBorrowed,
}: BorrowModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const borrowDate = new Date();
  const returnDate = addDays(borrowDate, BORROW_PERIOD_DAYS);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const toastId = toast.loading("Borrowing this book...");

    try {
      const response = await fetch("/api/borrows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book._id }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? "Could not borrow this book. Please try again.");
      }

      toast.success(result.message ?? "Book borrowed successfully!", { id: toastId });
      onBorrowed?.();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="borrow-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="borrow-modal-title"
              className="text-xl font-bold tracking-tight text-foreground"
            >
              Borrow this book
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {book.title} by {book.author}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close borrow dialog"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-lg leading-none text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="borrow-user-name" className={labelClass}>
              User Name
            </label>
            <input
              id="borrow-user-name"
              type="text"
              value={userName}
              readOnly
              aria-readonly="true"
              className={`${inputClass} cursor-not-allowed`}
            />
          </div>

          <div>
            <label htmlFor="borrow-user-email" className={labelClass}>
              Email
            </label>
            <input
              id="borrow-user-email"
              type="email"
              value={userEmail}
              readOnly
              aria-readonly="true"
              className={`${inputClass} cursor-not-allowed`}
            />
          </div>

          <dl className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/30 p-4 text-xs">
            <div>
              <dt className="font-medium text-muted-foreground uppercase tracking-wide">
                Borrow date
              </dt>
              <dd className="mt-1 font-semibold text-foreground">{formatDate(borrowDate)}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground uppercase tracking-wide">
                Return by
              </dt>
              <dd className="mt-1 font-semibold text-foreground">{formatDate(returnDate)}</dd>
            </div>
          </dl>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && (
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-brand-foreground/40 border-t-brand-foreground"
                />
              )}
              {isSubmitting ? "Borrowing..." : "Confirm Borrow"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default BorrowModal;
