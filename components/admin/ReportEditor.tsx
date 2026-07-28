"use client";

import { useState } from "react";
import { ClientRequest, ReportSections } from "@/lib/types";
import { saveReport, markAsReady, markAsSent, markAsInProgress } from "@/app/actions";
import { Button } from "@/components/ui/Button";

const fields: { key: keyof ReportSections; label: string; placeholder: string }[] = [
  {
    key: "coreEnergy",
    label: "Your Core Energy",
    placeholder: "Describe their Sun, Moon, and Rising and what that combination feels like day to day…",
  },
  {
    key: "loveAndRelationships",
    label: "Love & Relationships",
    placeholder: "Venus, Mars, and 7th house themes…",
  },
  {
    key: "careerAndMoney",
    label: "Career & Money",
    placeholder: "Midheaven, 2nd and 10th house themes…",
  },
  {
    key: "currentPlanetaryFocus",
    label: "Current Planetary Focus",
    placeholder: "What's transiting right now and why it matters for them…",
  },
  {
    key: "personalRecommendations",
    label: "Personal Recommendations",
    placeholder: "One or two concrete, specific things they can do with this…",
  },
];

export function ReportEditor({ request }: { request: ClientRequest }) {
  const [report, setReport] = useState<ReportSections>(request.report);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  function update(key: keyof ReportSections, value: string) {
    setReport((r) => ({ ...r, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    await saveReport(request.id, report);
    setSaving(false);
    setSavedAt(new Date().toLocaleTimeString());
    if (request.status === "new") {
      await markAsInProgress(request.id);
    }
  }

  async function handleMarkReady() {
    await handleSave();
    await markAsReady(request.id);
  }

  const publicUrl = `/report/${request.id}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Client details sidebar */}
      <aside className="h-fit rounded-xl2 border border-line bg-bg-surface/40 p-5">
        <h2 className="font-display text-lg font-medium">{request.firstName}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <Detail label="Email" value={request.email} />
          {request.phone && <Detail label="Phone" value={request.phone} />}
          <Detail label="Birth date" value={request.birthDate} mono />
          <Detail label="Birth time" value={request.birthTime ?? "Unknown"} mono />
          <Detail label="Birth location" value={request.birthLocation} />
          <Detail
            label="Focus"
            value={request.focus.replace("_", " ")}
          />
        </dl>

        {request.status === "ready" || request.status === "sent" ? (
          <a
            href={publicUrl}
            target="_blank"
            className="mt-5 block rounded-lg border border-line px-3 py-2 text-center text-xs text-gold-soft hover:border-gold/40"
          >
            View public report →
          </a>
        ) : null}
      </aside>

      {/* Report editor */}
      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="mb-2 block text-sm font-medium text-ink">
              {field.label}
            </label>
            <textarea
              value={report[field.key]}
              onChange={(e) => update(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className="w-full rounded-xl2 border border-line bg-bg-surface/60 px-4 py-3 text-sm leading-relaxed text-ink placeholder:text-ink-faint outline-none focus:border-gold/50"
            />
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button variant="secondary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button onClick={handleMarkReady} disabled={saving}>
            Mark as Ready
          </Button>
          {request.status === "ready" && (
            <Button variant="ghost" onClick={() => markAsSent(request.id)}>
              Mark as Sent
            </Button>
          )}
          {savedAt && (
            <span className="text-xs text-ink-faint">Saved at {savedAt}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink-faint">
        {label}
      </dt>
      <dd className={`mt-0.5 ${mono ? "font-mono text-xs" : "text-sm"} text-ink`}>
        {value}
      </dd>
    </div>
  );
}
