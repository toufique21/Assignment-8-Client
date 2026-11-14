"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

const faqs = [
  {
    question: "How do I create a BookNook account?",
    answer:
      "Head to the Sign Up page and register with your name, email, and a password — or continue with Google or GitHub. Once you're in, you can start browsing and borrowing right away.",
  },
  {
    question: "How do I find a book to borrow?",
    answer:
      "Open the All Books page to browse the full shelf, or check the Recently Added Books section on the home page for the newest arrivals. Click any cover to see the details.",
  },
  {
    question: "How do I borrow a book?",
    answer:
      "Open a book's details page and choose Borrow. The book is added to your My Borrows list so you always know what you currently have on loan.",
  },
  {
    question: "How do I add my own book to the shelf?",
    answer:
      "Go to the Add Books page, fill in the title, author, cover image, and other details, then submit. Your book appears on the shelf and in My Books, where you can edit or remove it later.",
  },
  {
    question: "Where can I track the books I've borrowed?",
    answer:
      "The My Borrows page lists every book you currently have on loan. Once you return a book it drops off the active list.",
  },
  {
    question: "Can I update or delete a book I added?",
    answer:
      "Yes. Visit My Books to see everything you've shared, then use the edit or delete actions on any listing to keep your shelf up to date.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="relative overflow-hidden bg-background py-20"
    >
      {/* Soft brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 size-72 rounded-full bg-brand/5 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand dark:text-brand-foreground">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          >
            How to use BookNook
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            New here? These quick answers walk you through signing up,
            borrowing, and sharing books on BookNook.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <article
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand"
                  >
                    <span className="text-base font-semibold text-foreground">
                      {faq.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/5 text-brand ring-1 ring-brand/10 transition-transform duration-300 dark:bg-brand-foreground/10 dark:text-brand-foreground dark:ring-brand-foreground/10 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <HugeiconsIcon
                        icon={ArrowDown01Icon}
                        size={18}
                        strokeWidth={2}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  hidden={!isOpen}
                  className="px-6 pb-5"
                >
                  <p className="text-sm leading-6 text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
