"use client";

import { useEffect, useRef, useState } from "react";
import { calculateBazi } from "@/lib/bazi";
import { calculateNatalChart } from "@/lib/astrology";
import { calculateMatrix } from "@/lib/matrix-of-destiny";
import { offsetForDate } from "@/lib/city-timezone";
import { BaziInput, BaziResult } from "@/lib/bazi-types";
import { NatalChartResult } from "@/lib/astrology-types";
import { MatrixResult } from "@/lib/matrix-types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CityAutocomplete } from "@/components/ui/CityAutocomplete";
import { BaziChart } from "@/components/bazi/BaziChart";
import { NatalChartDisplay } from "@/components/astrology/NatalChartDisplay";
import { MatrixDisplay } from "@/components/matrix/MatrixDisplay";

const inputClass =
  "w-full rounded-xl2 border border-stone/40 bg-white/60 px-4 py-3 text-base text-ink outline-none focus:border-burgundy/60 focus:bg-white";

export function BaziCalculator() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("0");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [birthCity, setBirthCity] = useState("");
  const [timezone, setTimezone] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const [baziResult, setBaziResult] = useState<BaziResult | null>(null);
  const [natalResult, setNatalResult] = useState<NatalChartResult | null>(
    null
  );
  const [matrixResult, setMatrixResult] = useState<MatrixResult | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const hasResult = Boolean(baziResult || natalResult || matrixResult);

  // Scroll the result into view the moment it appears — without this, a
  // result rendered below the fold can look like nothing happened at all.
  useEffect(() => {
    if (hasResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hasResult]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!year || !month || !day) {
      setError("Please fill in your full birth date.");
      return;
    }
    if (!timezone || !coords) {
      setError(
        "Please pick your birth city from the suggestions — we need it to resolve your time zone and exact chart."
      );
      return;
    }

    const h = timeUnknown ? 12 : Number(hour);
    const m = timeUnknown ? 0 : Number(minute);
    const utcOffset = offsetForDate(
      timezone,
      Number(year),
      Number(month),
      Number(day),
      h,
      m
    );

    setIsCalculating(true);
    setBaziResult(null);
    setNatalResult(null);
    setMatrixResult(null);

    // A brief, deliberate pause — the calculation itself is instant, but a
    // beat of "Calculating..." makes it clear the button press registered,
    // rather than the result just silently appearing (or not appearing).
    setTimeout(() => {
      try {
        const baziInput: BaziInput = {
          name: name.trim() || "Your",
          gender,
          year: Number(year),
          month: Number(month),
          day: Number(day),
          hour: h,
          minute: m,
          utcOffset,
        };
        setBaziResult(calculateBazi(baziInput));

        setNatalResult(
          calculateNatalChart({
            year: Number(year),
            month: Number(month),
            day: Number(day),
            hour: h,
            minute: m,
            lat: coords.lat,
            lng: coords.lng,
          })
        );

        setMatrixResult(
          calculateMatrix(Number(day), Number(month), Number(year))
        );
      } catch (err) {
        setError(
          "Couldn't calculate your chart — please double-check the date and try again."
        );
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setIsCalculating(false);
      }
    }, 500);
  }

  return (
    <div className="space-y-10">
      <Card className="mx-auto max-w-xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Gender
            </label>
            <p className="mb-2 text-xs text-ink-faint">
              BaZi&apos;s luck-cycle calculation is gender-specific — this is
              a property of the traditional method itself, not a comment on
              identity.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`flex-1 rounded-xl2 border px-4 py-2 text-sm ${
                  gender === "female"
                    ? "border-burgundy bg-burgundy/10 text-ink"
                    : "border-stone/40 text-ink-muted"
                }`}
              >
                Female
              </button>
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`flex-1 rounded-xl2 border px-4 py-2 text-sm ${
                  gender === "male"
                    ? "border-burgundy bg-burgundy/10 text-ink"
                    : "border-stone/40 text-ink-muted"
                }`}
              >
                Male
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Birth date
            </label>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="Day"
                min={1}
                max={31}
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className={inputClass}
              />
              <input
                type="number"
                placeholder="Month"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className={inputClass}
              />
              <input
                type="number"
                placeholder="Year"
                min={1900}
                max={2100}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Birth time
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Hour (0-23)"
                min={0}
                max={23}
                disabled={timeUnknown}
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className={`${inputClass} disabled:opacity-40`}
              />
              <input
                type="number"
                placeholder="Minute"
                min={0}
                max={59}
                disabled={timeUnknown}
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className={`${inputClass} disabled:opacity-40`}
              />
            </div>
            <label className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
              <input
                type="checkbox"
                checked={timeUnknown}
                onChange={(e) => setTimeUnknown(e.target.checked)}
                className="h-4 w-4 rounded border-stone/40 accent-burgundy"
              />
              I don&apos;t know my exact birth time (Ascendant, houses, and
              Hour pillar will be approximate)
            </label>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Birth city
            </label>
            <CityAutocomplete
              value={birthCity}
              onSelect={(label, match) => {
                setBirthCity(label);
                setTimezone(match?.timezone ?? null);
                setCoords(match ? { lat: match.lat, lng: match.lng } : null);
              }}
              inputClassName={inputClass}
            />
            <p className="mt-1 text-xs text-ink-faint">
              {timezone
                ? `Time zone resolved: ${timezone}`
                : "Start typing and pick your city from the list — we'll work out the correct time zone and exact chart automatically."}
            </p>
          </div>

          {error && <p className="text-sm text-burgundy">{error}</p>}

          <Button type="submit" className="w-full" disabled={isCalculating}>
            {isCalculating ? "Calculating…" : "Calculate my chart"}
          </Button>
        </form>
      </Card>

      {hasResult && (
        <div ref={resultRef} className="animate-fade-up scroll-mt-8 space-y-14">
          {natalResult && (
            <section>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 h-[3px] w-10 rounded-full bg-elementAir" />
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
                  System 1
                </p>
                <h2 className="mt-1 font-display text-2xl text-aubergine">
                  Western Astrology
                </h2>
              </div>
              <NatalChartDisplay result={natalResult} />
            </section>
          )}

          {baziResult && (
            <section>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 h-[3px] w-10 rounded-full bg-burgundy" />
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
                  System 2
                </p>
                <h2 className="mt-1 font-display text-2xl text-aubergine">
                  BaZi — Four Pillars
                </h2>
              </div>
              <BaziChart result={baziResult} name={name.trim() || "Your"} />
            </section>
          )}

          {matrixResult && (
            <section>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 h-[3px] w-10 rounded-full bg-aubergine" />
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
                  System 3
                </p>
                <h2 className="mt-1 font-display text-2xl text-aubergine">
                  Matrix of Destiny
                </h2>
              </div>
              <MatrixDisplay result={matrixResult} />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
