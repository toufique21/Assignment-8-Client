import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { addDays, BORROW_PERIOD_DAYS } from "@/lib/borrows";
import { db } from "@/lib/db";

const bookCollection = db.collection("Book");
const borrowsCollection = db.collection("borrows");

type BorrowRequestBody = {
  bookId?: unknown;
};

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return Response.json({ error: "You must be signed in to view your borrows." }, { status: 401 });
  }

  try {
    const bookId = new URL(request.url).searchParams.get("bookId")?.trim();

    // Used by the borrow button to know whether this reader currently has the book.
    if (bookId) {
      const existingBorrow = await borrowsCollection.findOne({
        userEmail: session.user.email,
        bookId,
        returnedAt: { $exists: false },
      });

      return Response.json({ borrowed: Boolean(existingBorrow) });
    }

    const borrows = await borrowsCollection
      .find({ userEmail: session.user.email, returnedAt: { $exists: false } })
      .sort({ borrowDate: -1 })
      .toArray();

    return Response.json(borrows);
  } catch (error) {
    console.dir(error);
    return Response.json(
      { error: "Could not load your borrows. Please try again." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return Response.json({ error: "You must be signed in to borrow a book." }, { status: 401 });
  }

  let body: BorrowRequestBody;

  try {
    body = (await request.json()) as BorrowRequestBody;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const bookId = typeof body.bookId === "string" ? body.bookId.trim() : "";

  if (!ObjectId.isValid(bookId)) {
    return Response.json({ error: "Invalid book id." }, { status: 400 });
  }

  const objectId = new ObjectId(bookId);

  try {
    const book = await bookCollection.findOne({ _id: objectId });

    if (!book) {
      return Response.json({ error: "Book not found." }, { status: 404 });
    }

    const existingBorrow = await borrowsCollection.findOne({
      userEmail: session.user.email,
      bookId,
      returnedAt: { $exists: false },
    });

    if (existingBorrow) {
      return Response.json(
        { error: "You already have this book borrowed. Return it before borrowing again." },
        { status: 409 },
      );
    }

    const copies = typeof book.copies === "number" ? book.copies : 0;

    if (copies <= 0) {
      return Response.json(
        { error: "No copies of this book are available right now." },
        { status: 409 },
      );
    }

    // Reserve a copy atomically so two readers cannot take the last one.
    const reservation = await bookCollection.updateOne(
      { _id: objectId, copies: { $gt: 0 } },
      { $inc: { copies: -1 } },
    );

    if (reservation.modifiedCount !== 1) {
      return Response.json(
        { error: "No copies of this book are available right now." },
        { status: 409 },
      );
    }

    const borrowDate = new Date();
    const borrow = {
      bookId,
      bookTitle: typeof book.title === "string" ? book.title : "Untitled",
      bookImage: typeof book.imageUrl === "string" ? book.imageUrl : "",
      userEmail: session.user.email,
      borrowDate,
      returnDate: addDays(borrowDate, BORROW_PERIOD_DAYS),
    };

    try {
      const result = await borrowsCollection.insertOne(borrow);

      return Response.json(
        {
          message: "Book borrowed successfully.",
          borrow: { ...borrow, _id: result.insertedId },
        },
        { status: 201 },
      );
    } catch (error) {
      // Put the copy back if the borrow record could not be saved.
      await bookCollection.updateOne({ _id: objectId }, { $inc: { copies: 1 } });
      throw error;
    }
  } catch (error) {
    console.dir(error);
    return Response.json(
      { error: "Could not borrow this book. Please try again." },
      { status: 500 },
    );
  }
}
