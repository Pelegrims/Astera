/**
 * The city-timezones dataset may only have ONE name on file for a city
 * that's had a historical rename (very common across the former USSR,
 * and elsewhere in the world) — and we can't be certain in advance
 * whether it stored the old name or the current one. So rather than
 * mapping "old name -> new name" in one direction (a guess that could be
 * wrong), each entry below is a GROUP of known names for the same city.
 * Typing any one of them searches the dataset under all of them, so it
 * works regardless of which variant the dataset actually has on file.
 *
 * Not exhaustive — extend as needed. Focused on renames common enough
 * that someone might reasonably type an old name from memory.
 */
export const CITY_NAME_GROUPS: string[][] = [
  // Ukraine
  ["Dnipro", "Dnipropetrovsk", "Dnepropetrovsk"],
  ["Kyiv", "Kiev"],
  ["Kharkiv", "Kharkov"],
  ["Lviv", "Lvov", "Lemberg"],
  ["Odesa", "Odessa"],
  ["Mykolaiv", "Nikolaev"],
  ["Zaporizhzhia", "Zaporozhye", "Zaporizhia"],
  ["Ivano-Frankivsk", "Ivano-Frankovsk"],

  // Russia / USSR
  ["Saint Petersburg", "Leningrad", "Petrograd", "St Petersburg"],
  ["Volgograd", "Stalingrad", "Tsaritsyn"],
  ["Nizhny Novgorod", "Gorky", "Gorkiy"],
  ["Yekaterinburg", "Sverdlovsk"],
  ["Samara", "Kuybyshev"],
  ["Tver", "Kalinin"],
  ["Perm", "Molotov"],
  ["Vladikavkaz", "Ordzhonikidze"],

  // Central Asia / Caucasus
  ["Almaty", "Alma-Ata"],
  ["Bishkek", "Frunze"],
  ["Dushanbe", "Stalinabad"],
  ["Orenburg", "Chkalov"],
  ["Tbilisi", "Tiflis"],
  ["Chisinau", "Kishinev"],
  ["Astana", "Nur-Sultan", "Akmola"],

  // Elsewhere in the world with well-known historical renames
  ["Mumbai", "Bombay"],
  ["Kolkata", "Calcutta"],
  ["Chennai", "Madras"],
  ["Ho Chi Minh City", "Saigon"],
  ["Yangon", "Rangoon"],
  ["Istanbul", "Constantinople"],
  ["Beijing", "Peking"],
  ["Guangzhou", "Canton"],
  ["Jakarta", "Batavia"],
  ["Harare", "Salisbury"],
  ["Kinshasa", "Leopoldville"],
  ["Colombo", "Ceylon"],
];

/**
 * Given a typed query, returns every alternate name for any city whose
 * name group contains a match for that query (prefix or substring) —
 * so partial typing of any known name/spelling surfaces all the others
 * to also search for.
 */
export function resolveAlternateNames(query: string): string[] {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return [];

  const matches = new Set<string>();
  for (const group of CITY_NAME_GROUPS) {
    const hasMatch = group.some((name) => {
      const n = name.toLowerCase();
      return n.startsWith(q) || n.includes(q);
    });
    if (hasMatch) {
      group.forEach((name) => matches.add(name));
    }
  }
  return [...matches];
}
