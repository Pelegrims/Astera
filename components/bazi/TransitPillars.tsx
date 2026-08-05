"use client";

import { useMemo, useState } from "react";
import { DateTime } from "luxon";
import { BaziResult } from "@/lib/bazi-types";
import { calculateTransitPillars, calculatePeriodPillars } from "@/lib/bazi";
import { offsetForDate, formatUtcOffset } from "@/lib/city-timezone";
import { Card } from "@/components/ui/Card";
import { PillarColumn } from "./BaziChart";

/**
 * "Current Energies" — two ways to read the moment against the natal
 * chart, both relative to the natal Day Master and its star anchors:
 *
 * 1. PERIOD (default) — the reference calculator's two-dropdown mode:
 *    pick a year and a BaZi month (by branch) and see Year · Month
 *    pillars beside the active 10-year luck cycle. Pure table math.
 * 2. EXACT DATE & TIME — a full civil moment (defaults to now in the
 *    birth city's clock), producing hour/day/month/year pillars via the
 *    same solar-time pipeline as the natal chart.
 */

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** The 12 BaZi months by branch, with approximate civil spans for orientation */
const BAZI_MONTHS: { branch: string; label: string }[] = [
  { branch: "寅", label: "寅 Tiger · ≈ Feb 4 – Mar 5" },
  { branch: "卯", label: "卯 Rabbit · ≈ Mar 6 – Apr 4" },
  { branch: "辰", label: "辰 Dragon · ≈ Apr 5 – May 5" },
  { branch: "巳", label: "巳 Snake · ≈ May 6 – Jun 5" },
  { branch: "午", label: "午 Horse · ≈ Jun 6 – Jul 6" },
  { branch: "未", label: "未 Goat · ≈ Jul 7 – Aug 6" },
  { branch: "申", label: "申 Monkey · ≈ Aug 7 – Sep 7" },
  { branch: "酉", label: "酉 Rooster · ≈ Sep 8 – Oct 7" },
  { branch: "戌", label: "戌 Dog · ≈ Oct 8 – Nov 6" },
  { branch: "亥", label: "亥 Pig · ≈ Nov 7 – Dec 6" },
  { branch: "子", label: "子 Rat · ≈ Dec 7 – Jan 5" },
  { branch: "丑", label: "丑 Ox · ≈ Jan 6 – Feb 3" },
];

/** Approximate BaZi month branch for a civil date (term boundaries ±1 day) */
function approxMonthBranch(month: number, day: number): string {
  const starts: [number, number, string][] = [
    [1, 6, "丑"], [2, 4, "寅"], [3, 6, "卯"], [4, 5, "辰"],
    [5, 6, "巳"], [6, 6, "午"], [7, 7, "未"], [8, 7, "申"],
    [9, 8, "酉"], [10, 8, "戌"], [11, 7, "亥"], [12, 7, "子"],
  ];
  let current = "丑"; // before Jan 6 we're still in the Ox month
  for (const [m, d, b] of starts) {
    if (month > m || (month === m && day >= d)) current = b;
  }
  return current;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function TransitPillars({
  natal,
  timezone,
  lng,
}: {
  natal: BaziResult;
  timezone: string;
  lng: number;
}) {
  const now = useMemo(() => DateTime.now().setZone(timezone), [timezone]);

  const [mode, setMode] = useState<"period" | "exact">("period");

  // Period mode — like the reference: year + BaZi month by branch
  const [pYear, setPYear] = useState<number>(now.year);
  const [pMonthBranch, setPMonthBranch] = useState<string>(
    approxMonthBranch(now.month, now.day)
  );

  // Exact mode — full civil moment
  const [year, setYear] = useState<number>(now.year);
  const [month, setMonth] = useState<number>(now.month);
  const [day, setDay] = useState<number>(now.day);
  const [hour, setHour] = useState<number>(now.hour);
  const [minute, setMinute] = useState<number>(now.minute);

  const maxDay = daysInMonth(year, month);
  const clampedDay = Math.min(day, maxDay);

  const period = useMemo(() => {
    try {
      return calculatePeriodPillars({
        year: pYear,
        monthBranch: pMonthBranch || null,
        natal,
      });
    } catch {
      return null;
    }
  }, [pYear, pMonthBranch, natal]);

  const transit = useMemo(() => {
    try {
      const utcOffset = offsetForDate(
        timezone, year, month, clampedDay, hour, minute
      );
      return {
        utcOffset,
        result: calculateTransitPillars({
          year, month, day: clampedDay, hour, minute, utcOffset, lng, natal,
        }),
      };
    } catch {
      return null;
    }
  }, [timezone, year, month, clampedDay, hour, minute, lng, natal]);

  const yearOptions = useMemo(() => {
    const list: number[] = [];
    for (let y = now.year + 30; y >= now.year - 100; y--) list.push(y);
    return list;
  }, [now.year]);

  const selectClass =
    "rounded-lg border border-line bg-bg-surface px-2 py-1.5 text-sm text-ink focus:border-gold focus:outline-none";

  const modePill = (m: "period" | "exact", text: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        mode === m
          ? "border-burgundy bg-burgundy/10 text-burgundy"
          : "border-line bg-bg-surface/60 text-ink-muted hover:border-gold/60"
      }`}
    >
      {text}
    </button>
  );

  const luckCaption = (luck: {
    pillar: { stem: string; branch: string };
    startAge: number;
    startYear: number;
    endYear: number;
  } | null) =>
    luck ? (
      <p className="mt-1 text-center text-[11px] text-ink-muted">
        Active luck cycle:{" "}
        <span className="font-display">
          {luck.pillar.stem}
          {luck.pillar.branch}
        </span>{" "}
        — ages {luck.startAge}–{luck.startAge + 9} ({luck.startYear}–
        {luck.endYear})
      </p>
    ) : (
      <p className="mt-1 text-center text-[11px] text-ink-faint">
        Selected period is before the first 10-year luck cycle begins.
      </p>
    );

  return (
    <Card className="p-6">
      <div className="text-center">
        <h2 className="font-display text-lg text-aubergine">
          Current Energies
        </h2>
        <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-ink-muted">
          The pillars of any period or moment, read against the natal Day
          Master <span className="font-display">{natal.dayMaster.stem}</span>{" "}
          and the natal star anchors.
        </p>
        <div className="mt-3 flex justify-center gap-2">
          {modePill("period", "Year & month")}
          {modePill("exact", "Exact date & time")}
        </div>
      </div>

      {mode === "period" && (
        <>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <select
              aria-label="Year"
              className={selectClass}
              value={pYear}
              onChange={(e) => setPYear(Number(e.target.value))}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              aria-label="BaZi month"
              className={selectClass}
              value={pMonthBranch}
              onChange={(e) => setPMonthBranch(e.target.value)}
            >
              <option value="">Whole year</option>
              {BAZI_MONTHS.map((m) => (
                <option key={m.branch} value={m.branch}>{m.label}</option>
              ))}
            </select>
          </div>

          {period && (
            <>
              <p className="mt-4 text-center font-display text-sm text-aubergine">
                {period.year.stem}
                {period.year.branch} {period.year.element}{" "}
                {period.year.branchAnimal} year
                {period.month &&
                  ` · ${period.month.stem}${period.month.branch} ${period.month.element} ${period.month.branchAnimal} month`}
              </p>
              {luckCaption(period.luck)}
              <div
                className={`mx-auto mt-5 grid max-w-lg gap-1.5 sm:gap-3 ${
                  period.luck && period.month
                    ? "grid-cols-3"
                    : period.luck || period.month
                    ? "grid-cols-2"
                    : "grid-cols-1"
                }`}
              >
                {period.luck && (
                  <PillarColumn
                    pillar={period.luck.pillar}
                    pillarKey="luck"
                    hits={period.hits}
                    isLuckPillar
                    delayMs={0}
                  />
                )}
                {period.month && (
                  <PillarColumn
                    pillar={period.month}
                    pillarKey="month"
                    hits={period.hits}
                    delayMs={80}
                  />
                )}
                <PillarColumn
                  pillar={period.year}
                  pillarKey="year"
                  hits={period.hits}
                  delayMs={160}
                />
              </div>
              <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-ink-faint">
                BaZi months run between solar terms — the spans in the list
                are approximate (±1 day)
              </p>
            </>
          )}
        </>
      )}

      {mode === "exact" && (
        <>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <select
              aria-label="Year"
              className={selectClass}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              aria-label="Month"
              className={selectClass}
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTH_NAMES.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              aria-label="Day"
              className={selectClass}
              value={clampedDay}
              onChange={(e) => setDay(Number(e.target.value))}
            >
              {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <span className="flex items-center gap-1">
              <select
                aria-label="Hour"
                className={selectClass}
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
              >
                {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                  <option key={h} value={h}>{String(h).padStart(2, "0")}</option>
                ))}
              </select>
              <span className="text-ink-faint">:</span>
              <select
                aria-label="Minute"
                className={selectClass}
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
              >
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
                ))}
              </select>
            </span>
            <button
              type="button"
              onClick={() => {
                const n = DateTime.now().setZone(timezone);
                setYear(n.year);
                setMonth(n.month);
                setDay(n.day);
                setHour(n.hour);
                setMinute(n.minute);
              }}
              className="rounded-lg border border-gold/50 bg-gold/10 px-3 py-1.5 text-xs text-ink transition-colors hover:bg-gold/20"
            >
              Back to now
            </button>
          </div>

          {transit && (
            <>
              <p className="mt-4 text-center font-display text-sm text-aubergine">
                {transit.result.pillars.year.element}{" "}
                {transit.result.pillars.year.branchAnimal} year ·{" "}
                {transit.result.pillars.month.element}{" "}
                {transit.result.pillars.month.branchAnimal} month ·{" "}
                {transit.result.pillars.day.element}{" "}
                {transit.result.pillars.day.branchAnimal} day ·{" "}
                {transit.result.pillars.hour.element}{" "}
                {transit.result.pillars.hour.branchAnimal} hour
              </p>
              {luckCaption(transit.result.luck)}
              <div
                className={`mt-5 grid gap-1.5 sm:gap-3 ${
                  transit.result.luck ? "grid-cols-5" : "grid-cols-4"
                }`}
              >
                {transit.result.luck && (
                  <PillarColumn
                    pillar={transit.result.luck.pillar}
                    pillarKey="luck"
                    hits={transit.result.hits}
                    isLuckPillar
                    delayMs={0}
                  />
                )}
                <PillarColumn
                  pillar={transit.result.pillars.hour}
                  pillarKey="hour"
                  hits={transit.result.hits}
                  delayMs={50}
                />
                <PillarColumn
                  pillar={transit.result.pillars.day}
                  pillarKey="day"
                  hits={transit.result.hits}
                  delayMs={100}
                />
                <PillarColumn
                  pillar={transit.result.pillars.month}
                  pillarKey="month"
                  hits={transit.result.hits}
                  delayMs={200}
                />
                <PillarColumn
                  pillar={transit.result.pillars.year}
                  pillarKey="year"
                  hits={transit.result.hits}
                  delayMs={300}
                />
              </div>
              <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-ink-faint">
                {timezone} · {formatUtcOffset(transit.utcOffset)}
                {transit.result.solarTime &&
                  ` · mean solar ${String(
                    transit.result.solarTime.hour
                  ).padStart(2, "0")}:${String(
                    transit.result.solarTime.minute
                  ).padStart(2, "0")}`}
              </p>
            </>
          )}
        </>
      )}
    </Card>
  );
}
