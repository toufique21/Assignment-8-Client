import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const BOOK_CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"] as const;

type BookRequestBody = {
  title?: unknown;
  author?: unknown;
  category?: unknown;
  imageUrl?: unknown;
  description?: unknown;
};

const readText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return Response.json({ error: "You must be signed in to add a book." }, { status: 401 });
  }

  let body: BookRequestBody;

  try {
    body = (await request.json()) as BookRequestBody;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = readText(body.title);
  const author = readText(body.author);
  const category = readText(body.category);
  const imageUrl = readText(body.imageUrl);
  const description = readText(body.description);

  if (!title || !author || !category || !imageUrl || !description) {
    return Response.json({ error: "All book fields are required." }, { status: 400 });
  }

  if (!BOOK_CATEGORIES.includes(category as (typeof BOOK_CATEGORIES)[number])) {
    return Response.json({ error: "Please choose a valid category." }, { status: 400 });
  }

  if (!isHttpUrl(imageUrl)) {
    return Response.json({ error: "Please provide a valid image link." }, { status: 400 });
  }

  const book = {
    title,
    author,
    category,
    imageUrl,
    description,
    userId: session.user.id,
    userName: session.user.name,
    userEmail: session.user.email,
    createdAt: new Date(),
  };

  const result = await db.collection("books").insertOne(book);

  return Response.json(
    {
      message: "Book added successfully.",
      book: { ...book, _id: result.insertedId },
    },
    { status: 201 },
  );
}
