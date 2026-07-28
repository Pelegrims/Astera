import { notFound } from "next/navigation";
import { getRequestById } from "@/lib/store";
import { Container } from "@/components/ui/Container";
import { OrbitDivider } from "@/components/ui/OrbitDivider";
import { ReportSection } from "@/components/report/ReportSection";
import { LinkButton } from "@/components/ui/Button";
import { FOCUS_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PublicReportPage({
  params,
}: {
  params: { id: string };
}) {
  const request = await getRequestById(params.id);
  if (!request) notFound();

  const isReady = request.status === "ready" || request.status === "sent";

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center bg-aurora py-20">
        <Container width="sm" className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-faint">
            In progress
          </p>
          <h1 className="mt-4 font-display text-2xl font-medium">
            {request.firstName}, your report is still being written.
          </h1>
          <OrbitDivider className="my-6" />
          <p className="text-sm leading-relaxed text-ink-muted">
            We&apos;ll email you the moment it&apos;s ready. Check back on
            this link any time.
          </p>
        </Container>
      </main>
    );
  }

  const sections = [
    { title: "Your Core Energy", body: request.report.coreEnergy },
    { title: "Love & Relationships", body: request.report.loveAndRelationships },
    { title: "Career & Money", body: request.report.careerAndMoney },
    { title: "Current Planetary Focus", body: request.report.currentPlanetaryFocus },
    { title: "Personal Recommendations", body: request.report.personalRecommendations },
  ].filter((s) => s.body.trim().length > 0);

  return (
    <main className="min-h-screen bg-aurora pb-24 pt-16 sm:pt-24">
      <Container width="sm">
        <div className="text-center">
          <p className="font-display text-sm tracking-[0.15em] text-aubergine">
            ASTERA
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-ink-faint">
            Private report · {FOCUS_LABELS[request.focus]}
          </p>
          <h1 className="mt-4 text-balance font-display text-3xl font-medium sm:text-4xl">
            {request.firstName}
          </h1>
          <p className="mt-2 text-xs text-ink-faint">
            {request.birthLocation} · {request.birthDate}
            {request.birthTime ? ` · ${request.birthTime}` : ""}
          </p>
        </div>

        <OrbitDivider className="my-10" />

        <div>
          {sections.map((s) => (
            <ReportSection key={s.title} title={s.title} body={s.body} />
          ))}
        </div>

        <div className="mt-12 rounded-xl2 border border-line bg-bg-surface/50 p-8 text-center">
          <h2 className="font-display text-xl font-medium">
            Want to go deeper?
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
            This report is a starting point. A private reading gives you time
            to ask questions and work through what it means for you
            specifically.
          </p>
          <div className="mt-6 flex justify-center">
            <LinkButton href="mailto:hello@solace.app?subject=Private%20reading">
              Book a Private Reading
            </LinkButton>
          </div>
        </div>
      </Container>
    </main>
  );
}
