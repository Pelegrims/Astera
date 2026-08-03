import { Container } from "@/components/ui/Container";
import { OrbitDivider } from "@/components/ui/OrbitDivider";
import { LinkButton } from "@/components/ui/Button";
import { BaziFreePreview } from "@/components/bazi/BaziFreePreview";

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: {
    name?: string;
    firstName?: string;
    birthDate?: string;
    birthTime?: string;
    gender?: string;
    utcOffset?: string;
  };
}) {
  // Support both the new params and the old ?name= link, so anything
  // already shared/bookmarked before this change still shows a sensible page.
  const name = searchParams.firstName ?? searchParams.name;
  const hasBaziData =
    searchParams.firstName && searchParams.birthDate && searchParams.gender;

  return (
    <main className="min-h-screen bg-aurora py-20">
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
          ready within 24 hours — we&apos;ll email you a private link the
          moment it&apos;s done.
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

      {hasBaziData && (
        <Container width="lg">
          <BaziFreePreview
            firstName={searchParams.firstName!}
            birthDate={searchParams.birthDate!}
            birthTime={searchParams.birthTime || undefined}
            gender={searchParams.gender as "male" | "female"}
            utcOffset={Number(searchParams.utcOffset ?? -5)}
          />
        </Container>
      )}
    </main>
  );
}
