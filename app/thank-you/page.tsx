import { getRequestById } from "@/lib/store";
import { Container } from "@/components/ui/Container";
import { OrbitDivider } from "@/components/ui/OrbitDivider";
import { LinkButton } from "@/components/ui/Button";
import { BaziFreePreview } from "@/components/bazi/BaziFreePreview";

export const dynamic = "force-dynamic";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: { id?: string; name?: string };
}) {
  const request = searchParams.id
    ? await getRequestById(searchParams.id)
    : null;
  // Falls back to the old ?name= param so any already-shared/bookmarked
  // links from before this change still show a sensible thank-you page.
  const name = request?.firstName ?? searchParams.name;

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

      {request && (
        <Container width="lg">
          <BaziFreePreview
            firstName={request.firstName}
            birthDate={request.birthDate}
            birthTime={request.birthTime}
            gender={request.gender}
            utcOffset={request.utcOffset}
          />
        </Container>
      )}
    </main>
  );
}
