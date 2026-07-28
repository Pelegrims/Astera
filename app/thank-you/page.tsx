import { Container } from "@/components/ui/Container";
import { OrbitDivider } from "@/components/ui/OrbitDivider";
import { LinkButton } from "@/components/ui/Button";

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: { name?: string };
}) {
  const name = searchParams.name;

  return (
    <main className="flex min-h-screen items-center bg-aurora py-20">
      <Container width="sm" className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-faint">
          Received
        </p>
        <h1 className="mt-4 text-balance font-display text-3xl font-medium">
          {name ? `Thank you, ${name}.` : "Thank you."}
        </h1>
        <OrbitDivider className="my-6" />
        <p className="text-balance text-base leading-relaxed text-ink-muted">
          Your astrologer is studying your chart now. Reports are usually
          ready within 24 hours — we'll email you a private link the moment
          it's done.
        </p>
        <p className="mt-6 text-sm text-ink-faint">
          Nothing else to do for now. Feel free to close this tab.
        </p>
        <div className="mt-10">
          <LinkButton href="/" variant="secondary">
            Back to home
          </LinkButton>
        </div>
      </Container>
    </main>
  );
}
