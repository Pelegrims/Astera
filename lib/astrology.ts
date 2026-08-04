import { Origin, Horoscope } from "circular-natal-horoscope-js";
import {
  AspectInfo,
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

  const houseCuspDegrees: number[] = (horoscope.Houses ?? []).map(
    (h: any) => h?.ChartPosition?.Ecliptic?.DecimalDegrees ?? 0
  );

  const planets: PlanetPosition[] = PLANET_KEYS.map((key) => {
    const body = (horoscope.CelestialBodies as any)?.[key];
    const degree = body?.ChartPosition?.Ecliptic?.DecimalDegrees ?? 0;
    const { sign, degreeInSign } = signAndDegree(degree);
    return {
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      sign,
      degreeInSign,
      house: houseCuspDegrees.length
        ? findHouse(houseCuspDegrees, degree)
        : 1,
      retrograde: Boolean(body?.isRetrograde),
    };
  });

  const ascDegree =
    (horoscope.Ascendant as any)?.ChartPosition?.Ecliptic?.DecimalDegrees ?? 0;
  const mcDegree =
    (horoscope.Midheaven as any)?.ChartPosition?.Ecliptic?.DecimalDegrees ?? 0;

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
    aspects,
  };
}
