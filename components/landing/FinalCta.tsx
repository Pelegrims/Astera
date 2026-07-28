import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function FinalCta() {
  return (
    <section className="bg-dusk py-20 text-center">
      <Container>
        <h2 className="text-balance font-display text-2xl font-medium text-white sm:text-3xl">
          Three minutes now.
          <br />A report you&apos;ll return to for months.
        </h2>
        <div className="mt-8 flex justify-center">
          <LinkButton href="/quiz" variant="onDark">
            Start my reading
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
