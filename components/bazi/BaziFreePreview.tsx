"use client";

import { useMemo } from "react";
import { calculateBazi } from "@/lib/bazi";
import { ElementSpotlight } from "@/components/bazi/ElementSpotlight";
import { LinkButton } from "@/components/ui/Button";

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

      <div className="mt-6">
        <ElementSpotlight fiveElements={result.fiveElements} name={firstName} />
      </div>

      <p className="mt-4 text-center text-xs text-ink-faint">
        Day Master: {result.dayMaster.stem} ({result.dayMaster.element})
      </p>

      <div className="mt-8 rounded-xl2 border border-line bg-bg-surface/50 p-8 text-center">
        <h3 className="font-display text-lg text-aubergine">
          Want the deeper analysis?
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
          Your Extended Reading adds your 10-year luck cycles, a full
          written interpretation of what this balance means for you, and
          how it lines up with your Western chart.
        </p>
        <p className="mt-4">
          <span className="text-sm text-ink-faint line-through">$39.99</span>{" "}
          <span className="font-display text-2xl text-burgundy">$29.99</span>
        </p>
        <div className="mt-5 flex justify-center">
          <LinkButton href="mailto:hello@astera.app?subject=Extended%20Reading%20request">
            Get my extended reading
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
