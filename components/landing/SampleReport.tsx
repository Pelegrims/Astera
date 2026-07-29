import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export function SampleReport() {
  return (
    <section className="bg-bg-raised/40 py-20">
      <Container width="lg">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
            What you actually get
          </p>
          <h2 className="mt-2 font-display text-2xl font-medium text-aubergine sm:text-3xl">
            A real excerpt, not a mock-up
          </h2>
        </div>

        <div className="relative mx-auto mt-10 max-w-xl overflow-hidden rounded-xl2 border border-line bg-bg-surface/70 p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">
            Your Core Energy
          </p>
          <p className="mt-3 text-base leading-relaxed text-ink">
            Priya&apos;s chart centers on a communicative Gemini Sun paired
            with a steady Taurus Moon — a rare mix of curiosity and
            follow-through. Her Venus in Cancer asks for emotional safety
            before openness. The coming season favors depth over pace in
            any new connection...
          </p>

          {/* fade mask signaling the rest continues in the full report */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg-surface to-transparent" />
        </div>

        <p className="mt-4 text-center text-xs text-ink-faint">
          Excerpt from a real client report (shared with permission, name
          changed)
        </p>

        <div className="mt-8 flex justify-center">
          <LinkButton href="/quiz">Get my own report</LinkButton>
        </div>
      </Container>
    </section>
  );
}
