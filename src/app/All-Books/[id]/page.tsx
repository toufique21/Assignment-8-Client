import { Suspense } from "react";
import { BookDetails, BookDetailsSkeleton } from "./BookDetails";

const BookDetailsPage = () => (
  <Suspense fallback={<BookDetailsSkeleton />}>
    <BookDetails />
  </Suspense>
);

export default BookDetailsPage;
