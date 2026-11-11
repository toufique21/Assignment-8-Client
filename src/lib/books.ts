export const BOOKS_API = "http://localhost:8000";

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
