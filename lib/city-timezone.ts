import cityTimezones from "city-timezones";
import { DateTime } from "luxon";

export interface CityMatch {
  label: string; // "New York, New York, United States of America"
  timezone: string; // IANA zone, e.g. "America/New_York"
}

/**
 * Searches city-timezones' built-in dataset (~7000 world cities). The
 * library itself supports partial matches on city, province, or country,
 * so a live-typed query like "new yo" already works without us building
 * our own fuzzy search.
 */
export function searchCities(query: string): CityMatch[] {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const results = cityTimezones.lookupViaCity(trimmed);

  return results.slice(0, 8).map((r: any) => ({
    label: [r.city, r.province, r.country].filter(Boolean).join(", "),
    timezone: r.timezone,
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
