import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { OrbitScatter } from "@/components/ui/OrbitScatter";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-bg py-24 text-center">
      <OrbitScatter />
      <Container className="relative">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
          Ready when you are
        </p>
        <h2 className="mt-4 text-balance font-display text-3xl font-medium text-aubergine sm:text-4xl">
          Three minutes now.
          <br />A report you&apos;ll return to for months.
        </h2>
        <div className="mt-8 flex justify-center">
          <LinkButton href="/quiz">Start my reading</LinkButton>
        </div>
      </Container>
    </section>
  );
}
