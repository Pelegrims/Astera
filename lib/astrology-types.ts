export interface PlanetPosition {
  key: string; // "sun", "moon", "mercury", ...
  label: string; // "Sun"
  sign: string; // "Aries"
  degreeInSign: number; // 0-30
  house: number; // 1-12
  retrograde: boolean;
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
