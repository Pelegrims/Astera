"use client";

import { BaziResult } from "@/lib/bazi-types";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { elementColor } from "@/lib/element-colors";
import { ElementSpotlight } from "./ElementSpotlight";

function PillarCard({
  label,
  stem,
  branch,
  hiddenStems,
  tenGod,
  element,
  highlight = false,
  delayMs = 0,
}: {
  label: string;
  stem: string;
  branch: string;
  hiddenStems: string[];
  tenGod: string;
  element: string;
  highlight?: boolean;
  delayMs?: number;
}) {
  const c = elementColor(element);
  return (
    <div
      className={`animate-card-pop rounded-xl2 border-2 p-4 text-center opacity-0 ${c.bg} ${
        highlight ? `${c.border} shadow-[0_0_0_3px_rgba(0,0,0,0.02)]` : "border-transparent"
      }`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">
        {label}
      </p>
      <p className={`mt-2 font-display text-3xl ${c.text}`}>
        {stem}
        {branch}
      </p>
      <p className={`mt-1 text-[10px] font-medium uppercase tracking-wide ${c.text}`}>
        {element}
      </p>
      <p className="mt-2 text-xs text-ink-muted">
        Hidden: {hiddenStems.join(" ") || "—"}
      </p>
      <p className="mt-1 text-xs font-medium text-ink">{tenGod}</p>
    </div>
  );
}

export function BaziChart({
  result,
  name,
}: {
  result: BaziResult;
  name: string;
}) {
  const { pillars, dayMaster, fiveElements, luckPillars } = result;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
          {`${name}'s Four Pillars`}
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Day Master:{" "}
          <span className="font-medium text-burgundy">
            {dayMaster.stem} ({dayMaster.element})
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <PillarCard
          label="Hour"
          stem={pillars.hour.stem}
          branch={pillars.hour.branch}
          hiddenStems={pillars.hour.hiddenStems}
          tenGod={pillars.hour.tenGodStem}
          element={pillars.hour.element}
          delayMs={0}
        />
        <PillarCard
          label="Day"
          stem={pillars.day.stem}
          branch={pillars.day.branch}
          hiddenStems={pillars.day.hiddenStems}
          tenGod={pillars.day.tenGodStem}
          element={pillars.day.element}
          highlight
          delayMs={150}
        />
        <PillarCard
          label="Month"
          stem={pillars.month.stem}
          branch={pillars.month.branch}
          hiddenStems={pillars.month.hiddenStems}
          tenGod={pillars.month.tenGodStem}
          element={pillars.month.element}
          delayMs={300}
        />
        <PillarCard
          label="Year"
          stem={pillars.year.stem}
          branch={pillars.year.branch}
          hiddenStems={pillars.year.hiddenStems}
          tenGod={pillars.year.tenGodStem}
          element={pillars.year.element}
          delayMs={450}
        />
      </div>

      <Card className="p-6">
        <h2 className="font-display text-lg text-aubergine">
          Five Element Balance
        </h2>
        <div className="mt-4">
          <ElementSpotlight fiveElements={fiveElements} name={name} />
        </div>
      </Card>

      {luckPillars.length > 0 && (
        <Card className="p-6">
          <h2 className="font-display text-lg text-aubergine">
            Luck Pillars — 10-Year Cycles
          </h2>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {luckPillars.map((p, i) => (
              <div
                key={i}
                className="min-w-[100px] animate-card-pop rounded-xl2 border border-line bg-bg-surface/60 p-3 text-center opacity-0"
                style={{ animationDelay: `${600 + i * 80}ms` }}
              >
                <p className="font-mono text-[10px] text-ink-faint">
                  Age {p.startAge}
                </p>
                <p className="mt-1 font-display text-xl text-aubergine">
                  {p.ganZhi}
                </p>
                <p className="mt-1 text-[11px] text-ink-faint">
                  {p.startYear}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="rounded-xl2 border border-line bg-bg-surface/50 p-8 text-center">
        <h2 className="font-display text-xl text-aubergine">
          Want the full picture?
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
          This free chart shows the structure. A personal Astera report adds
          Western astrology and a real astrologer's written reading of what
          it all means for you.
        </p>
        <div className="mt-6 flex justify-center">
          <LinkButton href="/quiz">Get my personal report</LinkButton>
        </div>
      </div>
    </div>
  );
}
