import { RequestStatus, STATUS_LABELS } from "@/lib/types";

const statusStyles: Record<RequestStatus, string> = {
  new: "bg-sage/15 text-ink border-sage/40",
  in_progress: "bg-mauve/15 text-ink border-mauve/40",
  ready: "bg-gold/10 text-gold border-gold/30",
  sent: "bg-stone/15 text-ink-muted border-stone/30",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${statusStyles[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
