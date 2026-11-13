import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const bookCollection = db.collection("Book");
const borrowsCollection = db.collection("borrows");

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return Response.json({ error: "You must be signed in to return a book." }, { status: 401 });
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid borrow id." }, { status: 400 });
  }

  try {
    const borrow = await borrowsCollection.findOne({
      _id: new ObjectId(id),
      userEmail: session.user.email,
      returnedAt: { $exists: false },
    });

    if (!borrow) {
      return Response.json({ error: "Borrow record not found." }, { status: 404 });
    }

    // Keep the record so the same reader cannot borrow this book again.
    await borrowsCollection.updateOne(
      { _id: borrow._id },
      { $set: { returnedAt: new Date() } },
    );

    if (typeof borrow.bookId === "string" && ObjectId.isValid(borrow.bookId)) {
      await bookCollection.updateOne(
        { _id: new ObjectId(borrow.bookId) },
        { $inc: { copies: 1 } },
      );
    }

    return Response.json({ message: "Book returned successfully." });
  } catch (error) {
    console.dir(error);
    return Response.json(
      { error: "Could not return this book. Please try again." },
      { status: 500 },
    );
  }
}
