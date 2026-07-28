import { Container } from "@/components/ui/Container";
import { OrbitDivider } from "@/components/ui/OrbitDivider";

const steps = [
  {
    number: "01",
    title: "Answer a short quiz",
    body: "Your birth date, time, and location — the only inputs a chart actually needs. Every question explains why it matters.",
  },
  {
    number: "02",
    title: "An astrologer studies your chart",
    body: "No auto-generated text. A person reads your placements and writes toward the one area of life you're focused on right now.",
  },
  {
    number: "03",
    title: "Your report arrives, privately",
    body: "A single link, just for you. Read it whenever you're ready — it stays yours to keep.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <Container>
        <h2 className="text-center font-display text-2xl font-medium sm:text-3xl">
          How your report comes together
        </h2>
        <OrbitDivider className="mt-6" />
        <div className="mt-8 flex flex-col gap-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl2 border border-line bg-bg-surface/40 p-6"
            >
              <span className="font-mono text-xs text-gold-soft">
                {step.number}
              </span>
              <h3 className="mt-2 font-display text-lg font-medium">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
