import { Container } from "@/components/ui/Container";

export function TrustStrip() {
  return (
    <section className="border-y border-line py-10">
      <Container>
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-bg-surface font-display text-sm text-gold-soft">
            AR
          </div>
          <div>
            <p className="text-sm leading-relaxed text-ink">
              "Finally, a reading that didn&apos;t tell me what I wanted to hear."
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              Amanda R. · Austin, TX
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
