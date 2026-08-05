import { BaziStars, StarHit } from "./bazi-stars";

export interface PeriodResult {
  year: BaziPillar;
  month: BaziPillar | null;
  luck: {
    pillar: BaziPillar;
    startAge: number;
    startYear: number;
    endYear: number;
  } | null;
  hits: StarHit[];
}

export interface TransitResult {
  pillars: {
    year: BaziPillar;
    month: BaziPillar;
    day: BaziPillar;
    hour: BaziPillar;
  };
  /** The 10-year luck pillar active at the selected moment (null before the first cycle) */
  luck: {
    pillar: BaziPillar;
    startAge: number;
    startYear: number;
    endYear: number;
  } | null;
  /** Natal stars activated by the transit branches */
  hits: StarHit[];
  solarTime?: SolarTimeMoment;
}

export interface BaziPillar {
  label: string; // "Hour" | "Day" | "Month" | "Year"
  stem: string; // Heavenly Stem, e.g. "庚"
  branch: string; // Earthly Branch, e.g. "午"
  hiddenStems: string[]; // stems hidden within the branch
  /** Ten God of each hidden stem, aligned by index with hiddenStems */
  hiddenTenGods: string[];
  tenGodStem: string; // Ten God relationship of the stem to the Day Master
  element: string; // element of the stem, e.g. "Metal"
  stemYinYang: "Yin" | "Yang";
  branchElement: string; // element of the branch, e.g. "Fire" for 巳
  branchAnimal: string; // e.g. "Snake" for 巳
  /** 12-stage Qi phase (长生十二神) of the Day Master at this branch, e.g. "Peak" */
  qiPhase?: string;
}

export interface FiveElementsBalance {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface LuckPillar {
  startAge: number;
  startYear: number;
  ganZhi: string; // e.g. "壬申"
  stem: string;
  branch: string;
  stemElement: string; // for element coloring
  branchAnimal: string; // e.g. "Monkey"
}

export interface SolarTimeMoment {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  /** solar minus clock, in minutes — e.g. -118 for Kyiv, May 1989 (UTC+4, 30°31′E) */
  shiftMinutes: number;
}

export interface BaziResult {
  pillars: {
    year: BaziPillar;
    month: BaziPillar;
    day: BaziPillar;
    hour: BaziPillar;
  };
  dayMaster: {
    stem: string;
    element: string;
    yinYang: "Yin" | "Yang";
  };
  fiveElements: FiveElementsBalance;
  luckPillars: LuckPillar[];
  luckStartAge: number;
  /** Symbolic stars — deities / spirits & demons — with per-pillar hits */
  stars: BaziStars;
  /** Void (空亡) branch characters of the day pillar's 10-day cycle */
  voidBranches: string[];
  /**
   * The mean local solar time the pillars were actually computed from
   * (present when longitude was provided). Shown in the UI so results
   * can be verified at a glance against reference calculators, which
   * print this line too.
   */
  solarTime?: SolarTimeMoment;
}

export interface BaziInput {
  name: string;
  gender: "male" | "female";
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  /**
   * UTC offset of the birth clock, in hours — fractional allowed
   * (5.5 for India, 4 for Kyiv summer 1989 incl. decree time + DST).
   * Comes from offsetForDate(), i.e. the IANA tz database.
   */
  utcOffset: number;
  /**
   * Birth longitude in degrees (east positive). When provided, pillars
   * are computed from mean local solar time (clock → UTC → +lng×4min),
   * the convention Julia's reference calculator uses. Without it we
   * fall back to raw clock time (legacy behavior for old stored rows).
   */
  lng?: number;
}
