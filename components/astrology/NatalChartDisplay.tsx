import { NatalChartResult } from "@/lib/astrology-types";
import { Card } from "@/components/ui/Card";

const SIGN_SYMBOL: Record<string, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

const PLANET_SYMBOL: Record<string, string> = {
  sun: "☉", moon: "☽", mercury: "☿", venus: "♀", mars: "♂",
  jupiter: "♃", saturn: "♄", uranus: "♅", neptune: "♆", pluto: "♇",
};

const ASPECT_LABEL: Record<string, string> = {
  conjunction: "Conjunction", opposition: "Opposition", trine: "Trine",
  square: "Square", sextile: "Sextile", quincunx: "Quincunx",
  quintile: "Quintile", septile: "Septile",
  "semi-square": "Semi-square", "semi-sextile": "Semi-sextile",
};

const HOUSE_ANGLE: Record<number, string> = {
  1: "ASC",
  4: "IC",
  7: "DSC",
  10: "MC",
};

/** 15.75 → "15°45′" — the format reference calculators print cusps in */
function toDegMin(degreeInSign: number): string {
  const deg = Math.floor(degreeInSign);
  let min = Math.round((degreeInSign - deg) * 60);
  // 14.999 → 15°00′, not 14°60′
  const carried = min === 60;
  return `${carried ? deg + 1 : deg}°${String(carried ? 0 : min).padStart(2, "0")}′`;
}

function planetLabel(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function NatalChartDisplay({ result }: { result: NatalChartResult }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          Ascendant {SIGN_SYMBOL[result.ascendant.sign]}{" "}
          {result.ascendant.sign} {result.ascendant.degreeInSign}° · Midheaven{" "}
          {SIGN_SYMBOL[result.midheaven.sign]} {result.midheaven.sign}{" "}
          {result.midheaven.degreeInSign}°
        </p>
      </div>

      <Card className="p-6">
        <h2 className="font-display text-lg text-aubergine">
          Planets, Signs & Houses
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {result.planets.map((p) => (
            <div
              key={p.key}
              className="rounded-xl2 border border-line bg-bg-surface/60 p-3 text-center"
            >
              <p className="font-display text-2xl text-burgundy">
                {PLANET_SYMBOL[p.key]}
              </p>
              <p className="mt-1 text-xs font-medium text-ink">{p.label}</p>
              <p className="mt-1 text-[11px] text-ink-muted">
                {SIGN_SYMBOL[p.sign]} {p.sign} {p.degreeInSign}°
              </p>
              <p className="mt-0.5 text-[10px] text-ink-faint">
                House {p.house}
                {p.retrograde ? " · Rx" : ""}
              </p>
              {p.rulesHouses.length > 0 && (
                <p className="mt-0.5 text-[9px] text-ink-faint">
                  Rules: {p.rulesHouses.map((h) => `H${h}`).join(" · ")}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {result.houses.length === 12 && (
        <Card className="p-6">
          <h2 className="font-display text-lg text-aubergine">
            Houses — Placidus Cusps &amp; Rulers
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            The sign on each cusp decides the house&apos;s ruling planet —
            and where that ruler sits shows through which part of life the
            house plays out.
          </p>
          <div className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {result.houses.map((h) => (
              <div
                key={h.house}
                className="flex items-baseline justify-between gap-3 border-b border-line/60 pb-1.5"
              >
                <p className="whitespace-nowrap text-sm text-ink">
                  <span className="font-mono text-xs text-ink-faint">
                    {h.house}
                  </span>
                  {HOUSE_ANGLE[h.house] && (
                    <span className="ml-1 rounded bg-gold/15 px-1 font-mono text-[9px] text-ink-muted">
                      {HOUSE_ANGLE[h.house]}
                    </span>
                  )}{" "}
                  <span className="text-burgundy">{SIGN_SYMBOL[h.sign]}</span>{" "}
                  {h.sign}{" "}
                  <span className="text-xs text-ink-muted">
                    {toDegMin(h.degreeInSign)}
                  </span>
                </p>
                <p className="text-right text-[11px] leading-snug text-ink-muted">
                  {h.rulers.map((r, i) => {
                    const rulerPlanet = result.planets.find(
                      (p) => p.key === r
                    );
                    return (
                      <span key={r} className="whitespace-nowrap">
                        {i > 0 && ", "}
                        {PLANET_SYMBOL[r]} {planetLabel(r)}
                        {rulerPlanet && (
                          <span className="text-ink-faint">
                            {" "}
                            → H{rulerPlanet.house}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-ink-faint">
            Rulers follow the modern scheme with traditional co-rulers:
            Scorpio — Pluto &amp; Mars, Aquarius — Uranus &amp; Saturn,
            Pisces — Neptune &amp; Jupiter. &quot;→ H5&quot; marks the house
            the ruling planet itself occupies in this chart.
          </p>
        </Card>
      )}

      {result.aspects.length > 0 && (
        <Card className="p-6">
          <h2 className="font-display text-lg text-aubergine">
            Aspects (2° orb)
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.aspects.map((a, i) => (
              <span
                key={i}
                className="rounded-full border border-line bg-bg-surface/60 px-3 py-1 text-xs text-ink-muted"
              >
                {a.bodyA} {ASPECT_LABEL[a.type] ?? a.type} {a.bodyB}{" "}
                <span className="text-ink-faint">({a.orb}°)</span>
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
