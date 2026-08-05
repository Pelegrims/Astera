"use client";

import { BaziResult, BaziPillar } from "@/lib/bazi-types";
import { StarHit, PillarKey } from "@/lib/bazi-stars";
import { BRANCH_ANIMAL, STEM_ELEMENT } from "@/lib/bazi";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { ElementSpotlight } from "./ElementSpotlight";

/**
 * The classical four-pillar chart layout, in the reference-calculator
 * column order (Hour · Day · Month · Year), with the Day Master as the
 * centerpiece above the table — every god, phase, and star in the chart
 * is read relative to it, so it gets the hero treatment.
 */

const ELEMENT_TEXT: Record<string, string> = {
  Wood: "text-elementWood",
  Fire: "text-elementFire",
  Earth: "text-elementEarth",
  Metal: "text-elementMetal",
  Water: "text-elementWater",
};

const ANCHOR_LETTER: Record<string, string> = {
  day: "d",
  year: "y",
  month: "m",
};

const ELEMENT_BORDER: Record<string, string> = {
  Wood: "border-elementWood/60",
  Fire: "border-elementFire/60",
  Earth: "border-elementEarth/60",
  Metal: "border-elementMetal/60",
  Water: "border-elementWater/60",
};

function elementClass(element: string): string {
  return ELEMENT_TEXT[element] ?? "text-aubergine";
}

function StarChip({ hit }: { hit: StarHit }) {
  const isDeity = hit.category === "deity";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] leading-tight ${
        isDeity
          ? "border-gold/60 bg-gold/10 text-ink"
          : "border-stone/50 bg-stone/10 text-ink-muted"
      }`}
      title={`${hit.name} (${hit.chinese}) — from the ${hit.anchor} anchor`}
    >
      {hit.name}
      <span className="font-mono text-[8px] text-ink-faint">
        ({ANCHOR_LETTER[hit.anchor]})
      </span>
    </span>
  );
}

function PillarColumn({
  pillar,
  pillarKey,
  hits,
  isDayPillar = false,
  delayMs = 0,
}: {
  pillar: BaziPillar;
  pillarKey: PillarKey;
  hits: StarHit[];
  isDayPillar?: boolean;
  delayMs?: number;
}) {
  const myHits = hits.filter((h) => h.pillar === pillarKey);
  return (
    <div
      className={`animate-card-pop flex flex-col rounded-xl2 border text-center opacity-0 ${
        isDayPillar
          ? "border-burgundy bg-burgundy/5"
          : "border-line bg-bg-surface/60"
      }`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {/* Label + Ten God of the stem */}
      <div className="border-b border-line/70 px-1 py-2">
        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink-faint">
          {pillar.label}
        </p>
        <p
          className={`mt-1 min-h-[2em] text-[10px] font-medium leading-tight ${
            isDayPillar ? "text-burgundy" : "text-ink-muted"
          }`}
        >
          {pillar.tenGodStem}
        </p>
      </div>

      {/* Heavenly Stem */}
      <div className="px-1 py-2">
        <p
          className={`font-display text-3xl sm:text-4xl ${elementClass(
            pillar.element
          )}`}
        >
          {pillar.stem}
        </p>
        <p className="mt-1 text-[9px] text-ink-faint">
          {pillar.stemYinYang} {pillar.element}
        </p>
      </div>

      {/* Earthly Branch */}
      <div className="border-t border-line/70 px-1 py-2">
        <p
          className={`font-display text-3xl sm:text-4xl ${elementClass(
            pillar.branchElement
          )}`}
        >
          {pillar.branch}
        </p>
        <p className="mt-1 text-[9px] text-ink-faint">
          {pillar.branchAnimal} · {pillar.branchElement}
        </p>
      </div>

      {/* Hidden stems with their Ten Gods */}
      <div className="border-t border-line/70 px-1 py-2">
        <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-ink-faint">
          Hidden
        </p>
        {pillar.hiddenStems.length === 0 && (
          <p className="mt-1 text-[10px] text-ink-faint">—</p>
        )}
        {pillar.hiddenStems.map((hs, i) => (
          <div key={`${hs}-${i}`} className="mt-1.5">
            <span
              className={`font-display text-base leading-none ${elementClass(
                STEM_ELEMENT[hs] ?? ""
              )}`}
            >
              {hs}
            </span>
            {pillar.hiddenTenGods[i] && (
              <p className="text-[8px] leading-tight text-ink-muted">
                {pillar.hiddenTenGods[i]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Qi phase */}
      {pillar.qiPhase && (
        <div className="border-t border-line/70 px-1 py-2">
          <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-ink-faint">
            Qi phase
          </p>
          <p className="mt-0.5 text-[10px] font-medium text-aubergine">
            {pillar.qiPhase}
          </p>
        </div>
      )}

      {/* Stars landing on this pillar */}
      <div className="mt-auto border-t border-line/70 px-1 py-2">
        {myHits.length === 0 ? (
          <p className="text-[9px] text-ink-faint">—</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-1">
            {myHits.map((h, i) => (
              <StarChip key={`${h.name}-${h.anchor}-${i}`} hit={h} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function BaziChart({
  result,
  name,
  showLuckPillars = true,
  showElements = true,
  showCta = true,
}: {
  result: BaziResult;
  name: string;
  showLuckPillars?: boolean;
  showElements?: boolean;
  showCta?: boolean;
}) {
  const { pillars, dayMaster, fiveElements, luckPillars, stars, voidBranches } =
    result;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* ── Day Master hero — the center of the chart ── */}
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-faint">
          Day Master · 日主
        </p>
        <div
          className={`mx-auto mt-4 flex h-24 w-24 items-center justify-center rounded-full border-2 bg-bg-surface/70 ${
            ELEMENT_BORDER[dayMaster.element] ?? "border-gold/60"
          }`}
        >
          <span
            className={`font-display text-5xl ${elementClass(dayMaster.element)}`}
          >
            {dayMaster.stem}
          </span>
        </div>
        <p className="mt-3 font-display text-xl text-aubergine">
          {dayMaster.yinYang} {dayMaster.element}
        </p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-ink-muted">
          {name}&apos;s Day Master — the chart&apos;s central figure. Every
          god, Qi phase, and star below is read in relation to it.
        </p>
      </div>

      {/* ── The four pillars ── */}
      <div>
        <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
          <PillarColumn
            pillar={pillars.hour}
            pillarKey="hour"
            hits={stars.hits}
            delayMs={0}
          />
          <PillarColumn
            pillar={pillars.day}
            pillarKey="day"
            hits={stars.hits}
            isDayPillar
            delayMs={150}
          />
          <PillarColumn
            pillar={pillars.month}
            pillarKey="month"
            hits={stars.hits}
            delayMs={300}
          />
          <PillarColumn
            pillar={pillars.year}
            pillarKey="year"
            hits={stars.hits}
            delayMs={450}
          />
        </div>
        <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-ink-faint">
          Star anchors: (d) day master · (y) year · (m) month — gold chips
          are deities, grey are spirits &amp; demons
        </p>
      </div>

      {/* ── Symbolic stars summary (like the reference side panel) ── */}
      <Card className="p-6">
        <h2 className="font-display text-lg text-aubergine">
          Symbolic Stars — Deities, Spirits &amp; Demons
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          Where each star falls for this chart. A star only actively shows
          up in life when its branch appears in a pillar above (or arrives
          with a luck cycle or year).
        </p>
        <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {stars.summary.map((s) => (
            <div
              key={s.name}
              className="flex items-baseline justify-between gap-3 border-b border-line/60 pb-2"
            >
              <p className="text-sm text-ink">
                <span
                  className={
                    s.category === "deity"
                      ? "font-medium text-ink"
                      : "text-ink-muted"
                  }
                >
                  {s.name}
                </span>{" "}
                <span className="font-display text-xs text-ink-faint">
                  {s.chinese}
                </span>
              </p>
              <p className="text-right text-xs text-ink-muted">
                {s.targets.map((t, i) => (
                  <span key={i} className="ml-2 whitespace-nowrap">
                    {t.branches
                      .map((b) => `${b} ${BRANCH_ANIMAL[b] ?? ""}`)
                      .join(", ")}
                    <span className="font-mono text-[9px] text-ink-faint">
                      {" "}
                      ({ANCHOR_LETTER[t.anchor]})
                    </span>
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
        {voidBranches.length > 0 && (
          <p className="mt-4 text-xs leading-relaxed text-ink-faint">
            Void (空亡) branches:{" "}
            {voidBranches
              .map((b) => `${b} ${BRANCH_ANIMAL[b] ?? ""}`)
              .join(" · ")}{" "}
            — a pillar carrying one of these is marked Void above, softening
            or hollowing what that pillar represents.
          </p>
        )}
      </Card>

      {showElements && (
        <Card className="p-6">
          <h2 className="font-display text-lg text-aubergine">
            Five Element Balance
          </h2>
          <div className="mt-4">
            <ElementSpotlight fiveElements={fiveElements} name={name} />
          </div>
        </Card>
      )}

      {showLuckPillars && luckPillars.length > 0 && (
        <Card className="p-6">
          <h2 className="font-display text-lg text-aubergine">
            Luck Pillars — 10-Year Cycles
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            The decade-long chapters of the chart, each colored by its
            governing element.
          </p>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {luckPillars.map((p, i) => (
              <div
                key={i}
                className="min-w-[104px] animate-card-pop rounded-xl2 border border-line bg-bg-surface/60 p-3 text-center opacity-0"
                style={{ animationDelay: `${600 + i * 80}ms` }}
              >
                <p className="font-mono text-[10px] text-ink-faint">
                  Age {p.startAge}
                </p>
                <p className="mt-1 font-display text-2xl leading-none">
                  <span className={elementClass(p.stemElement)}>{p.stem}</span>
                  <span className="text-aubergine">{p.branch}</span>
                </p>
                <p className="mt-1.5 text-[10px] text-ink-muted">
                  {p.branchAnimal}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-faint">
                  from {p.startYear}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {showCta && (
        <div className="rounded-xl2 border border-line bg-bg-surface/50 p-8 text-center">
          <h2 className="font-display text-xl text-aubergine">
            Want the full picture?
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
            This free chart shows the structure. A personal Astera report
            adds Western astrology and a real astrologer&apos;s written
            reading of what it all means for you.
          </p>
          <div className="mt-6 flex justify-center">
            <LinkButton href="/quiz">Get my personal report</LinkButton>
          </div>
        </div>
      )}
    </div>
  );
}
