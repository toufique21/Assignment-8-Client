import { HugeiconsIcon } from "@hugeicons/react";
import {
    BooksIcon,
    HeartHandshakeIcon,
    UserGroupIcon,
} from "@hugeicons/core-free-icons";

const features = [
    {
        icon: UserGroupIcon,
        stat: "1,000+",
        title: "Happy readers",
        description:
            "A growing community of readers discovering, borrowing, and sharing books every day.",
    },
    {
        icon: BooksIcon,
        stat: "1M+",
        title: "Online books",
        description:
            "Millions of titles across fiction, history, science, and more — all available from one place.",
    },
    {
        icon: HeartHandshakeIcon,
        stat: "Free",
        title: "Borrow & share",
        description:
            "Borrow a book for a few days or add your own to the shelf, making reading easier and more affordable for everyone.",
    },
];

const About = () => {
    return (
        <section
            aria-labelledby="about-heading"
            className="relative overflow-hidden bg-background py-20"
        >
            {/* Soft brand glows */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 top-0 size-72 rounded-full bg-brand/5 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-brand/5 blur-3xl"
            />

            <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand dark:text-brand-foreground">
                        About BookNook
                    </p>
                    <h2
                        id="about-heading"
                        className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                    >
                        A world of books, one click away
                    </h2>
                    <p className="mt-4 text-base leading-7 text-muted-foreground">
                        BookNook is an online book library built to make reading
                        simpler. Discover new titles, borrow the ones you love, and
                        share your own shelf with a growing community.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {features.map((feature) => (
                        <article
                            key={feature.title}
                            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div
                                aria-hidden="true"
                                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            />

                            <div className="flex size-12 items-center justify-center rounded-xl bg-brand/5 text-brand ring-1 ring-brand/10 transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground dark:bg-brand-foreground/10 dark:text-brand-foreground dark:ring-brand-foreground/10">
                                <HugeiconsIcon
                                    icon={feature.icon}
                                    size={24}
                                    strokeWidth={1.7}
                                />
                            </div>

                            <p className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                                {feature.stat}
                            </p>
                            <h3 className="mt-1 text-sm font-semibold text-foreground">
                                {feature.title}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                {feature.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
