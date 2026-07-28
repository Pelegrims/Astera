import { notFound } from "next/navigation";
import Link from "next/link";
import { getRequestById } from "@/lib/store";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/Badge";
import { ReportEditor } from "@/components/admin/ReportEditor";

export const dynamic = "force-dynamic";

export default async function AdminEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const request = await getRequestById(params.id);
  if (!request) notFound();

  return (
    <main className="min-h-screen py-12">
      <Container width="lg">
        <Link
          href="/admin"
          className="text-xs text-ink-faint hover:text-ink-muted"
        >
          ← All requests
        </Link>

        <div className="mt-3 flex items-center gap-3">
          <h1 className="font-display text-2xl font-medium sm:text-3xl">
            {request.firstName}&apos;s report
          </h1>
          <StatusBadge status={request.status} />
        </div>

        <div className="mt-8">
          <ReportEditor request={request} />
        </div>
      </Container>
    </main>
  );
}
