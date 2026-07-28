import Link from "next/link";
import { ClientRequest, FOCUS_LABELS } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function RequestsTable({ requests }: { requests: ClientRequest[] }) {
  if (requests.length === 0) {
    return (
      <div className="rounded-xl2 border border-line bg-bg-surface/40 p-10 text-center text-sm text-ink-muted">
        No requests yet. New quiz submissions will show up here.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl2 border border-line">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-bg-surface/60 text-xs uppercase tracking-wide text-ink-faint">
            <th className="px-4 py-3 font-medium">Client</th>
            <th className="px-4 py-3 font-medium">Focus</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">
              Received
            </th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr
              key={r.id}
              className="border-b border-line last:border-0 hover:bg-bg-surface/40"
            >
              <td className="px-4 py-4">
                <p className="font-medium text-ink">{r.firstName}</p>
                <p className="text-xs text-ink-faint">{r.email}</p>
              </td>
              <td className="px-4 py-4 text-ink-muted">
                {FOCUS_LABELS[r.focus]}
              </td>
              <td className="hidden px-4 py-4 text-ink-muted sm:table-cell">
                {formatDate(r.createdAt)}
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-4 py-4 text-right">
                <Link
                  href={`/admin/${r.id}`}
                  className="text-xs font-medium text-gold-soft hover:underline"
                >
                  Open →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
