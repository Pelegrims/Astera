"use client";

import { useMemo } from "react";
import { calculateBazi } from "@/lib/bazi";
import { ElementCards } from "@/components/bazi/ElementCards";
import { Card } from "@/components/ui/Card";

export function BaziFreePreview({
  firstName,
  birthDate,
  birthTime,
  gender,
  utcOffset,
}: {
  firstName: string;
  birthDate: string; // "YYYY-MM-DD"
  birthTime?: string; // "HH:mm"
  gender: "male" | "female";
  utcOffset: number;
}) {
  const result = useMemo(() => {
    const [year, month, day] = birthDate.split("-").map(Number);
    const [hour, minute] = (birthTime || "12:00").split(":").map(Number);
    try {
      return calculateBazi({
        name: firstName,
        gender,
        year,
        month,
        day,
        hour: hour ?? 12,
        minute: minute ?? 0,
        utcOffset,
      });
    } catch {
      return null;
    }
  }, [birthDate, birthTime, gender, utcOffset, firstName]);

  if (!result) return null;

  return (
    <div className="mx-auto mt-14 max-w-2xl animate-fade-up text-left">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
          While you wait — a free preview
        </p>
        <h2 className="mt-2 font-display text-xl font-medium text-aubergine sm:text-2xl">
          Your Five Element Balance
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
          Based on your birth data, calculated instantly with BaZi (Four
          Pillars). Your full personal report — combining this with Western
          astrology, written by Julia — arrives within 24 hours.
        </p>
      </div>

      <Card className="mt-6 p-6">
        <ElementCards fiveElements={result.fiveElements} delayBase={100} />
      </Card>

      <p className="mt-4 text-center text-xs text-ink-faint">
        Day Master: {result.dayMaster.stem} ({result.dayMaster.element})
      </p>
    </div>
  );
}
