import cityTimezones from "city-timezones";
import { DateTime } from "luxon";
import { resolveAlternateNames } from "./city-aliases";

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

  const sorted = merged.sort(
    (a: any, b: any) => (b.pop ?? 0) - (a.pop ?? 0)
  );

  return sorted.slice(0, 8).map((r: any) => ({
    label: [r.city, r.province, r.country].filter(Boolean).join(", "),
    timezone: r.timezone,
    lat: r.lat,
    lng: r.lng,
  }));
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
