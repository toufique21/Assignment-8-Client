"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrash } from "react-icons/fa";
import { useRequireAuth } from "@/hooks/use-require-auth";
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

const saveButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50";

const editButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50";

const deleteButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-destructive/30 bg-destructive/5 px-4 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive disabled:cursor-not-allowed disabled:opacity-50";

const cancelButtonClass =
  "inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60";

const BOOK_CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"] as const;

type EditForm = {
  title: string;
  author: string;
  category: string;
  imageUrl: string;
  copies: string;
  description: string;
};

const emptyEditForm: EditForm = {
  title: "",
  author: "",
  category: BOOK_CATEGORIES[0],
  imageUrl: "",
  copies: "1",
  description: "",
};

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const headCellClass =
  "px-4 py-3 text-[0.6875rem] font-semibold tracking-wide uppercase text-muted-foreground";

const formatDate = (value?: string) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const MyBooksPage = () => {
  const { user, isPending } = useRequireAuth();
  const userEmail = user?.email;

  const [books, setBooks] = useState<Book[]>([]);
  const [loadedEmail, setLoadedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyEditForm);
  const [isSaving, setIsSaving] = useState(false);

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

  const openEditDialog = (book: Book) => {
    setEditForm({
      title: book.title ?? "",
      author: book.author ?? "",
      category: book.category ?? BOOK_CATEGORIES[0],
      imageUrl: book.imageUrl ?? "",
      copies: typeof book.copies === "number" ? String(book.copies) : "1",
      description: book.description ?? "",
    });
    setBookToEdit(book);
  };

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!bookToEdit) return;

    if (!userEmail) {
      toast.error("Please sign in before editing a book.");
      return;
    }

    if (!isHttpUrl(editForm.imageUrl)) {
      toast.error("Please paste a valid image link from ImgBB.");
      return;
    }

    const copies = Number(editForm.copies);

    if (!Number.isInteger(copies) || copies < 1) {
      toast.error("Number of copies must be a whole number of at least 1.");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving your changes...");

    try {
      const response = await fetch(
        `${BOOKS_API}/My-Books/${bookToEdit._id}?email=${encodeURIComponent(userEmail)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editForm, copies }),
        },
      );
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
        book?: Book;
      };

      if (!response.ok) {
        throw new Error(result.error ?? "Could not update this book. Please try again.");
      }

      const updatedBook = result.book ?? { ...bookToEdit, ...editForm, copies };

      setBooks((current) =>
        current.map((item) => (item._id === updatedBook._id ? updatedBook : item)),
      );
      setBookToEdit(null);
      toast.success(result.message ?? "Book updated successfully.", { id: toastId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.", {
        id: toastId,
      });
    } finally {
      setIsSaving(false);
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
            Only the books you have added to BookNook appear here.
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
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card p-10 text-sm text-muted-foreground shadow-sm">
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
            />
            Redirecting to sign in...
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
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[56rem] text-left text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th scope="col" className={headCellClass}>
                      Image
                    </th>
                    <th scope="col" className={headCellClass}>
                      Title
                    </th>
                    <th scope="col" className={headCellClass}>
                      Author
                    </th>
                    <th scope="col" className={headCellClass}>
                      Category
                    </th>
                    <th scope="col" className={headCellClass}>
                      Copies
                    </th>
                    <th scope="col" className={headCellClass}>
                      Added
                    </th>
                    <th scope="col" className={`${headCellClass} text-right`}>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {books.map((book) => {
                    const coverSrc = getCoverSrc(book.imageUrl);

                    return (
                      <tr key={book._id} className="align-middle">
                        <td className="px-4 py-4">
                          <div className="relative h-16 w-12 overflow-hidden rounded-md bg-muted ring-1 ring-border">
                            {coverSrc ? (
                              <Image
                                src={coverSrc}
                                alt={`Cover of ${book.title}`}
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
                            href={`/All-Books/${book._id}`}
                            className="line-clamp-2 font-semibold text-foreground transition hover:text-brand"
                          >
                            {book.title}
                          </Link>
                          {book.description && (
                            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                              {book.description}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-4 text-muted-foreground">{book.author}</td>

                        <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">
                          {book.category ?? "—"}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[0.6875rem] font-semibold text-brand">
                            {typeof book.copies === "number" ? book.copies : "—"}
                          </span>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">
                          {formatDate(book.createdAt)}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => openEditDialog(book)}
                              disabled={Boolean(deletingId)}
                              className={editButtonClass}
                            >
                              <FaPen aria-hidden="true" className="size-3" />
                              Edit
                            </button>
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
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

        {bookToEdit && (
          <Dialog
            open
            onOpenChange={(open) => {
              if (!open && !isSaving) setBookToEdit(null);
            }}
          >
            <DialogContent
              showCloseButton={!isSaving}
              className="max-h-[calc(100vh-4rem)] overflow-y-auto sm:max-w-lg"
            >
              <DialogHeader>
                <DialogTitle>Edit book</DialogTitle>
                <DialogDescription>
                  Update the details of &ldquo;{bookToEdit.title}&rdquo;. Your name and email
                  can&apos;t be changed.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleEditSubmit} className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="edit-title" className={labelClass}>
                      Book Title
                    </label>
                    <input
                      id="edit-title"
                      name="title"
                      type="text"
                      value={editForm.title}
                      onChange={handleEditChange}
                      placeholder="e.g. The Silent Library"
                      required
                      maxLength={150}
                      disabled={isSaving}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-author" className={labelClass}>
                      Author Name
                    </label>
                    <input
                      id="edit-author"
                      name="author"
                      type="text"
                      value={editForm.author}
                      onChange={handleEditChange}
                      placeholder="e.g. Jane Austen"
                      required
                      maxLength={120}
                      disabled={isSaving}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-category" className={labelClass}>
                      Category
                    </label>
                    <select
                      id="edit-category"
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      required
                      disabled={isSaving}
                      className={inputClass}
                    >
                      {BOOK_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="edit-copies" className={labelClass}>
                      Number of Copies
                    </label>
                    <input
                      id="edit-copies"
                      name="copies"
                      type="number"
                      value={editForm.copies}
                      onChange={handleEditChange}
                      placeholder="e.g. 3"
                      required
                      min={1}
                      max={9999}
                      step={1}
                      disabled={isSaving}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="edit-imageUrl" className={labelClass}>
                    Book Image Link
                  </label>
                  <input
                    id="edit-imageUrl"
                    name="imageUrl"
                    type="url"
                    value={editForm.imageUrl}
                    onChange={handleEditChange}
                    placeholder="https://i.ibb.co/xxxxx/cover.jpg"
                    required
                    disabled={isSaving}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="edit-description" className={labelClass}>
                    Short Description
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    placeholder="Tell readers what this book is about in a sentence or two..."
                    required
                    rows={4}
                    maxLength={1000}
                    disabled={isSaving}
                    className={`${inputClass} resize-y`}
                  />
                </div>

                <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
                  Added by{" "}
                  <span className="font-medium text-foreground">
                    {bookToEdit.userName ?? user?.name ?? "you"}
                  </span>{" "}
                  ·{" "}
                  <span className="font-medium text-foreground">
                    {bookToEdit.userEmail ?? userEmail}
                  </span>
                  <span className="mt-0.5 block">Name and email are read-only.</span>
                </div>

                <DialogFooter>
                  <button
                    type="button"
                    onClick={() => setBookToEdit(null)}
                    disabled={isSaving}
                    className={cancelButtonClass}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={isSaving} className={saveButtonClass}>
                    {isSaving && (
                      <span
                        aria-hidden="true"
                        className="size-3 animate-spin rounded-full border-2 border-brand-foreground/40 border-t-brand-foreground"
                      />
                    )}
                    {isSaving ? "Saving..." : "Save changes"}
                  </button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
};

export default MyBooksPage;
