import cityTimezones from "city-timezones";
import { DateTime } from "luxon";
import { CITY_NAME_GROUPS } from "./city-aliases";
import { MAJOR_US_CITIES } from "./major-us-cities";

export interface CityMatch {
  label: string; // "New York, New York, United States of America"
  timezone: string; // IANA zone, e.g. "America/New_York"
  lat: number;
  lng: number;
}

/**
 * Incremental city search: suggestions appear from the FIRST typed letter
 * and narrow with every keystroke. (The previous implementation used the
 * library's lookupViaCity(), which only matches a complete city name —
 * that's why nothing showed up until the whole name was typed out.)
 *
 * How it works:
 * - On first use, an index is built once over the library's full dataset
 *   (~7k cities): each city gets a set of normalized searchable names —
 *   its own name plus any historical aliases from city-aliases.ts, so
 *   typing "dnep..." finds Dnipro and "kie..." finds Kyiv regardless of
 *   which spelling the dataset itself has on file.
 * - Matching is tiered: exact name > name starts with the query >
 *   a later word starts with the query ("angel" → Los Angeles) >
 *   substring anywhere (only for 3+ chars, to keep short queries clean).
 * - Ranking within a tier: curated major US cities first (see
 *   major-us-cities.ts — capitals like Springfield, IL would otherwise be
 *   buried by patchy population data), then population, with US cities
 *   getting a ×3 population boost (US-market product) that still lets
 *   world-famous cities beat tiny US namesakes.
 *
 * Normalization folds diacritics ("zuric" finds Zürich), dots and hyphens,
 * and expands the common US abbreviations "St."/"Ft."/"Mt." — so
 * "st louis", "st. louis", and "saint louis" all work.
 */

interface IndexedCity {
  names: string[]; // normalized searchable names (primary first)
  label: string;
  timezone: string;
  lat: number;
  lng: number;
  effectivePop: number; // population, ×3 for US entries
  isMajorUs: boolean;
}

function normalizeName(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics: ü → u
    .replace(/\./g, "")
    .replace(/[-‐–—]/g, " ")
    .replace(/^st\s/, "saint ")
    .replace(/^ft\s/, "fort ")
    .replace(/^mt\s/, "mount ")
    .replace(/\s+/g, " ")
    .trim();
}

let cityIndex: IndexedCity[] | null = null;

function buildCityIndex(rawEntries: any[]): IndexedCity[] {
  // Alias lookup: normalized name → every other name in its group.
  const aliasMap = new Map<string, string[]>();
  for (const group of CITY_NAME_GROUPS) {
    const normalized = group.map(normalizeName);
    for (const name of normalized) {
      aliasMap.set(name, normalized.filter((n) => n !== name));
    }
  }

  const majorUsSet = new Set(
    MAJOR_US_CITIES.map(
      (c) => `${normalizeName(c.name)}|${normalizeName(c.province)}`
    )
  );

  const index: IndexedCity[] = [];
  for (const r of rawEntries) {
    const primaryRaw = r?.city_ascii || r?.city;
    if (!primaryRaw || !r?.timezone) continue;

    const primary = normalizeName(String(primaryRaw));
    if (!primary) continue;

    const names = [primary];
    // The non-ASCII display name can differ meaningfully (e.g. dataset
    // city "Kyiv" vs city_ascii "Kiev" or vice versa) — index both.
    if (r.city && normalizeName(String(r.city)) !== primary) {
      names.push(normalizeName(String(r.city)));
    }
    for (const n of [...names]) {
      const aliases = aliasMap.get(n);
      if (aliases) {
        for (const a of aliases) if (!names.includes(a)) names.push(a);
      }
    }

    const isUS = r.iso2 === "US" || r.country === "United States of America";
    const pop = typeof r.pop === "number" && r.pop > 0 ? r.pop : 0;
    const provinceNorm = normalizeName(String(r.province ?? ""));

    index.push({
      names,
      label: [r.city, r.province, r.country].filter(Boolean).join(", "),
      timezone: r.timezone,
      lat: r.lat,
      lng: r.lng,
      effectivePop: isUS ? pop * 3 : pop,
      isMajorUs: isUS && majorUsSet.has(`${primary}|${provinceNorm}`),
    });
  }
  return index;
}

function getCityIndex(): IndexedCity[] {
  if (!cityIndex) {
    const raw = (cityTimezones as any).cityMapping;
    cityIndex = buildCityIndex(Array.isArray(raw) ? raw : []);
  }
  return cityIndex;
}

/** 3 = exact, 2 = prefix, 1 = a later word starts with query, 0 = no match / substring */
function matchTier(names: string[], query: string, allowSubstring: boolean): number {
  let best = -1;
  const wordNeedle = ` ${query}`;
  for (const name of names) {
    if (name === query) return 3;
    if (name.startsWith(query)) best = Math.max(best, 2);
    else if (name.includes(wordNeedle)) best = Math.max(best, 1);
    else if (allowSubstring && name.includes(query)) best = Math.max(best, 0);
  }
  return best;
}

export function searchCities(query: string): CityMatch[] {
  const q = normalizeName(query);
  if (q.length < 1) return [];

  const allowSubstring = q.length >= 3;
  const scored: { tier: number; city: IndexedCity }[] = [];
  for (const city of getCityIndex()) {
    const tier = matchTier(city.names, q, allowSubstring);
    if (tier >= 0) scored.push({ tier, city });
  }

  scored.sort(
    (a, b) =>
      b.tier - a.tier ||
      Number(b.city.isMajorUs) - Number(a.city.isMajorUs) ||
      b.city.effectivePop - a.city.effectivePop ||
      a.city.label.localeCompare(b.city.label)
  );

  // De-duplicate (a city can be indexed once but different dataset rows can
  // share a label in rare cases), cap at 8 like before.
  const seen = new Set<string>();
  const out: CityMatch[] = [];
  for (const { city } of scored) {
    if (seen.has(city.label)) continue;
    seen.add(city.label);
    out.push({
      label: city.label,
      timezone: city.timezone,
      lat: city.lat,
      lng: city.lng,
    });
    if (out.length === 8) break;
  }
  return out;
}

/**
 * Given an IANA timezone and a specific birth date/time, returns the
 * exact UTC offset (in hours, possibly fractional — e.g. 5.5 for India,
 * 4 for Kyiv in the summer of 1989) that was in effect at that moment.
 * This correctly accounts for historical rules — Soviet decree time,
 * daylight saving, colonial half-hour zones — as long as the date is
 * within range of the IANA tz database.
 *
 * NOTE: this used to round to whole hours, which silently corrupted
 * half-hour zones (India +5:30 became +6). Callers that display it
 * should use formatUtcOffset() rather than string-concatenating.
 */
export function offsetForDate(
  timezone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): number {
  const dt = DateTime.fromObject(
    { year, month, day, hour, minute },
    { zone: timezone }
  );
  if (!dt.isValid) return 0;
  return dt.offset / 60;
}

/** "UTC+4", "UTC+5:30", "UTC-3:30" — for fractional-hour offsets. */
export function formatUtcOffset(offsetHours: number): string {
  const totalMinutes = Math.round(offsetHours * 60);
  const sign = totalMinutes < 0 ? "-" : "+";
  const abs = Math.abs(totalMinutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, "0")}` : ""}`;
}

/** 30.5167 → "30°31′E" — matches how reference BaZi calculators print it. */
export function formatLongitude(lng: number): string {
  const dir = lng < 0 ? "W" : "E";
  const abs = Math.abs(lng);
  const deg = Math.floor(abs);
  const min = Math.round((abs - deg) * 60);
  // 30.999 → rounds to 31°00′, not 30°60′
  const carried = min === 60;
  return `${carried ? deg + 1 : deg}°${String(carried ? 0 : min).padStart(2, "0")}′${dir}`;
}
