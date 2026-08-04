"use client";

import { useMemo } from "react";
import { calculateBazi } from "@/lib/bazi";
import { calculateNatalChart } from "@/lib/astrology";
import { calculateMatrix } from "@/lib/matrix-of-destiny";
import { ElementSpotlight } from "@/components/bazi/ElementSpotlight";
import { NatalChartDisplay } from "@/components/astrology/NatalChartDisplay";
import { MatrixDisplay } from "@/components/matrix/MatrixDisplay";
import { PaddleCheckoutButton } from "@/components/ui/PaddleCheckoutButton";

export function BaziFreePreview({
  firstName,
  birthDate,
  birthTime,
  gender,
  utcOffset,
  lat,
  lng,
}: {
  firstName: string;
  birthDate: string; // "YYYY-MM-DD"
  birthTime?: string; // "HH:mm"
  gender: "male" | "female";
  utcOffset: number;
  lat?: number;
  lng?: number;
}) {
  const parsed = useMemo(() => {
    const [year, month, day] = birthDate.split("-").map(Number);
    const [hour, minute] = (birthTime || "12:00").split(":").map(Number);
    return { year, month, day, hour: hour ?? 12, minute: minute ?? 0 };
  }, [birthDate, birthTime]);

  const baziResult = useMemo(() => {
    try {
      return calculateBazi({
        name: firstName,
        gender,
        ...parsed,
        utcOffset,
      });
    } catch {
      return null;
    }
  }, [parsed, gender, utcOffset, firstName]);

  const natalResult = useMemo(() => {
    if (lat === undefined || lng === undefined) return null;
    try {
      return calculateNatalChart({ ...parsed, lat, lng });
    } catch {
      return null;
    }
  }, [parsed, lat, lng]);

  const matrixResult = useMemo(() => {
    try {
      return calculateMatrix(parsed.day, parsed.month, parsed.year);
    } catch {
      return null;
    }
  }, [parsed]);

  if (!baziResult) return null;

  return (
    <div className="mx-auto mt-14 max-w-4xl animate-fade-up text-left">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
          While you wait — a free preview
        </p>
        <h2 className="mt-2 font-display text-xl font-medium text-aubergine sm:text-2xl">
          Three free readings, calculated instantly
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
          Based on your birth data — Western astrology, BaZi (Four
          Pillars), and Matrix of Destiny. Your full personal report,
          written by Julia, arrives within 24 hours.
        </p>
      </div>

      <div className="mt-10 space-y-14">
        {natalResult && (
          <section>
            <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Western Astrology
            </p>
            <NatalChartDisplay result={natalResult} />
          </section>
        )}

        <section>
          <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            BaZi — Four Pillars
          </p>
          <ElementSpotlight
            fiveElements={baziResult.fiveElements}
            name={firstName}
          />
          <p className="mt-4 text-center text-xs text-ink-faint">
            Day Master: {baziResult.dayMaster.stem} (
            {baziResult.dayMaster.element})
          </p>
        </section>

        {matrixResult && (
          <section>
            <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Matrix of Destiny
            </p>
            <MatrixDisplay result={matrixResult} />
          </section>
        )}
      </div>

      <div className="mt-10 rounded-xl2 border border-line bg-bg-surface/50 p-8 text-center">
        <h3 className="font-display text-lg text-aubergine">
          Want the deeper analysis?
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
          Your Extended Reading adds your 10-year luck cycles, a full
          written interpretation of what these three readings mean for
          you, and how they line up with each other.
        </p>
        <p className="mt-4">
          <span className="text-sm text-ink-faint line-through">$39.99</span>{" "}
          <span className="font-display text-2xl text-burgundy">$29.99</span>
        </p>
        <div className="mt-5 flex justify-center">
          <PaddleCheckoutButton>Get my extended reading</PaddleCheckoutButton>
        </div>
      </div>
    </div>
  );
}
