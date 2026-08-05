export interface PlanetPosition {
  key: string; // "sun", "moon", "mercury", ...
  label: string; // "Sun"
  sign: string; // "Aries"
  degreeInSign: number; // 0-30
  house: number; // 1-12
  retrograde: boolean;
  /** Houses this planet rules in THIS chart (by the sign on each cusp) */
  rulesHouses: number[];
}

export interface HouseCusp {
  house: number; // 1-12; house 1 = Ascendant, 10 = Midheaven
  sign: string; // sign on the cusp
  degreeInSign: number; // degree within the sign, 2-decimal precision
  /**
   * Ruling planet key(s) of the cusp sign — modern ruler first, then the
   * traditional co-ruler where one exists (Scorpio: pluto+mars,
   * Aquarius: uranus+saturn, Pisces: neptune+jupiter).
   */
  rulers: string[];
}

export interface AspectInfo {
  bodyA: string;
  bodyB: string;
  type: string; // "conjunction", "trine", "square", ...
  orb: number;
}

export interface NatalChartResult {
  sunSign: string;
  ascendant: { sign: string; degreeInSign: number };
  midheaven: { sign: string; degreeInSign: number };
  planets: PlanetPosition[];
  /** The 12 Placidus house cusps with their signs and rulers */
  houses: HouseCusp[];
  aspects: AspectInfo[];
}

export interface NatalChartInput {
  year: number;
  month: number; // 1-12 (converted internally to the library's 0-11)
  day: number;
  hour: number;
  minute: number;
  lat: number;
  lng: number;
}
