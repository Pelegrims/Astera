import { Container } from "@/components/ui/Container";
import { BaziCalculator } from "@/components/bazi/BaziCalculator";

export const metadata = {
  title: "Free BaZi Chart Calculator — Astera",
  description:
    "Calculate your Four Pillars (BaZi) chart free — Year, Month, Day, and Hour pillars, Day Master, Five Elements balance, and your 10-year luck cycles.",
};

export default function BaziPage() {
  return (
    <main className="min-h-screen bg-bg pb-20 pt-16 sm:pt-24">
      <Container width="lg">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-lg tracking-[0.15em] text-burgundy">
            ASTERA
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-ink-faint">
            Free Chart Calculator
          </p>
          <h1 className="mt-5 text-balance font-display text-3xl font-medium leading-tight text-aubergine sm:text-4xl">
            Your Four Pillars,
            <br />
            <span className="italic text-burgundy">calculated instantly.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-balance text-base leading-relaxed text-ink-muted">
            BaZi (八字), the Chinese "Four Pillars of Destiny" — enter your
            birth details for a free chart: your pillars, Day Master, five
            element balance, and 10-year luck cycles.
          </p>
        </div>

        <div className="mt-12">
          <BaziCalculator />
        </div>
      </Container>
    </main>
  );
}
