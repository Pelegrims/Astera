import { listRequests } from "@/lib/store";
import { Container } from "@/components/ui/Container";
import { RequestsTable } from "@/components/admin/RequestsTable";

export const metadata = { title: "Admin — Astera" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const requests = await listRequests();

  return (
    <main className="min-h-screen py-12">
      <Container width="lg">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
          Admin
        </p>
        <h1 className="mt-2 font-display text-2xl font-medium sm:text-3xl">
          Requests
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {requests.length} total · newest first
        </p>

        <div className="mt-8">
          <RequestsTable requests={requests} />
        </div>
      </Container>
    </main>
  );
}
