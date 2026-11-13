"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import type { Book } from "@/lib/books";
import { cn } from "@/lib/utils";
import BorrowModal from "./BorrowModal";

const primaryClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50";

type BorrowBookButtonProps = {
  book: Book;
  className?: string;
  onBorrowed?: () => void;
};

const BorrowBookButton = ({ book, className, onBorrowed }: BorrowBookButtonProps) => {
  const { data: session, isPending } = authClient.useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentlyBorrowed, setCurrentlyBorrowed] = useState(false);
  const [checkedEmail, setCheckedEmail] = useState<string | null>(null);

  const copies = typeof book.copies === "number" ? book.copies : 0;
  const isOutOfStock = copies <= 0;
  const user = session?.user;
  const userEmail = user?.email;

  useEffect(() => {
    if (!userEmail) return;

    const controller = new AbortController();

    fetch(`/api/borrows?bookId=${encodeURIComponent(book._id)}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) return { borrowed: false };

        return response.json() as Promise<{ borrowed?: boolean }>;
      })
      .then((result) => {
        if (controller.signal.aborted) return;

        setCurrentlyBorrowed(Boolean(result.borrowed));
        setCheckedEmail(userEmail);
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        setCurrentlyBorrowed(false);
        setCheckedEmail(userEmail);
      });

    return () => controller.abort();
  }, [book._id, userEmail]);

  const hasActiveBorrow = Boolean(userEmail) && checkedEmail === userEmail && currentlyBorrowed;
  const isCheckingBorrow = Boolean(userEmail) && checkedEmail !== userEmail;

  const handleClick = () => {
    if (!user) {
      toast.error("Please sign in to borrow this book.");
      return;
    }

    setIsModalOpen(true);
  };

  const handleBorrowed = () => {
    setCurrentlyBorrowed(true);
    setCheckedEmail(userEmail ?? null);
    onBorrowed?.();
  };

  const isDisabled = isOutOfStock || isPending || hasActiveBorrow || isCheckingBorrow;

  return (
    <div className={cn("flex flex-col gap-1.5 sm:items-end", className)}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        title={
          hasActiveBorrow
            ? "You already have this book borrowed."
            : isOutOfStock
              ? "No copies of this book are available right now."
              : undefined
        }
        className={cn(primaryClass, "w-full sm:w-auto")}
      >
        {hasActiveBorrow
          ? "Currently Borrowed"
          : isOutOfStock
            ? "Out of Stock"
            : "Borrow This Book"}
      </button>

      {hasActiveBorrow && (
        <p className="max-w-xs text-xs text-muted-foreground sm:text-right">
          You already have this book borrowed. Return it from My Borrows before
          borrowing it again.
        </p>
      )}

      {isModalOpen && user && (
        <BorrowModal
          book={book}
          userName={user.name}
          userEmail={user.email}
          onClose={() => setIsModalOpen(false)}
          onBorrowed={handleBorrowed}
        />
      )}
    </div>
  );
};

export default BorrowBookButton;
