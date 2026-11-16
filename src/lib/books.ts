const booksApiUrl = process.env.NEXT_PUBLIC_BOOK_API;

if (!booksApiUrl) {
  throw new Error(
    "NEXT_PUBLIC_BOOK_API is not set. Add the book API base URL to your .env file.",
  );
}

/** Base URL of the companion book API (NEXT_PUBLIC_BOOK_API). */
export const BOOKS_API = booksApiUrl.replace(/\/+$/, "");

export type Book = {
  _id: string;
  title: string;
  author: string;
  category?: string;
  imageUrl?: string;
  description?: string;
  copies?: number;
  createdAt?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
};
