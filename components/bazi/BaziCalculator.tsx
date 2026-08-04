"use client";

import { useEffect, useRef, useState } from "react";
import { calculateBazi } from "@/lib/bazi";
import { offsetForDate } from "@/lib/city-timezone";
import { BaziInput, BaziResult } from "@/lib/bazi-types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CityAutocomplete } from "@/components/ui/CityAutocomplete";
import { BaziChart } from "@/components/bazi/BaziChart";

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
  const [result, setResult] = useState<BaziResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Scroll the result into view the moment it appears — without this, a
  // result rendered below the fold can look like nothing happened at all.
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!year || !month || !day) {
      setError("Please fill in your full birth date.");
      return;
    }
    if (!timezone) {
      setError(
        "Please pick your birth city from the suggestions so we can resolve the correct time zone."
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

    const input: BaziInput = {
      name: name.trim() || "Your",
      gender,
      year: Number(year),
      month: Number(month),
      day: Number(day),
      hour: h,
      minute: m,
      utcOffset,
    };

    setIsCalculating(true);
    setResult(null);

    // A brief, deliberate pause — the calculation itself is instant, but a
    // beat of "Calculating..." makes it clear the button press registered,
    // rather than the result just silently appearing (or not appearing).
    setTimeout(() => {
      try {
        const computed = calculateBazi(input);
        setResult(computed);
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
              I don&apos;t know my exact birth time (Hour pillar will be
              approximate)
            </label>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Birth city
            </label>
            <CityAutocomplete
              value={birthCity}
              onSelect={(label, tz) => {
                setBirthCity(label);
                setTimezone(tz);
              }}
              inputClassName={inputClass}
            />
            <p className="mt-1 text-xs text-ink-faint">
              {timezone
                ? `Time zone resolved: ${timezone}`
                : "Start typing and pick your city from the list — we'll work out the correct time zone for your exact birth date automatically."}
            </p>
          </div>

          {error && <p className="text-sm text-burgundy">{error}</p>}

          <Button type="submit" className="w-full" disabled={isCalculating}>
            {isCalculating ? "Calculating…" : "Calculate my chart"}
          </Button>
        </form>
      </Card>

      {result && (
        <div ref={resultRef} className="animate-fade-up scroll-mt-8">
          <BaziChart result={result} name={name.trim() || "Your"} />
        </div>
      )}
    </div>
  );
}
