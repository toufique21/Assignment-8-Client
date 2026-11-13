export const BORROW_PERIOD_DAYS = 14;

export type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage?: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
  returnedAt?: string;
};

/** Adds whole days to a date without mutating it. */
export const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
