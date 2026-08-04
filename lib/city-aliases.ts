/**
 * The city-timezones dataset only knows cities by their current official
 * name — searching an old/renamed name (very common across the former
 * USSR, and elsewhere in the world) returns nothing on its own. This maps
 * historical/alternate names to whatever name the city is searchable
 * under today, so typing either one works.
 *
 * Not exhaustive — extend as needed. Focused on renames common enough
 * that someone might reasonably type the old name from memory.
 */
export const CITY_ALIASES: Record<string, string> = {
  // Ukraine
  dnepropetrovsk: "Dnipro",
  dnipropetrovsk: "Dnipro",
  kiev: "Kyiv",
  kharkov: "Kharkiv",
  lvov: "Lviv",
  lemberg: "Lviv",
  odessa: "Odesa",
  nikolaev: "Mykolaiv",
  zaporozhye: "Zaporizhzhia",
  ivano_frankovsk: "Ivano-Frankivsk",

  // Russia / USSR
  leningrad: "Saint Petersburg",
  petrograd: "Saint Petersburg",
  stalingrad: "Volgograd",
  tsaritsyn: "Volgograd",
  gorky: "Nizhny Novgorod",
  gorkiy: "Nizhny Novgorod",
  sverdlovsk: "Yekaterinburg",
  kuybyshev: "Samara",
  kalinin: "Tver",
  molotov: "Perm",
  ordzhonikidze: "Vladikavkaz",

  // Central Asia / Caucasus
  alma_ata: "Almaty",
  frunze: "Bishkek",
  stalinabad: "Dushanbe",
  chkalov: "Orenburg",
  tiflis: "Tbilisi",
  yerivan: "Yerevan",
  kishinev: "Chisinau",

  // Elsewhere in the world with well-known historical renames
  bombay: "Mumbai",
  calcutta: "Kolkata",
  madras: "Chennai",
  saigon: "Ho Chi Minh City",
  rangoon: "Yangon",
  constantinople: "Istanbul",
  peking: "Beijing",
  canton: "Guangzhou",
  batavia: "Jakarta",
  salisbury: "Harare",
  leopoldville: "Kinshasa",
  ceylon: "Colombo",
};

/**
 * Given a typed query, returns any canonical city names whose old/alias
 * name starts with (or contains) the query — so partial typing of an old
 * name ("Dnepr...") still surfaces the modern city ("Dnipro").
 */
export function resolveAliasMatches(query: string): string[] {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return [];

  const matches = new Set<string>();
  for (const [alias, canonical] of Object.entries(CITY_ALIASES)) {
    const normalizedAlias = alias.replace(/_/g, " ");
    if (normalizedAlias.startsWith(q) || normalizedAlias.includes(q)) {
      matches.add(canonical);
    }
  }
  return [...matches];
}
