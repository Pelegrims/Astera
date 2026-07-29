"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";

const faqs = [
  {
    q: "Is this written by a real person, or generated automatically?",
    a: "Every report is read and written personally by Julia, our astrologer. Nothing here is auto-generated — the whole point is a real, considered reading.",
  },
  {
    q: "What if I don't know my exact birth time?",
    a: "That's common. Let us know in the quiz — Julia can still write a meaningful report using your date and location; some placements (like your rising sign) will simply be noted as approximate.",
  },
  {
    q: "How long does it take to get my report?",
    a: "Usually within 24 hours. You'll get an email with a private link the moment it's ready.",
  },
  {
    q: "Is my birth and personal information kept private?",
    a: "Yes. Your report link is private and isn't indexed or shared — only you (and anyone you choose to share the link with) can view it.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20">
      <Container width="md">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
            Questions
          </p>
          <h2 className="mt-2 font-display text-2xl font-medium text-aubergine sm:text-3xl">
            Before you start
          </h2>
        </div>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-medium text-ink">{item.q}</span>
                  <span
                    className={`shrink-0 text-xl text-burgundy transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-5 text-sm leading-relaxed text-ink-muted">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
