const BOOKS_API_FALLBACK = "http://localhost:8000";

/** Base URL of the companion book API, configured through NEXT_PUBLIC_BOOKS_API. */
export const BOOKS_API = (
  process.env.NEXT_PUBLIC_BOOKS_API || BOOKS_API_FALLBACK
).replace(/\/+$/, "");

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
