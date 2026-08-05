"use client";

import { useMemo, useState } from "react";
import { DateTime } from "luxon";
import { BaziResult } from "@/lib/bazi-types";
import { calculateTransitPillars } from "@/lib/bazi";
import { offsetForDate, formatUtcOffset } from "@/lib/city-timezone";
import { Card } from "@/components/ui/Card";
import { PillarColumn } from "./BaziChart";

/**
 * "Current Energies" — the pillars of the selected moment (defaults to
 * right now, in the birth city's clock), rendered exactly like the natal
 * pillars. Every Ten God, hidden-stem god, Qi phase, and star here is
 * read against the NATAL Day Master and the natal star anchors — that's
 * how classical BaZi reads a year/month/day, and how the reference
 * calculator's selectable year/month columns behave.
 */

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

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
  // "Now" in the chart's own city — so the default hour pillar matches
  // what the person at the birth location would call the current hour.
  const now = useMemo(() => DateTime.now().setZone(timezone), [timezone]);

  const [year, setYear] = useState<number>(now.year);
  const [month, setMonth] = useState<number>(now.month);
  const [day, setDay] = useState<number>(now.day);
  const [hour, setHour] = useState<number>(now.hour);
  const [minute, setMinute] = useState<number>(now.minute);

  const maxDay = daysInMonth(year, month);
  const clampedDay = Math.min(day, maxDay);

  const transit = useMemo(() => {
    try {
      const utcOffset = offsetForDate(
        timezone,
        year,
        month,
        clampedDay,
        hour,
        minute
      );
      return {
        utcOffset,
        result: calculateTransitPillars({
          year,
          month,
          day: clampedDay,
          hour,
          minute,
          utcOffset,
          lng,
          natal,
        }),
      };
    } catch {
      return null;
    }
  }, [timezone, year, month, clampedDay, hour, minute, lng, natal]);

  const yearOptions = useMemo(() => {
    const from = now.year - 100;
    const to = now.year + 30;
    const list: number[] = [];
    for (let y = to; y >= from; y--) list.push(y);
    return list;
  }, [now.year]);

  const isNow =
    year === now.year &&
    month === now.month &&
    clampedDay === now.day &&
    hour === now.hour &&
    minute === now.minute;

  const selectClass =
    "rounded-lg border border-line bg-bg-surface px-2 py-1.5 text-sm text-ink focus:border-gold focus:outline-none";

  return (
    <Card className="p-6">
      <div className="text-center">
        <h2 className="font-display text-lg text-aubergine">
          Current Energies — Year · Month · Day · Hour
        </h2>
        <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-ink-muted">
          The pillars of this moment, read against the natal Day Master{" "}
          <span className="font-display">{natal.dayMaster.stem}</span> — the
          gods, Qi phases, and stars show how the selected period interacts
          with the birth chart. Pick any date to look ahead or back.
        </p>
      </div>

      {/* Moment selectors */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <select
          aria-label="Year"
          className={selectClass}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          aria-label="Month"
          className={selectClass}
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {MONTH_NAMES.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <select
          aria-label="Day"
          className={selectClass}
          value={clampedDay}
          onChange={(e) => setDay(Number(e.target.value))}
        >
          {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
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
              <option key={h} value={h}>
                {String(h).padStart(2, "0")}
              </option>
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
              <option key={m} value={m}>
                {String(m).padStart(2, "0")}
              </option>
            ))}
          </select>
        </span>
        {!isNow && (
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
        )}
      </div>

      {transit && (
        <>
          <div className="mt-6 grid grid-cols-4 gap-1.5 sm:gap-3">
            <PillarColumn
              pillar={transit.result.pillars.hour}
              pillarKey="hour"
              hits={transit.result.hits}
              delayMs={0}
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
              ` · mean solar ${String(transit.result.solarTime.hour).padStart(
                2,
                "0"
              )}:${String(transit.result.solarTime.minute).padStart(2, "0")}`}
            {" — stars shown are the natal anchors activated by this moment"}
          </p>
        </>
      )}
    </Card>
  );
}
