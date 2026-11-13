"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { BOOKS_API } from "@/lib/books";

const BOOK_CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"] as const;

const initialForm = {
  title: "",
  author: "",
  category: BOOK_CATEGORIES[0] as string,
  imageUrl: "",
  copies: "1",
  description: "",
};

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const AddBooksPage = () => {
  const { user, isPending } = useRequireAuth();

  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      toast.error("Please sign in before adding a book.");
      return;
    }

    if (!isHttpUrl(form.imageUrl)) {
      toast.error("Please paste a valid image link from ImgBB.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Adding your book...");

    try {
      const bookResponse = await fetch(`${BOOKS_API}/Add-Book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          copies: Number(form.copies),
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          createdAt: new Date().toISOString(),
        }),
      });
      const bookResult = (await bookResponse.json()) as { message?: string; error?: string };

      if (!bookResponse.ok) {
        throw new Error(bookResult.error ?? "Could not save the book. Please try again.");
      }

      toast.success("Book added successfully!", { id: toastId });
      setForm(initialForm);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(form);

  if (!user) {
    return (
      <section className="container mx-auto px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card p-10 text-sm text-muted-foreground shadow-sm">
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
            />
            {isPending ? "Checking your session..." : "Redirecting to sign in..."}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Share a story
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Add a New Book
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Fill in the details below and add a new book to the BookNook collection.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className={labelClass}>
                Book Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. The Silent Library"
                required
                maxLength={150}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="author" className={labelClass}>
                Author Name
              </label>
              <input
                id="author"
                name="author"
                type="text"
                value={form.author}
                onChange={handleChange}
                placeholder="e.g. Jane Austen"
                required
                maxLength={120}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>
                Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
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
              <label htmlFor="copies" className={labelClass}>
                Number of Copies
              </label>
              <input
                id="copies"
                name="copies"
                type="number"
                value={form.copies}
                onChange={handleChange}
                placeholder="e.g. 3"
                required
                min={1}
                max={9999}
                step={1}
                className={inputClass}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                How many copies of this book are available to borrow?
              </p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="imageUrl" className={labelClass}>
                Book Image Link
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://i.ibb.co/xxxxx/cover.jpg"
                required
                className={inputClass}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Upload the cover to ImgBB and paste the image link here.
              </p>
            </div>

            {/* <div className="sm:col-span-2">
              <span className={labelClass}>Image Preview</span>
              <div className="flex min-h-28 items-center gap-4 rounded-lg border border-dashed border-border bg-muted/30 p-3">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Book cover preview"
                    width={80}
                    height={112}
                    unoptimized
                    className="h-24 w-16 shrink-0 rounded-md object-cover ring-1 ring-border"
                  />
                ) : (
                  <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-md bg-muted text-center text-[0.625rem] leading-tight text-muted-foreground">
                    No cover
                  </div>
                )}
                <p className="min-w-0 break-all text-xs text-muted-foreground">
                  {imagePreview ?? "Paste an ImgBB image link above to preview the cover."}
                </p>
              </div>
            </div> */}

            <div className="sm:col-span-2">
              <label htmlFor="description" className={labelClass}>
                Short Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell readers what this book is about in a sentence or two..."
                required
                rows={4}
                maxLength={1000}
                className={`${inputClass} resize-y`}
              />
            </div>

            <div>
              <label htmlFor="userName" className={labelClass}>
                User Name
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                value={user?.name ?? ""}
                placeholder={isPending ? "Loading your profile..." : "Sign in to load your name"}
                readOnly
                aria-readonly="true"
                className={`${inputClass} cursor-not-allowed bg-muted/60 text-muted-foreground`}
              />
            </div>

            <div>
              <label htmlFor="userEmail" className={labelClass}>
                Email
              </label>
              <input
                id="userEmail"
                name="userEmail"
                type="email"
                value={user?.email ?? ""}
                placeholder={isPending ? "Loading your profile..." : "Sign in to load your email"}
                readOnly
                aria-readonly="true"
                className={`${inputClass} cursor-not-allowed bg-muted/60 text-muted-foreground`}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse items-stretch gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Your name, email and the date added are saved automatically.
            </p>
            <button
              type="submit"
            //   disabled={!user || isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && (
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-brand-foreground/40 border-t-brand-foreground"
                />
              )}
              {isSubmitting ? "Adding book..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddBooksPage;
