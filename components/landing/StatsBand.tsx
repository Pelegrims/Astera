import { Container } from "@/components/ui/Container";

const stats = [
  { value: "500+", label: "Reports written" },
  { value: "4.9", label: "Average rating" },
  { value: "24h", label: "Typical delivery" },
];

const testimonials = [
  {
    quote:
      "Finally, a reading that didn't tell me what I wanted to hear.",
    author: "Amanda R.",
    location: "Austin, TX",
  },
  {
    quote:
      "It read like someone who actually looked at my chart, not a template.",
    author: "Daniel K.",
    location: "Denver, CO",
  },
];

export function StatsBand() {
  return (
    <section className="bg-burgundy py-20">
      <Container width="lg">
        <div className="grid gap-10 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl font-medium text-petal">
                {s.value}
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-white/60">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-2">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="rounded-xl2 border border-white/15 bg-white/5 p-6"
            >
              <p className="text-sm leading-relaxed text-white/90">
                &quot;{t.quote}&quot;
              </p>
              <p className="mt-3 text-xs text-white/50">
                {t.author} · {t.location}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
