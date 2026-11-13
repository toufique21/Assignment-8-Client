import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/lib/books";
import { getCoverSrc } from "@/lib/images";

const detailButtonClass =
  "mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const BookCard = ({ book }: { book: Book }) => {
  const coverSrc = getCoverSrc(book.imageUrl);

  return (
    <li className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        {coverSrc ? (
          <Image
            src={coverSrc}
            alt={`Cover of ${book.title}`}
            fill
            unoptimized
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
            No cover
          </div>
        )}

        {book.category && (
          <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-foreground uppercase shadow-sm backdrop-blur">
            {book.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-5">
        <h2 className="line-clamp-2 text-base font-bold text-foreground">
          {book.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          by <span className="font-semibold">{book.author}</span>
        </p>

        <Link href={`/All-Books/${book._id}`} className={detailButtonClass}>
          View Details
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </li>
  );
};

export default BookCard;
