import { Container } from "@/components/ui/Container";
import { BaziCalculator } from "@/components/bazi/BaziCalculator";

export const metadata = {
  title: "Free Multi-System Chart Calculator — Astera",
  description:
    "Enter your birth details once and get three free readings: Western astrology (planets, houses, aspects), BaZi Four Pillars, and Matrix of Destiny.",
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
            One birth chart,
            <br />
            <span className="italic text-burgundy">three systems.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-balance text-base leading-relaxed text-ink-muted">
            Enter your birth details once — get a free reading across
            Western astrology (planets, houses, aspects), BaZi (Chinese Four
            Pillars), and Matrix of Destiny, side by side.
          </p>
        </div>

        <div className="mt-12">
          <BaziCalculator />
        </div>
      </Container>
    </main>
  );
}
