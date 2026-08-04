import { NatalChartResult } from "@/lib/astrology-types";
import { Card } from "@/components/ui/Card";

const SIGN_SYMBOL: Record<string, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

// The four classical elements of Western astrology (distinct from BaZi's
// five Wu Xing elements) — used here purely to give each planet card a
// consistent color by its sign's element, so the grid reads faster.
const SIGN_ELEMENT: Record<string, "fire" | "earth" | "air" | "water"> = {
  Aries: "fire", Leo: "fire", Sagittarius: "fire",
  Taurus: "earth", Virgo: "earth", Capricorn: "earth",
  Gemini: "air", Libra: "air", Aquarius: "air",
  Cancer: "water", Scorpio: "water", Pisces: "water",
};

const ELEMENT_STYLE: Record<string, { text: string; bg: string }> = {
  fire: { text: "text-elementFire", bg: "bg-elementFire/10" },
  earth: { text: "text-elementEarth", bg: "bg-elementEarth/12" },
  air: { text: "text-elementAir", bg: "bg-elementAir/10" },
  water: { text: "text-elementWater", bg: "bg-elementWater/10" },
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
          {result.planets.map((p) => {
            const el = SIGN_ELEMENT[p.sign] ?? "earth";
            const style = ELEMENT_STYLE[el];
            return (
              <div
                key={p.key}
                className={`rounded-xl2 border-2 border-transparent p-3 text-center ${style.bg}`}
              >
                <p className={`font-display text-2xl ${style.text}`}>
                  {PLANET_SYMBOL[p.key]}
                </p>
                <p className="mt-1 text-xs font-medium text-ink">{p.label}</p>
                <p className={`mt-1 text-[11px] font-medium ${style.text}`}>
                  {SIGN_SYMBOL[p.sign]} {p.sign} {p.degreeInSign}°
                </p>
                <p className="mt-0.5 text-[10px] text-ink-faint">
                  House {p.house}
                  {p.retrograde ? " · Rx" : ""}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

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
