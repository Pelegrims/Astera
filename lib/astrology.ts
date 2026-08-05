import { Origin, Horoscope } from "circular-natal-horoscope-js";
import {
  AspectInfo,
  HouseCusp,
  NatalChartInput,
  NatalChartResult,
  PlanetPosition,
} from "./astrology-types";

/**
 * This wraps `circular-natal-horoscope-js` (Unlicense, MIT-equivalent),
 * which uses a real astronomical ephemeris (Moshier) — actual planetary
 * math, not an approximation, and it's pure JS with no native binaries,
 * so it runs fine in a serverless/edge environment.
 *
 * IMPORTANT: written against the library's documented API but not run
 * end-to-end in this environment (no network access here to install and
 * verify it). Before trusting this for real clients, run `npm install`
 * locally and check a chart you already know the correct planets/houses
 * for against this output.
 */

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const PLANET_KEYS = [
  "sun", "moon", "mercury", "venus", "mars",
  "jupiter", "saturn", "uranus", "neptune", "pluto",
];

/**
 * Sign rulerships — exactly the scheme Julia works with: the modern ruler
 * first, then the traditional co-ruler for the three signs that have one.
 *   Scorpio → Pluto, Mars · Aquarius → Uranus, Saturn · Pisces → Neptune, Jupiter
 * Whatever sign sits on a house cusp, that sign's planet(s) rule the house
 * (cusp of the 2nd in Virgo → Mercury rules the 2nd).
 */
const SIGN_RULERS: Record<string, string[]> = {
  Aries: ["mars"],
  Taurus: ["venus"],
  Gemini: ["mercury"],
  Cancer: ["moon"],
  Leo: ["sun"],
  Virgo: ["mercury"],
  Libra: ["venus"],
  Scorpio: ["pluto", "mars"],
  Sagittarius: ["jupiter"],
  Capricorn: ["saturn"],
  Aquarius: ["uranus", "saturn"],
  Pisces: ["neptune", "jupiter"],
};

export function rulersOfSign(sign: string): string[] {
  return SIGN_RULERS[sign] ?? [];
}

/**
 * Turns the 12 raw Placidus cusp longitudes into house records with the
 * sign on each cusp (kept at 2-decimal precision so results can be
 * checked digit-for-digit against reference calculators like astro-seek,
 * whose default is also Placidus) and that sign's ruler(s).
 * House 1's cusp is the Ascendant; house 10's is the Midheaven.
 */
export function buildHouses(houseCuspDegrees: number[]): HouseCusp[] {
  if (houseCuspDegrees.length !== 12) return [];
  return houseCuspDegrees.map((deg, i) => {
    const normalized = ((deg % 360) + 360) % 360;
    const signIndex = Math.floor(normalized / 30);
    const sign = ZODIAC_SIGNS[signIndex];
    return {
      house: i + 1,
      sign,
      degreeInSign: Math.round((normalized % 30) * 100) / 100,
      rulers: rulersOfSign(sign),
    };
  });
}

function signAndDegree(eclipticDegree: number): {
  sign: string;
  degreeInSign: number;
} {
  const normalized = ((eclipticDegree % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degreeInSign: Math.round((normalized % 30) * 10) / 10,
  };
}

/**
 * Given the 12 house cusp degrees and a planet's ecliptic degree, finds
 * which house (1-12) the planet falls in — works for any house system,
 * rather than assuming equal 30° houses.
 */
function findHouse(houseCuspDegrees: number[], planetDegree: number): number {
  const normalized = ((planetDegree % 360) + 360) % 360;
  for (let i = 0; i < 12; i++) {
    const start = houseCuspDegrees[i];
    const end = houseCuspDegrees[(i + 1) % 12];
    const inRange =
      start <= end
        ? normalized >= start && normalized < end
        : normalized >= start || normalized < end; // wraps past 360°
    if (inRange) return i + 1;
  }
  return 1;
}

export function calculateNatalChart(
  input: NatalChartInput
): NatalChartResult {
  const origin = new Origin({
    year: input.year,
    month: input.month - 1, // library is 0-indexed (0 = January)
    date: input.day,
    hour: input.hour,
    minute: input.minute,
    latitude: input.lat,
    longitude: input.lng,
  });

  const customOrbs = {
    conjunction: 2,
    opposition: 2,
    trine: 2,
    square: 2,
    sextile: 2,
    quincunx: 2,
    quintile: 2,
    septile: 2,
    "semi-square": 2,
    "semi-sextile": 2,
  };

  const horoscope = new Horoscope({
    origin,
    houseSystem: "placidus",
    zodiac: "tropical",
    aspectPoints: ["bodies", "angles"],
    aspectWithPoints: ["bodies", "angles"],
    aspectTypes: ["major", "minor"],
    customOrbs,
    language: "en",
  });

  const ascDegree =
    (horoscope.Ascendant as any)?.ChartPosition?.Ecliptic?.DecimalDegrees ?? 0;
  const mcDegree =
    (horoscope.Midheaven as any)?.ChartPosition?.Ecliptic?.DecimalDegrees ?? 0;

  // House cusps. In the installed version of circular-natal-horoscope-js
  // a house object stores its span as ChartPosition.StartPosition /
  // .EndPosition (the CUSP is the StartPosition) — unlike planets and
  // angles, which expose ChartPosition.Ecliptic directly. Reading the
  // planet-style path here silently produced 0 for every cusp ("all
  // twelve houses in Aries 0°00′, everything in House 1" — the bug the
  // first deployed version shipped with). We now try the known shapes in
  // order and then VALIDATE: by definition the 1st-house cusp IS the
  // Ascendant, so if they don't match (or cusps are degenerate), the
  // houses are treated as unavailable and hidden, never shown wrong.
  const rawHouses: any[] = (horoscope.Houses as any[]) ?? [];
  const houseCuspDegrees: number[] = rawHouses.map((h: any) => {
    const candidates = [
      h?.ChartPosition?.StartPosition?.Ecliptic?.DecimalDegrees,
      h?.ChartPosition?.Ecliptic?.DecimalDegrees,
      h?.StartPosition?.Ecliptic?.DecimalDegrees,
    ];
    const v = candidates.find(
      (c) => typeof c === "number" && Number.isFinite(c)
    );
    return typeof v === "number" ? v : NaN;
  });

  const ascCuspGap = Math.abs(
    ((houseCuspDegrees[0] - ascDegree + 540) % 360) - 180
  );
  const cuspsValid =
    houseCuspDegrees.length === 12 &&
    houseCuspDegrees.every((d) => Number.isFinite(d)) &&
    new Set(houseCuspDegrees.map((d) => Math.round(d * 10))).size > 1 &&
    ascCuspGap < 1;

  if (!cuspsValid && rawHouses.length > 0) {
    // Surfaces the actual object shape in the browser console so a future
    // library version with yet another structure is diagnosable from a
    // screenshot of DevTools instead of guesswork.
    // eslint-disable-next-line no-console
    console.warn(
      "[astera] House cusps failed validation (cusp 1 must equal the Ascendant); hiding houses. First house object:",
      rawHouses[0]
    );
  }

  const validCusps = cuspsValid ? houseCuspDegrees : [];
  const houses = buildHouses(validCusps);

  const planets: PlanetPosition[] = PLANET_KEYS.map((key) => {
    const body = (horoscope.CelestialBodies as any)?.[key];
    const degree = body?.ChartPosition?.Ecliptic?.DecimalDegrees ?? 0;
    const { sign, degreeInSign } = signAndDegree(degree);
    return {
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      sign,
      degreeInSign,
      house: validCusps.length ? findHouse(validCusps, degree) : 1,
      retrograde: Boolean(body?.isRetrograde),
      // The inverse view of the cusp rulerships: every house whose cusp
      // sign this planet rules ("Mercury rules the 2nd and the 5th").
      rulesHouses: houses
        .filter((h) => h.rulers.includes(key))
        .map((h) => h.house),
    };
  });

  const aspectsRaw: any[] = (horoscope.Aspects as any)?.all ?? [];
  const aspects: AspectInfo[] = aspectsRaw.map((a) => ({
    bodyA: a?.point1Key ?? a?.point1?.key ?? "",
    bodyB: a?.point2Key ?? a?.point2?.key ?? "",
    type: a?.aspectKey ?? a?.type ?? "",
    orb: Math.round((a?.orb ?? 0) * 10) / 10,
  }));

  const sunPlanet = planets.find((p) => p.key === "sun");

  return {
    sunSign: sunPlanet?.sign ?? "",
    ascendant: signAndDegree(ascDegree),
    midheaven: signAndDegree(mcDegree),
    planets,
    houses,
    aspects,
  };
}
