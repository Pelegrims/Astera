import cityTimezones from "city-timezones";
import { DateTime } from "luxon";
import { resolveAlternateNames } from "./city-aliases";
import { MAJOR_US_CITIES } from "./major-us-cities";

export interface CityMatch {
  label: string; // "New York, New York, United States of America"
  timezone: string; // IANA zone, e.g. "America/New_York"
  lat: number;
  lng: number;
}

/**
 * Searches city-timezones' built-in dataset (~7000 world cities). The
 * library itself supports partial matches on city, province, or country,
 * so a live-typed query like "new yo" already works without us building
 * our own fuzzy search. Also checks known historical/renamed city names
 * (see city-aliases.ts) in both directions — so typing either "Dnipro"
 * or "Dnepropetrovsk" finds the same city, regardless of which name the
 * dataset itself has on file.
 */
function safeLookup(name: string): any[] {
  try {
    const result = cityTimezones.lookupViaCity(name);
    return Array.isArray(result) ? result : [];
  } catch {
    // A single unmatched/malformed lookup should never break the rest of
    // the search — worst case, that one name just contributes nothing.
    return [];
  }
}

export function searchCities(query: string): CityMatch[] {
  const trimmed = query.trim();
  if (trimmed.length < 1) return [];

  const direct = safeLookup(trimmed);

  const alternateNames = resolveAlternateNames(trimmed);
  const alternateResults = alternateNames.flatMap((name) => safeLookup(name));

  // Merge and de-duplicate (same city can appear via both paths).
  const seen = new Set<string>();
  const merged = [...direct, ...alternateResults].filter((r: any) => {
    const key = `${r?.city}|${r?.province}|${r?.country}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Population data in the dataset can be patchy for smaller US towns —
  // well-known major cities are boosted to the top regardless, so
  // searching a state name reliably surfaces recognizable cities first
  // (e.g. "New Jersey" -> Newark, Jersey City, Trenton) instead of
  // whatever obscure town happens to have a populated `pop` field.
  const effectivePop = (r: any) => {
    const isMajorUsCity =
      r?.country === "United States of America" &&
      MAJOR_US_CITIES.has(String(r?.city ?? "").toLowerCase());
    return (isMajorUsCity ? 50_000_000 : 0) + (r?.pop ?? 0);
  };

  const sorted = merged.sort((a: any, b: any) => effectivePop(b) - effectivePop(a));

  return sorted.slice(0, 8).map((r: any) => ({
    label: [r.city, r.province, r.country].filter(Boolean).join(", "),
    timezone: r.timezone,
    lat: r.lat,
    lng: r.lng,
  }));
}

/**
 * Given an IANA timezone and a specific birth date/time, returns the
 * exact UTC offset in whole hours that was in effect at that moment —
 * this correctly accounts for historical daylight-saving rules (unlike a
 * fixed "current" UTC offset), as long as the date is within range of the
 * IANA tz database.
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
  return Math.round(dt.offset / 60);
}
