const SKELETON_CARDS = Array.from({ length: 6 });

const Loading = () => {
  return (
    <section
      aria-busy="true"
      className="container mx-auto px-4 py-10 sm:py-14"
    >
      <div className="mx-auto max-w-6xl">
        <p role="status" className="sr-only">
          Loading, please wait…
        </p>

        <div aria-hidden="true" className="mb-8 space-y-3">
          <div className="h-3 w-40 animate-pulse rounded-full bg-muted" />
          <div className="h-9 w-72 max-w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-full max-w-lg animate-pulse rounded bg-muted" />
        </div>

        <ul aria-hidden="true" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SKELETON_CARDS.map((_, index) => (
            <li
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="aspect-[3/4] w-full animate-pulse bg-muted" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-16 animate-pulse rounded-full bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded-full bg-muted" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Loading;
